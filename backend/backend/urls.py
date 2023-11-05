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

# Serve React's build folder and index.html as a fallback
urlpatterns += [
    re_path(r'^static/(?P<path>.*)$', serve, {
        'document_root': os.path.join(settings.BASE_DIR, 'frontend/build/static')
    }),
    re_path(r'^.*$', serve, {
        'document_root': os.path.join(settings.BASE_DIR, 'frontend/build'),
        'path': 'index.html'
    }),
]
