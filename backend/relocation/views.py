from rest_framework import viewsets
from .models import RelocationRequest
from .serializers import RelocationRequestSerializer

class RelocationRequestViewSet(viewsets.ModelViewSet):
    queryset = RelocationRequest.objects.all().order_by('-created_at')
    serializer_class = RelocationRequestSerializer