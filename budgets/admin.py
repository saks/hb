from django.contrib import admin

from budgets.models import (
    Budget,
    YearBudget,
)


class BudgetAdmin(admin.ModelAdmin):
    list_display = ('get_name', 'spent', 'left', )

    def get_name(self, obj):
        has_year = hasattr(obj, 'year')
        if has_year:
            return '{} {}'.format(obj.name, obj.year)
        return obj.name


admin.site.register(Budget, BudgetAdmin)
admin.site.register(YearBudget, BudgetAdmin)
