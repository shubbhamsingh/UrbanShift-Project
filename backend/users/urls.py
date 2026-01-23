from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    CustomTokenObtainPairView, 
    UserDetailView, 
    UploadVerificationView
)

urlpatterns = [
    # Authentication URLs
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User Profile URL (Dashboard par Name/Status dikhane ke liye)
    path('me/', UserDetailView.as_view(), name='user_detail'),

    # ✅ Verification Document Upload URL (Seller ke liye)
    path('upload-verification/', UploadVerificationView.as_view(), name='upload_verification'),
]