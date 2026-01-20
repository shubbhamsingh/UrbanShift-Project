from rest_framework import serializers
from .models import RelocationRequest

class RelocationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelocationRequest
        # Ye saari fields hum frontend (React) se bhejenge
        fields = ['id', 'from_location', 'to_location', 'move_date', 'inventory_items', 'estimated_cost', 'status']