from django.conf.urls import include, url

from userprofile import views


urlpatterns = [url(r'^(?P<pk>[0-9]+)/$', views.UserDetail.as_view(), name='user-detail')]
