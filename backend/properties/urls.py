from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet

# Router setup karein (Ye API URLs automatic banata hai)
router = DefaultRouter()
router.register(r'', PropertyViewSet, basename='property')

urlpatterns = [
    path('', include(router.urls)),
]