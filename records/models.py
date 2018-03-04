import logging

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.utils.translation import ugettext_lazy as _

from bitfield import BitField

from djmoney.models.fields import MoneyField


TRANSACTION_TYPE = (
    ('EXP', 'Expences'),
    ('INC', 'Income'),
)
TAGS = (
    ('books', 'Books'),
    ('cafe', 'Cafe'),
    ('clothes', 'Clothes'),
    ('fees', 'Fees'),
    ('food', 'Food'),
    ('fun', 'Fun'),
    ('gift', 'Gift'),
    ('health', 'Health'),
    ('hobby', 'Hobby'),
    ('household', 'Household'),
    ('hz', 'HZ'),
    ('internet', 'Internet'),
    ('lunch', 'Lunch'),
    ('managment_fee', 'Managment fee'),
    ('mobile', 'Mobile'),
    ('rent', 'Rent'),
    ('school', 'School'),
    ('sport', 'Sport'),
    ('tax', 'Tax'),
    ('technics', 'Technics'),
    ('to_save', 'To savings'),
    ('toys', 'Toys'),
    ('transport', 'Transport'),
    ('travel', 'Travel'),
    ('salary', 'Salary'),
    ('other', 'Other'),
)

log = logging.getLogger('apps')


class Record(models.Model):
    '''
        Record model defines the storage of income/expences records.

        Tags field is BitField. Order of tags items shouldn't be changed.
        Amount field is MoneyField. Determines amount of money and currency. CAD by default.
        Transaction type determines EXP(Expences) or INC(Income) the record is.
    '''

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tags = BitField(flags=TAGS, validators=[MinValueValidator(1, message=_(u'Select any tag.'))])
    amount = MoneyField(max_digits=15, decimal_places=2, default_currency='CAD')
    transaction_type = models.CharField(choices=TRANSACTION_TYPE, max_length=3)
    created_at = models.DateTimeField(default=timezone.now, blank=True)

    @property
    def redis_tags_key(self):
        '''
            Return Redis key where stored sorted set of tags frequency usage.
        '''
        return settings.REDIS_KEY_USER_TAGS % (self.user_id,)

    def get_tags_list(self):
        return [k for k, v in self.tags.items() if v]

    def comma_separated_tags_list(self):
        return ', '.join(self.get_tags_list())
    comma_separated_tags_list.short_description = 'Comma separated tags'

    def __str__(self):
        return '%s %s' % (', '.join([k for k, v in self.tags.items() if v]), self.amount)

    def remove_tags_weights(self):
        '''
            Remove tags from frequency tags set.
        '''
        log.debug('Remove tags weights')
        pipe = settings.REDIS_CONN.pipeline()
        for tag in self.get_tags_list():
            pipe.zincrby(self.redis_tags_key, tag, -1)

        # remove 0 score tags
        pipe.zremrangebyscore(self.redis_tags_key, 0, 0)
        pipe.execute()

    def add_tags_weights(self):
        '''
            Add tags to usage frequency set.
        '''
        log.debug('Add tags weights')
        pipe = settings.REDIS_CONN.pipeline()
        for tag in self.get_tags_list():
            pipe.zincrby(self.redis_tags_key, tag, 1)
        pipe.execute()
