from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet

router = DefaultRouter()

# ✅ Change: Humne yahan "basename='property'" joda hai error hatane ke liye
router.register(r'', PropertyViewSet, basename='property')

urlpatterns = [
    path('', include(router.urls)),
]