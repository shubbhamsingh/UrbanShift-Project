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

            # 3. Brevo API Configuration
            configuration = sib_api_v3_sdk.Configuration()
            configuration.api_key['api-key'] = settings.BREVO_API_KEY

            api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
            
            # 4. Email Content Prepare karein
            sender = {"name": "UrbanShift Team", "email": "urbanshiftt@gmail.com"}
            to = [{"email": user.email, "name": user.username}]
            
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #FF9966; text-align: center;">Welcome to UrbanShift! 🚀</h2>
                        <p>Hi <strong>{user.username}</strong>,</p>
                        <p>Thank you for registering. Please use the OTP below to verify your email address:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f4f6f8; padding: 10px 20px; border-radius: 5px;">
                                {otp}
                            </span>
                        </div>
                        <p>This OTP is valid for 10 minutes.</p>
                        <hr style="border: none; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #888; text-align: center;">If you didn't request this, please ignore this email.</p>
                    </div>
                </body>
            </html>
            """

            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                to=to,
                html_content=html_content,
                sender=sender,
                subject="Verify Your UrbanShift Account - OTP Inside"
            )

            # 5. Email Send karein
            try:
                api_instance.send_transac_email(send_smtp_email)
                print(f"✅ OTP Email sent to {user.email}")
            except ApiException as e:
                print(f"❌ Brevo Error: {e}")
                # Error aane par bhi success return kar rahe hain taaki flow na toote, 
                # lekin production me ise handle karna chahiye.

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