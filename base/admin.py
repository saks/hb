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
