from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    '''
    User model.
    Uses old table 'auth_user'.
    '''
    tags = ArrayField(models.CharField(max_length=30), null=True, blank=True)

    class Meta:
        db_table = 'auth_user'

    @property
    def redis_tags_key(self):
        '''
        Return Redis key where stored sorted set of tags frequency usage.
        '''
        return settings.REDIS_KEY_USER_TAGS % (self.id,)

    def get_tags_order_by_frequency(self):
        '''
        Returns sorted by frequency of usage tags list for current user.
        '''
        tags = settings.REDIS_CONN.zrange(self.redis_tags_key, 0, -1)
        tags = [str(t, 'utf-8') for t in tags]
        return reversed(tags)

    def get_ordered_tags(self):
        '''
        Order tags according to tags frequency in redis.
        '''
        ordered = self.get_tags_order_by_frequency()
        result = []
        for item in ordered:
            if item in self.tags:
                result.append(item)
        for tag in self.tags:
            if tag not in result:
                result.append(tag)
        return result
