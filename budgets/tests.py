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
        budget.tags.set_bit(0, True)
        budget.save()
        return budget

    def _add_record(self, amount, transaction_type='EXP', bits=None):
        bits = bits or []

        record = Record(user=self.user, transaction_type=transaction_type, amount=amount)
        for bit in bits:
            record.tags.set_bit(bit, True)
        record.save()
        return record

    def test_01_add_budget(self):
        budget = self._add_budget()
        budget.refresh_from_db()
        self.assertEqual(Budget.objects.count(), 1)
        self.assertEqual(budget.tags.mask, 1)

    def test_02_comma_separated_tags(self):
        budget = self._add_budget()
        self.assertEqual(budget.comma_separated_tags_list(), 'books')

    @freeze_time("2016-07-11")
    def test_03_average_per_day(self):
        budget = self._add_budget()
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

    @freeze_time("2016-07-11")
    def test_04_calculation(self):
        budget = self._add_budget()
        self._add_record(10, bits=[0])
        self._add_record(10, bits=[1])
        self._add_record(10, bits=[2])
        self._add_record(10, transaction_type='INC', bits=[2])

        self.assertEqual(budget.spent, 20)
        self.assertEqual(budget.left, 80)
        self.assertEqual(budget.left_average_per_day, Decimal('3.80'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

        # add record which shouldn't be taken into account
        self._add_record(10, bits=[0, 4])
        budget._update_spent()
        self.assertEqual(budget.spent, 20)
        self.assertEqual(budget.left, 80)
        self.assertEqual(budget.left_average_per_day, Decimal('3.80'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

        # add record which should be taken into account
        self._add_record(10, bits=[3, 1])
        budget._update_spent()
        self.assertEqual(budget.spent, 30)
        self.assertEqual(budget.left, 70)
        self.assertEqual(budget.left_average_per_day, Decimal('3.33'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

    @freeze_time("2016-08-10")
    def test_05_calculation_next_month(self):
        budget = self._add_budget()
        self._add_record(10, bits=[0])
        self._add_record(10, bits=[1])
        self._add_record(10, bits=[2])

        self.assertEqual(budget.spent, 20)
        self.assertEqual(budget.left, 80)
        self.assertEqual(budget.left_average_per_day, Decimal('3.63'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

        # add record which shouldn't be taken into account
        self._add_record(10, bits=[0, 4])
        budget._update_spent()
        self.assertEqual(budget.spent, 20)
        self.assertEqual(budget.left, 80)
        self.assertEqual(budget.left_average_per_day, Decimal('3.63'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

        # add record which should be taken into account
        self._add_record(10, bits=[3, 1])
        budget._update_spent()
        self.assertEqual(budget.spent, 30)
        self.assertEqual(budget.left, 70)
        self.assertEqual(budget.left_average_per_day, Decimal('3.18'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

    @freeze_time("2016-08-12")
    def test_06_include_budget_and_no_records(self):
        budget = Budget(user=self.user, amount=100, tags_type='INCL',
                        start_date=datetime.date(2016, 7, 1))
        budget.tags.set_bit(0, True)
        budget.save()
        self.assertEqual(budget.spent, 0)
        self.assertEqual(budget.left, 100)
        self.assertEqual(budget.left_average_per_day, Decimal('5.00'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

    @freeze_time("2016-08-12")
    def test_06_include_budget_with_records(self):
        budget = Budget(user=self.user, amount=100, tags_type='INCL',
                        start_date=datetime.date(2016, 7, 1))
        budget.tags.set_bit(0, True)
        budget.save()
        # add record
        record = Record(user=self.user, transaction_type='EXP', amount='10')
        for bit in [0, 1]:
            record.tags.set_bit(bit, True)
        record.save()
        self.assertEqual(budget.spent, 10)
        self.assertEqual(budget.left, 90)
        self.assertEqual(budget.left_average_per_day, Decimal('4.50'))
        self.assertEqual(budget.average_per_day, Decimal('3.22'))

    def test_07_budget_with_name(self):
        name = u'Test name'
        budget = Budget(name=name, user=self.user, amount=100, tags_type='INCL',
                        start_date=datetime.date(2016, 7, 1))
        budget.tags.set_bit(0, True)
        budget.save()
        budget.refresh_from_db()
        self.assertEqual(budget.name, name)
