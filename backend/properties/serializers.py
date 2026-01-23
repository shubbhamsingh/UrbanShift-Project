from rest_framework import serializers
from .models import Property, PropertyImage, Wishlist

# --- 1. Property Image Serializer ---
class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

# --- 2. Property Serializer (Main) ---
class PropertySerializer(serializers.ModelSerializer):
    seller_name = serializers.SerializerMethodField()
    seller_email = serializers.EmailField(source='seller.email', read_only=True)
    seller_phone = serializers.SerializerMethodField()
    
    images = PropertyImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )

    class Meta:
        model = Property
        fields = [
            'id', 'seller', 'seller_name', 'seller_email', 'seller_phone', 
            'title', 'description', 'price', 'location', 
            'category', 'bedrooms', 'images', 'uploaded_images', 'created_at'
        ]
        read_only_fields = ['seller', 'created_at']

    # ✅ SAFE NAME CHECK (Ab ye Crash nahi karega)
    def get_seller_name(self, obj):
        # 1. Pehle check karo 'name' field hai ya nahi
        name = getattr(obj.seller, 'name', None)
        if name:
            return name
            
        # 2. Agar nahi, to First Name + Last Name check karo
        first = getattr(obj.seller, 'first_name', '')
        last = getattr(obj.seller, 'last_name', '')
        full_name = f"{first} {last}".strip()
        
        if full_name:
            return full_name
            
        # 3. Kuch nahi mila to Username (Safe Option)
        return obj.seller.username

    # ✅ SAFE PHONE CHECK
    def get_seller_phone(self, obj):
        return getattr(obj.seller, 'phone_number', "+91 98765 XXXXX")

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        property = Property.objects.create(**validated_data)
        for image in uploaded_images:
            PropertyImage.objects.create(property=property, image=image)
        return property

# --- 3. Wishlist Serializer ---
class WishlistSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'property', 'created_at']