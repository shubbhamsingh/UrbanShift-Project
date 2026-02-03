from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    VerifyEmailView,
    CustomTokenObtainPairView, 
    UserDetailView, 
    UploadVerificationView,
    RequestPasswordResetView,
    PasswordResetConfirmView,
    GoogleAuthView  # ✅ NEW
)

urlpatterns = [
    # Authentication URLs
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # ✅ Ye Line Jod Di Hai (Isi ki wajah se 404 aa raha tha)
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),

    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User Profile URL (Dashboard par Name/Status dikhane ke liye)
    path('me/', UserDetailView.as_view(), name='user_detail'),

    # ✅ Verification Document Upload URL (Seller ke liye)
    path('upload-verification/', UploadVerificationView.as_view(), name='upload_verification'),
    
    path('forgot-password/', RequestPasswordResetView.as_view(), name='forgot_password'),
    path('reset-password-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    # ✅ Google OAuth URL (NEW)
    path('google-auth/', GoogleAuthView.as_view(), name='google_auth'),
]