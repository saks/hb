from django.contrib import admin

from bitfield import BitField
from bitfield.forms import BitFieldCheckboxSelectMultiple

from records.models import Record


class RecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'transaction_type',
                    'comma_separated_tags_list', 'amount',)
    list_editable = ('amount',)
    list_filter = (
        'transaction_type',
    )
    ordering = ('-created_at', )
    formfield_overrides = {
        BitField: {'widget': BitFieldCheckboxSelectMultiple},
    }

    fields = ('amount', 'tags', 'transaction_type', 'user', )

    class Media:
        css = {
            'all': ('/static/css/admin/change_records.css',),
        }
        js = ('/static/js/admin/change_records.js',)

admin.site.register(Record, RecordAdmin)
