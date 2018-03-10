import time

from rest_framework import serializers

from .models import Record


class RecordSerializer(serializers.HyperlinkedModelSerializer):

    user = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name='user-detail'
    )
    tags = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Record
        fields = ('id', 'user', 'tags', 'amount', 'transaction_type', 'created_at')

    def get_tags(self, obj):
        tags = [i[0] for i in obj.tags.items() if i[1]]
        tags = {t: obj.tags.get_label(t) for t in tags}
        return tags

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
