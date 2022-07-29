from django.urls import re_path
from rest_framework import routers

from . import views

urlpatterns = [
    re_path(r'^$', views.TagsView.as_view()),  # index
]
