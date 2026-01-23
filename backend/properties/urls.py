from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import PropertyViewSet

# Router Setup
router = DefaultRouter()
router.register(r'', PropertyViewSet, basename='property')

urlpatterns = [
    # ✅ 1. Wishlist URL (ISSE SABSE UPAR RAKHNA HAI)
    # Taki Django isse pehle check kare aur property ID na samjhe
    path('wishlist/', views.my_wishlist, name='my-wishlist'),

    # ✅ 2. Toggle Wishlist URL
    path('<int:pk>/toggle-wishlist/', views.toggle_wishlist, name='toggle-wishlist'),

    # ✅ 3. Router URLs (Standard CRUD) - Isse hamesha LAST me rakhein
    path('', include(router.urls)),
]