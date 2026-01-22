from rest_framework import serializers
from .models import Property, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    
    # Owner ka naam dikhane ke liye (ID ki jagah)
    owner_name = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Property
        fields = '__all__' 
        # '__all__' likhne se ye automatically 'image_url' ko bhi le lega ✅