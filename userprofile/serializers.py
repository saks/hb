from rest_framework import serializers

from .models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):

    records = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='record-detail',
        source='record_set',
        read_only=True
    )

    budgets = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='budget-detail',
        source='budget_set',
        read_only=True
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'is_staff',
                  'is_superuser', 'records', 'budgets',)
