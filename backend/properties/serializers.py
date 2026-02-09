from rest_framework import serializers
from .models import Property, PropertyImage, Wishlist

# --- 1. Property Image Serializer ---
class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        # 👇 CHANGE: 'image_url' add kiya taaki frontend ko URL mile
        fields = ['id', 'image', 'image_url'] 

# --- 2. Property Serializer (Main) ---
class PropertySerializer(serializers.ModelSerializer):
    # 👇 NEW: Chat feature ke liye 'owner' field add kiya (Frontend needs property.owner)
    owner = serializers.ReadOnlyField(source='seller.id') 
    
    seller_name = serializers.SerializerMethodField()
    seller_email = serializers.EmailField(source='seller.email', read_only=True)
    seller_phone = serializers.SerializerMethodField()
    
    images = PropertyImageSerializer(many=True, read_only=True)
    
    # File Uploads
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False
    )
    
    # 👇 NEW: URL Uploads receive karne ke liye
    image_urls = serializers.ListField(
        child=serializers.URLField(),
        write_only=True, required=False
    )

    class Meta:
        model = Property
        fields = [
            'id', 'seller', 'owner', 'seller_name', 'seller_email', 'seller_phone', # 👈 'owner' added here
            'title', 'description', 'price', 'location', 
            'category', 'bedrooms', 'images', 'uploaded_images', 'image_urls',
            'created_at', 'is_sold'
        ]
        read_only_fields = ['seller', 'owner', 'created_at', 'is_sold']

    # ✅ SAFE NAME CHECK
    def get_seller_name(self, obj):
        name = getattr(obj.seller, 'name', None)
        if name: return name
        
        first = getattr(obj.seller, 'first_name', '')
        last = getattr(obj.seller, 'last_name', '')
        full_name = f"{first} {last}".strip()
        if full_name: return full_name
            
        return obj.seller.username

    # ✅ SAFE PHONE CHECK
    def get_seller_phone(self, obj):
        return getattr(obj.seller, 'phone_number', "+91 98765 XXXXX")

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        image_urls_list = validated_data.pop('image_urls', []) # 👇 URLs nikaale
        
        property = Property.objects.create(**validated_data)
        
        # 1. Save Files (with Error Logging)
        for image in uploaded_images:
            try:
                PropertyImage.objects.create(property=property, image=image)
                print(f"✅ Image Saved: {image.name}")
            except Exception as e:
                print(f"❌ IMAGE UPLOAD ERROR: {type(e).__name__}: {e}")
                raise  # Re-raise to show 500 error with details
            
        # 2. Save URLs
        for url in image_urls_list:
            PropertyImage.objects.create(property=property, image_url=url)
            
        return property


# --- 3. Wishlist Serializer ---
class WishlistSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'property', 'created_at']