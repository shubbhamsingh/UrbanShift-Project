from rest_framework import viewsets
from .models import Property
from .serializers import PropertySerializer

class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    
    # ✅ Sirf wahi properties dikhao jo "is_sold=False" hain (Jo biki nahi hain)
    def get_queryset(self):
        return Property.objects.filter(is_sold=False).order_by('-created_at')