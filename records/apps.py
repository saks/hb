from django.apps import AppConfig


class RecordsConfig(AppConfig):
    name = 'records'

    def ready(self):
        import records.signals
