from calendar import monthrange
from datetime import date
from decimal import ROUND_DOWN, Decimal

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.db.models import Sum
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField
from records.models import Record

TAGS_TYPE = (
    ('INCL', 'Tags Include'),
    ('EXCL', 'Tags Exclude'),
)


class BudgetAbstract(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = MoneyField(max_digits=15, decimal_places=2, default_currency='CAD')
    comment = models.TextField(null=True, blank=True)
    tags_type = models.CharField(choices=TAGS_TYPE, max_length=4)
    tags = ArrayField(models.TextField(max_length=20), default=list, blank=True)

    class Meta:
        abstract = True

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__spent = None

    @property
    def spent(self):
        if self.__spent is None:
            self._update_spent()
        return self.__spent

    @property
    def left(self):
        return self.amount.amount - self.spent

    def _get_start_day(self):
        today = timezone.now()
        start_day = date(today.year, today.month, 1)
        return start_day

    def _update_spent(self):
        start_day = self._get_start_day()
        spent = Record.objects.filter(user=self.user,
                                      transaction_type='EXP',
                                      created_at__gte=start_day)
        if self.tags_type == 'INCL' and self.tags:
            spent = spent.filter(tags__overlap=self.tags)
        if self.tags_type == 'EXCL' and self.tags:
            spent = spent.exclude(tags__overlap=self.tags)
        spent = spent.aggregate(spent=Sum('amount'))
        self.__spent = spent['spent'] if spent['spent'] else 0


class Budget(BudgetAbstract):
    '''
        Budget model defines the storage of monthly budgets.

        Tags Type field determines if include selected tags or exclude selected tags from budget.
        Amount field is MoneyField. Determines amount of money and currency. HKD by default.
        Start date field determines a start month for budget history.
    '''
    name = models.CharField(max_length=100,
                            default=_(u'Monthly budget'),
                            verbose_name=_(u'Budget name'))
    start_date = models.DateField()

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


def year_choices():
    return [(r, r) for r in range(2015, date.today().year + 1)]


def current_year():
    return date.today().year


class YearBudget(BudgetAbstract):
    name = models.CharField(max_length=100,
                            default=_(u'Year budget'),
                            verbose_name=_(u'Budget name'))
    year = models.IntegerField(_('year'), choices=year_choices(), default=current_year)

    def _get_start_day(self):
        start_day = date(self.year, 1, 1)
        return start_day
