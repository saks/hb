from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from userprofile.models import User


def tags(obj):
    return [tag for tag in obj.get_user_tags_order()]


tags.short_description = 'Tags'


class UserAdmin(UserAdmin):

    list_display = UserAdmin.list_display + (tags, )
    fieldsets = None
    fields = ('tags', 'username', 'password')


admin.site.register(User, UserAdmin)
