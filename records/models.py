from django.db import models
from django.conf import settings
from django.db.models.signals import pre_save, pre_delete
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


class Record(models.Model):
    '''
        Record model defines the storage of income/expences records.

        Tags field is BitField. Order of tags items shouldn't be changed.
        Amount field is MoneyField. Determines amount of money and currency. HKD by default.
        Transaction type determines EXP(Expences) or INC(Income) the record is.
    '''

    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    tags = BitField(flags=TAGS, validators=[MinValueValidator(1, message=_(u'Select any tag.'))])
    amount = MoneyField(max_digits=15, decimal_places=2, default_currency='HKD')
    transaction_type = models.CharField(choices=TRANSACTION_TYPE, max_length=3)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def redis_tags_key(self):
        '''
            Return Redis key where stored sorted set of tags frequency usage.
        '''
        return settings.REDIS_KEY_USER_TAGS % (self.user_id,)

    def get_tags_list(self):
        return [k for k,v in self.tags.items() if v]

    def comma_separated_tags_list(self):
        return ', '.join(self.get_tags_list())
    comma_separated_tags_list.short_description = 'Comma separated tags'

    def __str__(self):
        return '%s %s' % (', '.join([k for k, v in self.tags.items() if v]), self.amount)

    def remove_tags_weights(self):
        r = settings.REDIS_CONN
        for tag in self.get_tags_list():
            r.zincrby(self.redis_tags_key, tag, -1)
            if not r.zscore(self.redis_tags_key, tag):
                r.zrem(self.redis_tags_key, tag)

    def add_tags_weights(self):
        for tag in self.get_tags_list():
            settings.REDIS_CONN.zincrby(self.redis_tags_key, tag, 1)


def update_tags_weight(sender, **kwargs):
    instance = kwargs['instance']
    _tags_updated = False

    # remove weights if update
    if instance.pk:
        orig = Record.objects.get(pk=instance.pk)
        if orig.tags.mask != instance.tags.mask:
            _tags_updated = True
            orig.remove_tags_weights()

    # add tags weight on create or update tags
    if not instance.pk or _tags_updated:
        instance.add_tags_weights()

def delete_tags_weight(sender, **kwargs):
    instance = kwargs['instance']
    instance.remove_tags_weights()

pre_save.connect(update_tags_weight, sender=Record)
pre_delete.connect(delete_tags_weight, sender=Record)
