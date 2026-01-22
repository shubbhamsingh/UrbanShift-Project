from rest_framework import viewsets, permissions, parsers
from .models import Property
from .serializers import PropertySerializer

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_at') # Newest pehle dikhega
    serializer_class = PropertySerializer
    
    # ✅ Sirf Logged-in user hi add/edit kar sakta hai, baki sirf dekh sakte hain
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    # ✅ Image Upload ke liye ye jaruri hai
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    # ✅ Ye function Owner ko automatic set karega
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)