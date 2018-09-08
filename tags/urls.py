from django.conf.urls import url
from django.urls import path
from rest_framework import routers

from . import views

urlpatterns = [
    url(r'^$', views.TagsView.as_view()),  # index
]
