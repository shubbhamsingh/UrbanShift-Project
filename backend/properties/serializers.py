from rest_framework import serializers
from .models import Property, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True) # Saari gallery images yahan aayengi

    class Meta:
        model = Property
        # ✅ 'phone_number' yahan add kiya gaya hai
        fields = ['id', 'title', 'description', 'price', 'city', 'property_type', 'phone_number', 'image', 'images']