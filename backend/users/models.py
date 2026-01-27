from django.db import models
from django.contrib.auth.models import AbstractUser

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
    
    # Verification Fields
    is_verified = models.BooleanField(default=False)
    verification_document = models.ImageField(upload_to='verification_docs/', blank=True, null=True)

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

    def __str__(self):
        return self.username