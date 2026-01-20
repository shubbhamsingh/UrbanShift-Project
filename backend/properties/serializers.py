from rest_framework import serializers
from .models import Property, PropertyImage

# Extra Images ke liye serializer
class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

# Main Property Serializer
class PropertySerializer(serializers.ModelSerializer):
    # Ye line extra images ko list me lekar aayegi
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = '__all__'