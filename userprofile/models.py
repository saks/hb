from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser


class HBUser(AbstractUser):
    #TODO: add user profile fields
    class Meta:
        db_table = 'auth_user'

    def get_user_tags_order(self):
        tags = settings.REDIS_CONN.zrange(settings.REDIS_KEY_USER_TAGS % self.id, 0, -1)
        tags = [str(t, 'utf-8') for t in tags]
        return reversed(tags)
