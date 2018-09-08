from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from userprofile.models import User


class UserAdmin(UserAdmin):
    list_display = (
        'username',
        'tags',
    )
    fieldsets = None
    fields = ('tags', 'username', 'password')


admin.site.register(User, UserAdmin)
