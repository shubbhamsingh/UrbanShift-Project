# 📂 File: backend/backend/urls.py (Main Project URL)
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),       # User App
    path('api/properties/', include('properties.urls')), # ✅ Ab ye sahi jagah point karega
    path('api/relocation/', include('relocation.urls')),
    # ...
path('api/chat/', include('chat.urls')),
]

# 👇 Image Uploads ke liye ye zaroori hai
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)