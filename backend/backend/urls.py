# 📂 File: backend/backend/urls.py (Main Project URL)
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),       # User App
    path('api/properties/', include('properties.urls')), # Properties App
    path('api/relocation/', include('relocation.urls')), # Relocation App
    path('api/chat/', include('chat.urls')),             # Chat App
    path('api/payments/', include('payments.urls')),     # ✅ Naya Payments URL
]

# 👇 Image Uploads ke liye ye zaroori hai
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)