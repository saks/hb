import datetime
from decimal import Decimal
from freezegun import freeze_time

from django.test import TestCase
from django.contrib.auth import get_user_model

from budgets.models import Budget
from records.models import Record


class BudgetsTests(TestCase):
    def setUp(self):
        UserModel = get_user_model()
        self.user = UserModel(username='test')
        self.user.save()
        self.other_user = UserModel(username='other_test')
        self.other_user.save()

    def _add_budget(self):
        budget = Budget(user=self.user, amount=100, tags_type='EXCL',
                        start_date=datetime.date(2016, 7, 1))
        budget.tags = ['cafe']
        budget.save()
        return budget

    def _add_record(self, amount, transaction_type='EXP', tags=None):
        tags = tags or []

        record = Record(user=self.user, transaction_type=transaction_type,
                        amount=amount, tags=tags)
        record.save()
        return record

    def test_01_add_budget(self):
        budget = self._add_budget()
        budget.refresh_from_db()
        self.assertEqual(Budget.objects.count(), 1)
        self.assertEqual(budget.tags, ['cafe'])

    @freeze_time("2016-07-11")
    def test_02_average_per_day(self):
        budget = self._add_budget()
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

    @freeze_time("2016-07-11")
    def test_04_calculation(self):
        # EXCL cafe
        budget = self._add_budget()
        self._add_record(10, tags=['cafe'])
        self._add_record(10, tags=['books'])
        self._add_record(10, tags=['fee'])
        self._add_record(10, transaction_type='INC', tags=['fee'])

        self.assertEqual(budget.spent, 20)
        self.assertEqual(budget.left, 80)
        self.assertEqual(budget.left_average_per_day, Decimal('3.80'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

        # add record which shouldn't be taken into account
        self._add_record(10, tags=['cafe', 'mobile'])
        budget._update_spent()
        self.assertEqual(budget.spent, 20)
        self.assertEqual(budget.left, 80)
        self.assertEqual(budget.left_average_per_day, Decimal('3.80'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

        # add record which should be taken into account
        self._add_record(10, tags=['fee', 'books'])
        budget._update_spent()
        self.assertEqual(budget.spent, 30)
        self.assertEqual(budget.left, 70)
        self.assertEqual(budget.left_average_per_day, Decimal('3.33'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

    @freeze_time("2016-08-10")
    def test_04_calculation_next_month(self):
        # EXCL cafe
        budget = self._add_budget()
        self._add_record(10, tags=['cafe'])
        self._add_record(10, tags=['books'])
        self._add_record(10, tags=['fee'])

        self.assertEqual(budget.spent, 20)
        self.assertEqual(budget.left, 80)
        self.assertEqual(budget.left_average_per_day, Decimal('3.63'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

        # add record which shouldn't be taken into account
        self._add_record(10, tags=['cafe', 'mobile'])
        budget._update_spent()
        self.assertEqual(budget.spent, 20)
        self.assertEqual(budget.left, 80)
        self.assertEqual(budget.left_average_per_day, Decimal('3.63'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

        # add record which should be taken into account
        self._add_record(10, tags=['fee', 'books'])
        budget._update_spent()
        self.assertEqual(budget.spent, 30)
        self.assertEqual(budget.left, 70)
        self.assertEqual(budget.left_average_per_day, Decimal('3.18'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

    @freeze_time("2016-08-12")
    def test_05_include_budget_and_no_records(self):
        budget = Budget(user=self.user, amount=100, tags_type='INCL',
                        start_date=datetime.date(2016, 7, 1))
        budget.tags = ['books']
        budget.save()
        self.assertEqual(budget.spent, 0)
        self.assertEqual(budget.left, 100)
        self.assertEqual(budget.left_average_per_day, Decimal('5.00'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

    @freeze_time("2016-08-12")
    def test_06_include_budget_with_records(self):
        budget = Budget(user=self.user, amount=100, tags_type='INCL',
                        start_date=datetime.date(2016, 7, 1))
        budget.tags = ['books']
        budget.save()
        # add record
        record = Record(user=self.user, transaction_type='EXP', amount='10')
        record.tags = ['books', 'cafe']
        record.save()
        self.assertEqual(budget.spent, 10)
        self.assertEqual(budget.left, 90)
        self.assertEqual(budget.left_average_per_day, Decimal('4.50'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

    def test_07_budget_with_name(self):
        name = u'Test name'
        budget = Budget(name=name, user=self.user, amount=100, tags_type='INCL',
                        start_date=datetime.date(2016, 7, 1))
        budget.tags = ['books']
        budget.save()
        budget.refresh_from_db()
        self.assertEqual(budget.name, name)
