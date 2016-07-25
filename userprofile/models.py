from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser


class HBUser(AbstractUser):
    '''
        User model.
        Uses old table 'auth_user'.
    '''
    # TODO: add user profile fields
    class Meta:
        db_table = 'auth_user'

    @property
    def redis_tags_key(self):
        '''
            Return Redis key where stored sorted set of tags frequency usage.
        '''
        return settings.REDIS_KEY_USER_TAGS % (self.id,)

    def get_user_tags_order(self):
        '''
            Returns sorted by frequency of usage tags list for current user.
        '''
        tags = settings.REDIS_CONN.zrange(self.redis_tags_key, 0, -1)
        tags = [str(t, 'utf-8') for t in tags]
        return reversed(tags)
