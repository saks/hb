from rest_framework import serializers

from .models import Budget


class BudgetSerializer(serializers.HyperlinkedModelSerializer):

    user = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name='user-detail'
    )

    class Meta:
        model = Budget
        fields = ('name', 'user', 'amount', 'spent', 'left',
                  'average_per_day', 'left_average_per_day')
