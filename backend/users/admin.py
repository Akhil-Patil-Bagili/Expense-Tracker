from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

# Custom UserAdmin to display user ID in the list view
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined')

# Unregister the default UserAdmin and register with the CustomUserAdmin
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
