from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import RecordSerializer
from .models import Record


class RecordViewSet(viewsets.ModelViewSet):
    serializer_class = RecordSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Record.objects.all()

    def get_queryset(self):
        return Record.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
