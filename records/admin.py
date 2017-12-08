from django.contrib import admin
from django.forms import TextInput

from bitfield import BitField

from records.models import Record
from records.widgets import TagsWidget


class RecordAdmin(admin.ModelAdmin):

    list_display = ('id', 'user', 'created_at', 'transaction_type',
                    'comma_separated_tags_list', 'amount',)
    list_editable = ('amount', 'user', 'created_at')
    list_filter = (
        'created_at',
        'transaction_type',
    )
    ordering = ('-created_at', )
    formfield_overrides = {
        BitField: {'widget': TagsWidget},
    }
    fields = ('amount', 'tags', 'transaction_type', 'user', )

    def get_form(self, request, obj=None, **kwargs):
        form = super(RecordAdmin, self).get_form(request, obj, **kwargs)
        user_tags_order = request.user.get_user_tags_order()

        # update widget attrs for admin
        form.base_fields['amount'].widget.widgets[0] = TextInput(attrs={'pattern': '[0-9]',
                                                                        'type': 'tel',
                                                                        'autocomplete': 'off'})
        form.base_fields['tags'].widget.attrs.update({'user_tags_order': user_tags_order})
        return form

    class Media:
        css = {
            'all': ('/static/css/admin/change_records.css',),
        }
        js = ('/static/js/admin/change_records.js',)


admin.site.register(Record, RecordAdmin)
