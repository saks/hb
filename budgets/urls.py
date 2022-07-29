from django.urls import re_path, include
from rest_framework import routers

from . import views


router = routers.DefaultRouter()
router.register(r'budget-detail', views.BudgetViewSet)

urlpatterns = [
    re_path(r'^', include(router.urls)),
]
