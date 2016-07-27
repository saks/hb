from django.conf import settings
from django.test import TestCase, override_settings

from userprofile.models import User


@override_settings(REDIS_KEY_USER_TAGS='test_tags_%s')
class UserTests(TestCase):

    def setUp(self):
        self._flush_redis()
        self.user = User(username='test')
        self.user.save()

    def tearDown(self):
        self._flush_redis()

    def _flush_redis(self):
        keys = settings.REDIS_CONN.keys('test_*')
        if keys:
            settings.REDIS_CONN.delete(*keys)

    def _add_data_to_redis(self):
        redis_key = settings.REDIS_KEY_USER_TAGS % self.user.id
        settings.REDIS_CONN.zincrby(redis_key, 'books', 1)
        settings.REDIS_CONN.zincrby(redis_key, 'books', 1)
        settings.REDIS_CONN.zincrby(redis_key, 'tax', 1)

    def test_01_empty_user_tags_list(self):
        self.assertEqual(list(self.user.get_user_tags_order()), [])

    def test_02_get_user_tags_list(self):
        self._add_data_to_redis()
        self.assertEqual(list(self.user.get_user_tags_order()), ['books', 'tax'])
