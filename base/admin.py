import csv

from django.contrib import admin
from django.http import HttpResponse


class CSVAdminMixin:
    def export_as_csv(self, request, queryset, field_data=None):
        meta = self.model._meta
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)

        # header
        field_names = [field.name for field in meta.fields]
        writer.writerow(field_names)

        # data
        for obj in queryset:
            writer.writerow([getattr(obj, field) for field in field_names])

        return response

    export_as_csv.short_description = "CSV Export Selected"


class BaseAdmin(admin.ModelAdmin, CSVAdminMixin):
    def get_actions(self, request):
        actions = super().get_actions(request)
        actions['export_as_csv'] = self.get_action('export_as_csv')
        return actions


class ArrayFieldListFilter(admin.SimpleListFilter):
    '''Filter by ArrayField'''

    title = 'Tags'
    parameter_name = 'tags'

    def lookups(self, request, model_admin):
        keywords = model_admin.model.objects.values_list(self.parameter_name, flat=True)
        keywords = [(kw, kw) for sublist in keywords for kw in sublist if kw]
        keywords = sorted(set(keywords))
        return keywords

    def queryset(self, request, queryset):
        lookup_value = self.value()  # clicked value
        if lookup_value:
            qry_filter = {
                '{}__contains'.format(self.parameter_name): [lookup_value],
            }
            queryset = queryset.filter(**qry_filter)
        return queryset
