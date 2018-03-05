from rest_framework import serializers

from .models import User
from records.models import TAGS


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

    tags = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'email', 'is_staff',
                  'is_superuser', 'records', 'budgets', 'tags')

    def get_tags(self, obj):
        return dict(TAGS)
