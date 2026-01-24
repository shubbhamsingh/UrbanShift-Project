from rest_framework import serializers
from .models import MoveRequest

class MoveRequestSerializer(serializers.ModelSerializer):
    # Frontend par customer ka naam dikhane ke liye
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    
    # Agar future me User model me phone number ho, to ise uncomment kar sakte hain
    # customer_phone = serializers.CharField(source='customer.phone_number', read_only=True)

    class Meta:
        model = MoveRequest
        fields = '__all__'
        # Ye fields frontend se edit nahi honi chahiye
        read_only_fields = ('customer', 'status', 'company', 'created_at')