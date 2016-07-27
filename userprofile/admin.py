from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from userprofile.models import User


class UserAdmin(UserAdmin):
    pass

admin.site.register(User, UserAdmin)
