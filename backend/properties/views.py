from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action # ✅ Import Added
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Property, PropertyImage
from .serializers import PropertySerializer

# ✅ Custom Permission: Sirf 'Verified Seller' hi Property post kar sakta hai
class IsSellerUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # Debugging
        # print(f"Checking Permission for -> User: {request.user.username}, Verified: {request.user.is_verified}")
        
        if not request.user.is_authenticated:
            return False
        
        return request.user.user_type == 'SELLER' and request.user.is_verified

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsSellerUser()]
        elif self.action == 'my_properties':
             return [permissions.IsAuthenticated()] # ✅ My Properties ke liye sirf login chahiye
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        property_instance = serializer.save(seller=self.request.user)

        images = request.FILES.getlist('photos')
        if images:
            for image in images:
                PropertyImage.objects.create(property=property_instance, image=image)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # ✅ NEW ACTION: Ye missing tha, isliye 404 aa raha tha
    @action(detail=False, methods=['get'], url_path='my-properties')
    def my_properties(self, request):
        user = request.user
        properties = Property.objects.filter(seller=user).order_by('-created_at')
        serializer = self.get_serializer(properties, many=True)
        return Response(serializer.data)
    # 👇 File ke sabse neeche ye paste karein:
from .models import Wishlist
from .serializers import WishlistSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_wishlist(request, pk):
    """Add or Remove property from wishlist"""
    property_obj = get_object_or_404(Property, pk=pk)
    
    # Check if already in wishlist
    wishlist_item = Wishlist.objects.filter(user=request.user, property=property_obj).first()

    if wishlist_item:
        wishlist_item.delete()
        return Response({'message': 'Removed from Wishlist 💔', 'liked': False})
    else:
        Wishlist.objects.create(user=request.user, property=property_obj)
        return Response({'message': 'Added to Wishlist ❤️', 'liked': True})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_wishlist(request):
    """Get all properties liked by logged-in user"""
    wishlist = Wishlist.objects.filter(user=request.user)
    serializer = WishlistSerializer(wishlist, many=True)
    return Response(serializer.data)