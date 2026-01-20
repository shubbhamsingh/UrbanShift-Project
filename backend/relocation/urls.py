from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RelocationRequestViewSet

router = DefaultRouter()
router.register(r'requests', RelocationRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]