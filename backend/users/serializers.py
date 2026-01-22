import re  # ✅ Regex library import ki
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

# 1. Registration Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'user_type', 'phone', 'is_verified', 'verification_document']

    # --- 🔒 PASSWORD VALIDATION LOGIC HERE ---
    def validate_password(self, value):
        # 1. Length Check (Min 8 chars)
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        
        # 2. Uppercase Check (A-Z)
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter (A-Z).")
        
        # 3. Lowercase Check (a-z)
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter (a-z).")
        
        # 4. Number Check (0-9)
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one number (0-9).")
        
        # 5. Special Character Check (!@#$...)
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character (e.g., ! @ # $ %).")

        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        
        # Admin Logic
        if user.user_type == 'ADMIN':
            user.is_superuser = True
            user.is_staff = True
            user.is_verified = True
        else:
            user.is_verified = False 
            
        user.save()
        return user

# 2. Login Serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_type'] = user.user_type
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_type'] = self.user.user_type
        data['username'] = self.user.username
        data['is_verified'] = self.user.is_verified
        return data