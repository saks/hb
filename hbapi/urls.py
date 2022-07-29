"""hbapi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.urls import re_path, include
from django.contrib import admin

# for local static serve
from django.contrib.staticfiles import views
from django.urls import reverse_lazy
from django.views.generic.base import RedirectView

favicon_view = RedirectView.as_view(url='/static/img/favicon.ico', permanent=True)

urlpatterns = [
    re_path(r'^$', RedirectView.as_view(url=reverse_lazy('admin:index'), permanent=True)),
    re_path(r'^favicon\.ico$', favicon_view),
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^api/records/', include('records.urls')),
    re_path(r'^api/user/', include('userprofile.urls')),
    re_path(r'^api/budgets/', include('budgets.urls')),
    re_path(r'^api/tags/', include('tags.urls')),
    re_path(r'^api/auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.jwt')),
]

if settings.DEBUG:
    urlpatterns += [
        re_path(r'^static/(?P<path>.*)$', views.serve),
    ]
