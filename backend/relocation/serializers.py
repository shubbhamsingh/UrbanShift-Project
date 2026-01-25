from rest_framework import serializers
from .models import MoveRequest, Review

# 👇 1. Review Serializer (Naya)
class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)

    class Meta:
        model = Review
        fields = '__all__'
        # Ye fields backend automatically set karega via logic
        read_only_fields = ('move', 'reviewer', 'company', 'created_at')

# 👇 2. Move Request Serializer (Update kiya)
class MoveRequestSerializer(serializers.ModelSerializer):
    # --- CUSTOMER INFO ---
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone_number', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)

    # --- COMPANY INFO ---
    company_name = serializers.CharField(source='company.username', read_only=True, default="Not Assigned")
    company_phone = serializers.CharField(source='company.phone_number', read_only=True, default="Hidden")
    company_email = serializers.CharField(source='company.email', read_only=True, default="Hidden")

    # 👇 Review ka data bhi saath me bhejenge (Nested Serializer)
    # Agar review nahi hai to ye null rahega
    review = ReviewSerializer(read_only=True)

    class Meta:
        model = MoveRequest
        fields = '__all__'
        read_only_fields = ('customer', 'status', 'company', 'created_at')