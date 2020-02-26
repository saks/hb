import logging

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import ugettext_lazy as _

from djmoney.models.fields import MoneyField


TRANSACTION_TYPE = (
    ('EXP', _('Expences')),
    ('INC', _('Income')),
)

log = logging.getLogger('apps')


class Record(models.Model):
    '''
        Record model defines the storage of income/expences records.

        Amount field is MoneyField. Determines amount of money and currency. CAD by default.
        Transaction type determines EXP(Expences) or INC(Income) the record is.
    '''

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tags = ArrayField(models.CharField(max_length=20))
    amount = MoneyField(max_digits=15, decimal_places=2, default_currency='CAD')
    transaction_type = models.CharField(choices=TRANSACTION_TYPE, max_length=3)
    created_at = models.DateTimeField(default=timezone.now, blank=True)

    @property
    def redis_tags_key(self):
        '''
            Return Redis key where stored sorted set of tags frequency usage.
        '''
        return settings.REDIS_KEY_USER_TAGS % (self.user_id,)

    def __str__(self):
        return '%s %s' % (self.amount, ', '.join(self.tags))

    def remove_tags_weights(self):
        '''
            Remove tags from frequency tags set.
        '''
        log.debug('Remove tags weights')
        pipe = settings.REDIS_CONN.pipeline()
        for tag in self.tags:
            pipe.zincrby(self.redis_tags_key, -1, tag)

        # remove 0 score tags
        pipe.zremrangebyscore(self.redis_tags_key, 0, 0)
        pipe.execute()

    def add_tags_weights(self):
        '''
            Add tags to usage frequency set.
        '''
        log.debug('Add tags weights')
        pipe = settings.REDIS_CONN.pipeline()
        for tag in self.tags:
            pipe.zincrby(self.redis_tags_key, 1, tag)
        pipe.execute()
