from datetime import date
from decimal import Decimal, ROUND_DOWN
from calendar import monthrange
from operator import __or__ as OR
from functools import reduce

from django.db import models
from django.db.models import Q
from django.db.models import Sum
from django.conf import settings

from bitfield import BitField
from djmoney.models.fields import MoneyField

from records.models import Record, TAGS


TAGS_TYPE = (
    ('INCL', 'Tags Include'),
    ('EXCL', 'Tags Exclude'),
)


class Budget(models.Model):
    '''
        Budget model defines the storage of monthly budgets.

        Tags field is BitField. Order of tags items shouldn't be changed.
        Tags Type field determines if include selected tags or exclude selected tags from budget.
        Amount field is MoneyField. Determines amount of money and currency. HKD by default.
        Start date field determines a start month for budget history.
    '''
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    amount = MoneyField(max_digits=15, decimal_places=2, default_currency='HKD')
    start_date = models.DateField()
    tags_type = models.CharField(choices=TAGS_TYPE, max_length=4)
    tags = BitField(flags=TAGS)

    def __init__(self, *args, **kwargs):
        super(Budget, self).__init__(*args, **kwargs)
        self.__spent = None

    def get_tags_list(self):
        return [k for k, v in self.tags.items() if v]

    def comma_separated_tags_list(self):
        return ', '.join(self.get_tags_list())
    comma_separated_tags_list.short_description = 'Comma separated tags'

    def __str__(self):
        return '%r: %r' % (self.user, self.amount)

    @property
    def average_per_day(self):
        days = monthrange(date.today().year, date.today().month)[1]
        return (self.amount.amount/days).quantize(Decimal('.01'), rounding=ROUND_DOWN)

    @property
    def left_average_per_day(self):
        days = monthrange(date.today().year, date.today().month)[1]
        rest_days = days - date.today().day + 1  # we need to take into account spendings for today
        return (self.left/rest_days).quantize(Decimal('.01'), rounding=ROUND_DOWN)

    def _update_spent(self):
        today = date.today()
        first_month_day = date(today.year, today.month, 1)
        spent = Record.objects.filter(user=self.user,
                                      transaction_type='EXP',
                                      created_at__gte=first_month_day)
        tags_list = []
        for tag in self.get_tags_list():
            tags_list.append(Q(tags=getattr(Record.tags, tag)))
        if self.tags_type == 'INCL':
            spent = spent.filter(reduce(OR, tags_list))
        if self.tags_type == 'EXCL':
            spent = spent.exclude(reduce(OR, tags_list))
        spent = spent.aggregate(spent=Sum('amount'))
        self.__spent = spent['spent'] if spent['spent'] else 0

    @property
    def spent(self):
        if self.__spent is None:
            self._update_spent()
        return self.__spent

    @property
    def left(self):
        return self.amount.amount - self.spent
