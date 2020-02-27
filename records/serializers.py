import decimal
import time

import moneyed
from djmoney.money import Money
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Record


class RecordSerializer(serializers.HyperlinkedModelSerializer):

    user = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='user-detail')
    amount = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Record
        fields = ('id', 'user', 'tags', 'amount', 'transaction_type', 'comment', 'created_at')

    def get_amount(self, obj):
        return {
            'amount': obj.amount.amount,
            'currency': {
                'code': obj.amount.currency.code,
                'name': obj.amount.currency.name
            }
        }

    def get_created_at(self, obj):
        return time.mktime(obj.created_at.timetuple())

    # TODO: use the same format for:
    # - record list API
    # - record validation
    # def validate(self, data):
    #     '''
    #     {
    #         "tags": [
    #             "Food",
    #             "Transport"
    #         ],
    #         "amount": {
    #             "amount": 1.0,
    #             "currency":  "CAD"
    #         },
    #         "transaction_type": "EXP"
    #     }
    #     '''
    #     if 'request' in self.context:
    #         request = self.context['request']
    #         if 'amount' not in request.data:
    #             raise ValidationError('Amount required.')
    #         amount = request.data.get('amount')
    #         if 'amount' not in amount or 'currency' not in amount:
    #             raise ValidationError('Amount and Currency is required')
    #         try:
    #             Money(amount['amount'], amount['currency'])
    #         except decimal.InvalidOperation:
    #             raise ValidationError('Amount is invalid.')
    #         except moneyed.classes.CurrencyDoesNotExist:
    #             raise ValidationError('Currency code is invalid.')
