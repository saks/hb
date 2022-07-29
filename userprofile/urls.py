from django.urls import include, re_path

from userprofile import views


urlpatterns = [re_path(r'^(?P<pk>[0-9]+)/$', views.UserDetail.as_view(), name='user-detail')]
