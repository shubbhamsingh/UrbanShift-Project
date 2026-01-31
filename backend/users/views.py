from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from django.utils import timezone

# ✅ New Imports for Logic
from django.conf import settings
import random
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

User = get_user_model()

# ==========================================
# 1. Registration View (Updated with OTP)
# ==========================================
class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # 1. User create karein (Active = False)
            user = serializer.save()
            user.is_active = False  
            
            # 2. OTP Generate karein (6 Digit)
            otp = str(random.randint(100000, 999999))
            user.otp = otp
            user.otp_created_at = timezone.now() 
            user.save()
            print(f"\n🔥 YOUR OTP IS: {otp} 🔥\n")  # 👈 Ye line jodein

            # 3. Send Verification Email using Utility
            from .utils_email import send_notification_email
            
            send_notification_email(user, 'email_verification', {
                'userName': user.username,
                'otpCode': otp,
                'verifyLink': f"https://urbanshift.vercel.app/verify-email?email={user.email}" # Optional link if you have a frontend route
            })

            print(f"✅ OTP Email sent to {user.email} (via Utility)")

            return Response({
                'message': 'Registration successful! OTP sent to your email.',
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ==========================================
# 1.1 Verify OTP View (New)
# ==========================================
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # ✅ Correct Indentation starts here
        if user.otp == otp:
            # Check OTP expiry
            if not user.is_otp_valid():
                return Response({'error': 'OTP has expired. Please register again.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.is_active = True
            user.otp = None
            user.otp_created_at = None  # Clear expiry time
            user.save()
            
            # 4. Send Welcome Email
            from .utils_email import send_notification_email
            send_notification_email(user, 'welcome', {
                'userName': user.username,
                'exploreLink': "https://urbanshift.vercel.app/properties"
            })
            
            return Response({'message': 'Email verified successfully! You can login now.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid OTP. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)

# ==========================================
# 2. Login View (Existing)
# ==========================================
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ==========================================
# 3. User Detail & Update View (Existing)
# ==========================================
class UserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
        
    def perform_update(self, serializer):
        user = serializer.save()
        
        # Send Profile Update Email
        from .utils_email import send_notification_email
        send_notification_email(user, 'profile_update', {
            'userName': user.username,
            'date': timezone.now().strftime("%Y-%m-%d"),
            'time': timezone.now().strftime("%H:%M:%S")
        })

# ==========================================
# 4. Upload Verification View (Existing)
# ==========================================
class UploadVerificationView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser] # File handling ke liye

    def post(self, request, format=None):
        user = request.user
        
        # Check karein ki file aayi hai ya nahi
        if 'document' not in request.data:
            return Response({"error": "No document provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Document save karein
            user.verification_document = request.data['document']
            user.save()
            return Response({
                "message": "Verification document uploaded successfully! Admin will review it.",
                "status": "Under Review"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ==========================================
# 5. Forgot Password Request View (New)
# ==========================================
# ==========================================
# 5. Forgot Password Request View (OTP)
# ==========================================
class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            
            # Generate OTP
            otp = str(random.randint(100000, 999999))
            user.otp = otp
            user.otp_created_at = timezone.now()
            user.save()
            
            from .utils_email import send_notification_email
            send_notification_email(user, 'forgot_password', {
                'userName': user.username,
                'otpCode': otp
            })
            
            return Response({'message': 'Password reset OTP sent to your email.'}, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({'message': 'If an account exists, an OTP has been sent.'}, status=status.HTTP_200_OK)

# ==========================================
# 6. Password Reset Confirm View (OTP Verification)
# ==========================================
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        otp = request.data.get('otp', '').strip()
        password = request.data.get('password')
        
        if not email or not otp or not password:
            return Response({'error': 'Email, OTP, and Password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            
            # --- DEBUGGING LOGS ---
            print(f"🔍 DEBUG: Verifying OTP for {email}")
            print(f"   Input OTP: '{otp}' (Type: {type(otp)})")
            print(f"   DB OTP:    '{user.otp}' (Type: {type(user.otp)})")
            # ----------------------

            # Verify OTP
            if user.otp == otp:
                if not user.is_otp_valid():
                    return Response({'error': 'OTP has expired. Request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

                # --- 🔒 PASSWORD VALIDATION (Duplicate from Serializer) ---
                import re
                if len(password) < 8:
                    return Response({'error': 'Password must be at least 8 chars long.'}, status=status.HTTP_400_BAD_REQUEST)
                if not re.search(r'[A-Z]', password):
                    return Response({'error': 'Password must contain at least one uppercase letter (A-Z).'}, status=status.HTTP_400_BAD_REQUEST)
                if not re.search(r'[a-z]', password):
                    return Response({'error': 'Password must contain at least one lowercase letter (a-z).'}, status=status.HTTP_400_BAD_REQUEST)
                if not re.search(r'\d', password):
                    return Response({'error': 'Password must contain at least one number (0-9).'}, status=status.HTTP_400_BAD_REQUEST)
                if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
                    return Response({'error': 'Password must contain at least one special character.'}, status=status.HTTP_400_BAD_REQUEST)
                # ----------------------------------------------------------

                user.set_password(password)
                user.otp = None # Clear OTP after use
                user.otp_created_at = None
                user.save()
                return Response({'message': 'Password reset successful! You can login now.'}, status=status.HTTP_200_OK)
            else:
                print("❌ OTP Mismatch!")
                return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        
        except User.DoesNotExist:
            print(f"❌ User not found for email: {email}")
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)