from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/properties/', include('properties.urls')),
    path('api/users/', include('users.urls')),
    
    # ✅ Packers & Movers ka rasta yahan joda gaya hai:
    path('api/relocation/', include('relocation.urls')),
]

# Media files (Images) ke liye settings
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)