from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from records.models import Record


class RecordsTests(TestCase):
    def setUp(self):
        userModel = get_user_model()
        self.user = userModel(username='test')
        self.user.save()

    def _add_record(self):
        record = Record(user=self.user, transaction_type='EXP', amount=10)
        record.tags.set_bit(1, True)
        record.tags.set_bit(5, True)
        record.save()
        return record

    def test_01_add_record(self):
        record = self._add_record()
        record.refresh_from_db()
        self.assertEqual(Record.objects.count(), 1)
        self.assertEqual(record.tags.mask, 34)

    def test_02_comma_separated_tags(self):
        record = self._add_record()
        self.assertEqual(record.comma_separated_tags_list(), 'cafe, fun')
