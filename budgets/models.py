from calendar import monthrange
from datetime import date
from decimal import ROUND_DOWN, Decimal

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.db.models import Sum
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField
from records.models import Record

TAGS_TYPE = (
    ('INCL', 'Tags Include'),
    ('EXCL', 'Tags Exclude'),
)


class Budget(models.Model):
    '''
        Budget model defines the storage of monthly budgets.

        Tags Type field determines if include selected tags or exclude selected tags from budget.
        Amount field is MoneyField. Determines amount of money and currency. HKD by default.
        Start date field determines a start month for budget history.
    '''
    name = models.CharField(
        max_length=100,
        default=_(u'Monthly budget'),
        verbose_name=_(u'Budget name'))
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = MoneyField(
        max_digits=15, decimal_places=2, default_currency='CAD')
    start_date = models.DateField()
    tags_type = models.CharField(choices=TAGS_TYPE, max_length=4)
    tags = ArrayField(
        models.TextField(max_length=20), null=False, blank=True, default=[])

    def __init__(self, *args, **kwargs):
        super(Budget, self).__init__(*args, **kwargs)
        self.__spent = None

    def __str__(self):
        return '%r: %r' % (self.user, self.amount)

    @property
    def average_per_day(self):
        days = monthrange(date.today().year, date.today().month)[1]
        return (self.amount.amount / days).quantize(
            Decimal('.01'), rounding=ROUND_DOWN)

    @property
    def left_average_per_day(self):
        days = monthrange(date.today().year, date.today().month)[1]
        rest_days = days - date.today(
        ).day + 1  # we need to take into account spendings for today
        return (self.left / rest_days).quantize(
            Decimal('.01'), rounding=ROUND_DOWN)

    def _update_spent(self):
        today = date.today()
        first_month_day = date(today.year, today.month, 1)
        spent = Record.objects.filter(
            user=self.user,
            transaction_type='EXP',
            created_at__gte=first_month_day)
        if self.tags_type == 'INCL' and self.tags:
            spent = spent.filter(tags__overlap=self.tags)
        if self.tags_type == 'EXCL' and self.tags:
            spent = spent.exclude(tags__overlap=self.tags)
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
