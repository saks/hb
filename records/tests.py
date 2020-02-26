from django.conf import settings
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model

from records.models import Record


@override_settings(REDIS_KEY_USER_TAGS='test_tags_%s')
class RecordsTests(TestCase):

    def setUp(self):
        self._flush_redis()
        self.user = self._add_user()

    def tearDown(self):
        self._flush_redis()

    def _flush_redis(self):
        keys = settings.REDIS_CONN.keys('test_*')
        if keys:
            settings.REDIS_CONN.delete(*keys)

    def _add_user(self, username='test'):
        userModel = get_user_model()
        user = userModel(username=username)
        user.save()
        return user

    def _add_record(self, user, tags=[]):
        record = Record(user=user, transaction_type='EXP', amount=10, tags=tags)
        record.save()
        return record

    def test_01_add_record(self):
        record = self._add_record(user=self.user, tags=['cafe', 'fun'])
        record.refresh_from_db()
        self.assertEqual(Record.objects.count(), 1)

    def test_02_comma_separated_tags(self):
        record = self._add_record(user=self.user, tags=['cafe', 'fun'])
        self.assertEqual(str(record), 'C$10.00 cafe, fun')

    def test_03_redis_data_on_record_add(self):
        user = self._add_user(username='addrecord')
        self._add_record(user=user, tags=['cafe', 'fun'])
        self._add_record(user=user, tags=['cafe'])
        self.assertEqual(list(user.get_user_tags_order()), ['cafe', 'fun'])

    def test_04_redis_data_change_order(self):
        user = self._add_user(username='changerecord')
        self._add_record(user=user, tags=['cafe', 'fun'])
        self._add_record(user=user, tags=['fun'])
        self.assertEqual(list(user.get_user_tags_order()), ['fun', 'cafe'])

    def test_05_redis_data_on_update_record(self):
        user = self._add_user(username='updaterecord')
        record = self._add_record(user=user, tags=['cafe', 'fun'])
        self._add_record(user=user, tags=['fun'])
        self.assertEqual(list(user.get_user_tags_order()), ['fun', 'cafe'])
        record.tags = ['fun', 'books']
        record.save()
        self.assertEqual(list(user.get_user_tags_order()), ['fun', 'books'])

    def test_06_redis_data_on_delete(self):
        user = self._add_user(username='deleterecord')
        record = self._add_record(user=user, tags=['cafe', 'fun'])
        self._add_record(user=user, tags=['cafe'])
        self.assertEqual(list(user.get_user_tags_order()), ['cafe', 'fun'])
        record.delete()
        self.assertEqual(list(user.get_user_tags_order()), ['cafe'])
