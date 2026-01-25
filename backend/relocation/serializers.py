from rest_framework import serializers
from .models import MoveRequest

class MoveRequestSerializer(serializers.ModelSerializer):
    # --- CUSTOMER INFO (Company ko dikhane ke liye) ---
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone_number', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)

    # --- COMPANY INFO (User ko "My Moves" me dikhane ke liye) ---
    # Jab tak company accept nahi karegi, ye fields null rahenge
    company_name = serializers.CharField(source='company.username', read_only=True, default="Not Assigned")
    company_phone = serializers.CharField(source='company.phone_number', read_only=True, default="Hidden")
    company_email = serializers.CharField(source='company.email', read_only=True, default="Hidden")

    class Meta:
        model = MoveRequest
        fields = '__all__'
        read_only_fields = ('customer', 'status', 'company', 'created_at')