from rest_framework import generics
from .serializers import UserSerializer
from .models import User


class UserDetail(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
