from django.contrib import admin

from bitfield import BitField
from bitfield.forms import BitFieldCheckboxSelectMultiple

from budgets.models import Budget


class BudgetAdmin(admin.ModelAdmin):
    list_display = ('name', 'spent', 'left', )
    list_filter = (
        'start_date',
    )
    ordering = ('start_date', )
    formfield_overrides = {
        BitField: {'widget': BitFieldCheckboxSelectMultiple},
    }

    fields = ('name', 'start_date', 'amount', 'tags_type', 'tags', 'user', )


admin.site.register(Budget, BudgetAdmin)
