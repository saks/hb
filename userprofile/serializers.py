from rest_framework import serializers

from .models import User
from records.models import TAGS


class UserSerializer(serializers.HyperlinkedModelSerializer):

    tags = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'email', 'tags')

    def get_tags(self, obj):
        return dict(TAGS)
