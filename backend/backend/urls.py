from django.contrib import admin
from django.urls import path, re_path, include
from django.views.static import serve
from django.conf import settings
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('', include('users.urls')),  # Include users app URLs for root URL
]

