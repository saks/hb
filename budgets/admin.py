from django.contrib import admin

from budgets.models import Budget


class BudgetAdmin(admin.ModelAdmin):
    list_display = ('name', 'spent', 'left', )
    list_filter = (
        'start_date',
    )
    ordering = ('start_date', )

    fields = ('name', 'start_date', 'amount', 'tags_type', 'tags', 'user', )


admin.site.register(Budget, BudgetAdmin)
