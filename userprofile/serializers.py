import itertools

from rest_framework import serializers

from .models import User
from records.models import Record


class UserSerializer(serializers.HyperlinkedModelSerializer):

    tags = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'email', 'tags')

    def get_tags(self, obj):
        all_tags = list(Record.objects
                              .all()
                              .values_list('tags', flat=True))
        return set(itertools.chain(*all_tags))
