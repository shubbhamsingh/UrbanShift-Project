from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated  # ✅ Ye missing tha, ab add kar diya
from django.shortcuts import get_object_or_404
from .models import Property, PropertyImage, Wishlist
from .serializers import PropertySerializer, WishlistSerializer

# ✅ Custom Permission: Sirf 'Verified Seller' hi Property post kar sakta hai
class IsSellerUser(permissions.BasePermission):
    def has_permission(self, request, view):
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
        elif self.action in ['my_properties', 'buy_property', 'my_purchases']:
            return [permissions.IsAuthenticated()]
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

    # 1. Seller ki apni properties
    @action(detail=False, methods=['get'], url_path='my-properties')
    def my_properties(self, request):
        user = request.user
        properties = Property.objects.filter(seller=user).order_by('-created_at')
        serializer = self.get_serializer(properties, many=True)
        return Response(serializer.data)

    # 2. User ke Purchased Homes
    @action(detail=False, methods=['get'], url_path='my-purchases')
    def my_purchases(self, request):
        user = request.user
        # Wahi properties dikhao jiska 'buyer' ye user hai
        purchased_properties = Property.objects.filter(buyer=user).order_by('-created_at')
        serializer = self.get_serializer(purchased_properties, many=True)
        return Response(serializer.data)

    # 3. Property Buy Karne ka Logic (Mock)
    @action(detail=True, methods=['post'], url_path='buy')
    def buy_property(self, request, pk=None):
        property_obj = self.get_object()
        
        if property_obj.is_sold:
            return Response({'error': 'This property is already sold! ❌'}, status=status.HTTP_400_BAD_REQUEST)
        
        if property_obj.category == 'RENT':
             return Response({'error': 'This property is for Rent, not Sale.'}, status=status.HTTP_400_BAD_REQUEST)

        # Buy Process (Mock)
        property_obj.buyer = request.user
        property_obj.is_sold = True
        property_obj.save()
        
        return Response({'message': 'Property Purchased Successfully! 🎉🏡'}, status=status.HTTP_200_OK)


# --- WISHLIST VIEWS ---

@api_view(['POST'])
@permission_classes([IsAuthenticated]) # ✅ Ab ye error nahi dega
def toggle_wishlist(request, pk):
    """Add or Remove property from wishlist"""
    property_obj = get_object_or_404(Property, pk=pk)
    
    wishlist_item = Wishlist.objects.filter(user=request.user, property=property_obj).first()

    if wishlist_item:
        wishlist_item.delete()
        return Response({'message': 'Removed from Wishlist 💔', 'liked': False})
    else:
        Wishlist.objects.create(user=request.user, property=property_obj)
        return Response({'message': 'Added to Wishlist ❤️', 'liked': True})

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # ✅ Ab ye error nahi dega
def my_wishlist(request):
    """Get all properties liked by logged-in user"""
    wishlist = Wishlist.objects.filter(user=request.user)
    serializer = WishlistSerializer(wishlist, many=True)
    return Response(serializer.data)