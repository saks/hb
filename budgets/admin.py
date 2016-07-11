from django.contrib import admin

from bitfield import BitField
from bitfield.forms import BitFieldCheckboxSelectMultiple

from budgets.models import Budget


class BudgetAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_date', 'tags_type', 'spent', 'left', 'average_per_day',
                    'left_average_per_day', 'comma_separated_tags_list', 'amount', )
    list_filter = (
        'start_date',
    )
    ordering = ('start_date', )
    formfield_overrides = {
        BitField: {'widget': BitFieldCheckboxSelectMultiple},
    }

    fields = ('start_date', 'amount', 'tags_type', 'tags', 'user', )


admin.site.register(Budget, BudgetAdmin)
