from djmoney.money import Money
from rest_framework import permissions, viewsets

from .models import Record
from .serializers import RecordSerializer


class RecordViewSet(viewsets.ModelViewSet):
    serializer_class = RecordSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Record.objects.order_by('-created_at').all()

    def get_queryset(self):
        return Record.objects.filter(user=self.request.user).order_by('-created_at')

    def _save(self, serializer):
        '''
        {
            "transaction_type": "EXP",
            "tags":["books"],
            "amount":{
                "amount": 15, "currency": { "code":"CAD", "name": "foo" }
            }
        }
        '''

        amount = self.request.data.get('amount')
        tags = self.request.data.get('tags')
        if amount and 'amount' in amount.keys() and 'currency' in amount.keys():
            amount = Money(amount['amount'], amount['currency']['code'])
        serializer.save(tags=tags, user=self.request.user, amount=amount)

    def perform_create(self, serializer):
        self._save(serializer)

    def perform_update(self, serializer):
        self._save(serializer)
