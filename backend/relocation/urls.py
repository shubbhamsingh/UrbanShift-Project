from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MoveRequestViewSet

router = DefaultRouter()
# Ye URL banayega: /api/relocation/move-requests/
router.register(r'move-requests', MoveRequestViewSet, basename='move-requests')

urlpatterns = [
    path('', include(router.urls)),
]