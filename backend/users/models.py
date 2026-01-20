from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Hum Django ke user ko customize kar rahe hain taaki Roles add kar sakein
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('LANDLORD', 'Landlord/Seller'),
        ('TENANT', 'Tenant/Buyer'),
        ('MOVER', 'Mover Service Provider'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='TENANT')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_verified = models.BooleanField(default=False) # Admin verify karega ki ye genuine banda hai ya nahi
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"