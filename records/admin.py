from datetime import date
from decimal import Decimal

from django.contrib.admin.widgets import AdminDateWidget
from django.contrib import admin
from django.template.response import TemplateResponse
from django.db.models import Func, F, Value, Sum, CharField
from django.urls import path
from django import forms

from base.admin import BaseAdmin
from records.models import Record


class DateRangeForm(forms.Form):
    date_from = forms.DateField(widget=AdminDateWidget(attrs={'type': 'date'}))
    date_to = forms.DateField(widget=AdminDateWidget(attrs={'type': 'date'}))
    show_combo_stat = forms.BooleanField(required=False)


class RecordAdmin(BaseAdmin):

    list_display = (
        'id',
        'user',
        'created_at',
        'transaction_type',
        'tags',
        'amount',
        'comment',
    )
    list_editable = ('amount', 'user', 'created_at')
    list_per_page = 10
    list_filter = (
        'created_at',
        'transaction_type',
        'tags',
    )
    ordering = ('-created_at',)
    fields = ('amount', 'tags', 'transaction_type', 'user', 'comment')

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [path('stat_by_tags/', self.admin_site.admin_view(self.stat_by_tags))]
        return my_urls + urls

    def stat_by_tags(self, request):
        # default data
        initial = {
            'date_from': date(date.today().year, 1, 1),
            'date_to': date.today(),
            'show_combo_stat': False,
        }
        if request.GET:
            initial = request.GET

        # filter records
        date_range_form = DateRangeForm(data=initial)
        if date_range_form.is_valid():
            date_filter = date_range_form.cleaned_data
        else:
            date_filter = initial

        context = dict(
            # Include common variables for rendering the admin template.
            self.admin_site.each_context(request),
            # Anything else you want in the context...
            opts=Record._meta,
            stats=self._get_stat_by_tag_combo(date_filter)
            if date_filter['show_combo_stat']
            else self._get_stat_by_tag(date_filter),
            date_range_form=date_range_form,
        )
        return TemplateResponse(request, 'admin/records/stat_by_tags.html', context)

    def _get_expense_records(self, date_filter):
        records = Record.objects.filter(
            created_at__gte=date_filter['date_from'],
            created_at__lte=date_filter['date_to'],
            transaction_type='EXP',
        )
        return records

    def _get_stat_by_tag_combo(self, date_filter):
        records = self._get_expense_records(date_filter).order_by('tags')
        records = (
            records.annotate(
                tag_combo=Func(
                    F('tags'),
                    Value('-'),
                    function='array_to_string',
                    output_field=CharField(),
                )
            )
            .values('tag_combo')
            .annotate(tag_name=F('tag_combo'), total=Sum('amount'))
            .values('tag_name', 'total')
        )
        return records

    def _get_stat_by_tag(self, date_filter):
        records = self._get_expense_records(date_filter)
        # get current year records and cal by tags
        records = (
            records.annotate(tag_name=Func(F('tags'), function='unnest'))
            .values('tag_name')
            .annotate(total=Sum('amount'))
        )
        return records

    def get_form(self, request, obj=None, **kwargs):
        form = super(RecordAdmin, self).get_form(request, obj, **kwargs)
        user_tags_order = request.user.get_ordered_tags()

        # update widget attrs for admin
        form.base_fields['amount'].widget.widgets[0] = forms.TextInput(
            attrs={'pattern': '[0-9]', 'type': 'tel', 'autocomplete': 'off'}
        )
        form.base_fields['tags'].widget.attrs.update({'user_tags_order': user_tags_order})
        return form

    class Media:
        css = {
            'all': ('/static/css/admin/change_records.css',),
        }
        js = ('/static/js/admin/change_records.js',)


admin.site.register(Record, RecordAdmin)
