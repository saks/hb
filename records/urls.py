from django.urls import re_path, include
from rest_framework import routers

from . import views


router = routers.DefaultRouter()
router.register(r'record-detail', views.RecordViewSet)

urlpatterns = [
    re_path(r'^', include(router.urls)),
]
