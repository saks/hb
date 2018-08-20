from rest_framework import serializers

from .models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):

    tags = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'email', 'tags')

    def get_tags(self, obj):
        return obj.get_ordered_tags()
