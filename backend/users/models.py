from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import timedelta
from django.utils import timezone

class User(AbstractUser): 
    USER_TYPE_CHOICES = (
        ('BUYER', 'Buyer'),
        ('SELLER', 'Seller'),
        ('COMPANY', 'Movers & Packers Company'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='BUYER')
    
    # ✅ Correction: Frontend 'phone_number' भेज रहा है, इसलिए मॉडल में भी यही नाम रखें
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    # ✅ Critical Fix: Ye line add karein nahi to OTP save nahi hoga
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    
    # Verification Fields
    is_verified = models.BooleanField(default=False)
    verification_document = models.ImageField(upload_to='verification_docs/', blank=True, null=True)
    # 👇 NEW FIELD
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    # ✅ FIX: Clash rokne ke liye related_name
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups', # unique name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions', # unique name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def is_otp_valid(self):
        """Check if OTP is still valid (10 minutes expiry)"""
        if not self.otp or not self.otp_created_at:
            return False
        expiry_time = self.otp_created_at + timedelta(minutes=10)
        return timezone.now() < expiry_time

    def __str__(self):
        return self.username