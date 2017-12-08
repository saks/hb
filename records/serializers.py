from rest_framework import serializers

from .models import Record


class RecordSerializer(serializers.HyperlinkedModelSerializer):

    user = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name='user-detail'
    )

    class Meta:
        model = Record
        fields = ('user', 'tags', 'amount', 'transaction_type', 'created_at')
