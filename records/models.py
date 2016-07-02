from django.db import models
from django.conf import settings
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
    tags = BitField(flags=TAGS)
    amount = MoneyField(max_digits=15, decimal_places=2, default_currency='HKD')
    transaction_type = models.CharField(choices=TRANSACTION_TYPE, max_length=3)
    created_at = models.DateTimeField(auto_now_add=True)

    def comma_separated_tags_list(self):
        return ', '.join([k for k, v in self.tags.items() if v])
    comma_separated_tags_list.short_description = 'Comma separated tags'

    def __str__(self):
        return '%s %s' % (', '.join([k for k, v in self.tags.items() if v]), self.amount)
