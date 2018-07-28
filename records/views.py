from rest_framework import viewsets
from rest_framework import permissions

from djmoney.money import Money

from .serializers import RecordSerializer
from .models import Record


class RecordViewSet(viewsets.ModelViewSet):
    serializer_class = RecordSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Record.objects.order_by('-created_at').all()

    def get_queryset(self):
        return Record.objects \
                     .filter(user=self.request.user) \
                     .order_by('-created_at')

    def perform_update(self, serializer):
        '''
        {"transaction_type": "EXP", "tags":["books"], "amount":{"amount": 15, "currency": "CAD"}}
        '''
        amount = self.request.data.get('amount')
        tags = self.request.data.get('tags')

        amount = Money(amount['amount'], amount['currency'])
        serializer.save(tags=tags, amount=amount)

    def perform_create(self, serializer):
        '''
        {"transaction_type": "EXP", "tags":["books"], "amount":{"amount": 15, "currency": "CAD"}}
        '''
        amount = self.request.data.get('amount')
        tags = self.request.data.get('tags')
        if amount and 'amount' in amount.keys() and 'currency' in amount.keys():
            amount = Money(amount['amount'], amount['currency'])
        serializer.save(tags=tags, user=self.request.user, amount=amount)
