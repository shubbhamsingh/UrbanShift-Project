# 📂 File: backend/backend/urls.py (Main Project URL)
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

# ✅ Simple Health Check for Cron Jobs
def health_check(request):
    return HttpResponse("OK")

urlpatterns = [
    path('', health_check),  # ✅ Root URL ping (200 OK)
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),       # User App
    path('api/properties/', include('properties.urls')), # Properties App
    path('api/relocation/', include('relocation.urls')), # Relocation App
    path('api/chat/', include('chat.urls')),             # Chat App
    path('api/payments/', include('payments.urls')),     # ✅ Naya Payments URL
]

# 👇 Image Uploads ke liye (Works in Production too now)
from django.views.static import serve 
from django.urls import re_path

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]