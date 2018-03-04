from django.conf.urls import url, include
from rest_framework import routers

from . import views


router = routers.DefaultRouter()
router.register(r'budget-detail', views.BudgetViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
