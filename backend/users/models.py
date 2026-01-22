from django.db import models
from django.contrib.auth.models import AbstractUser

# class CustomUser ki jagah class User likhein 👇
class User(AbstractUser): 
    USER_TYPE_CHOICES = (
        ('BUYER', 'Buyer'),
        ('SELLER', 'Seller'),
        ('COMPANY', 'Movers & Packers Company'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='BUYER')
    phone = models.CharField(max_length=15, blank=True, null=True)
    
    # Verification Fields
    is_verified = models.BooleanField(default=False)
    verification_document = models.ImageField(upload_to='verification_docs/', blank=True, null=True)

    def __str__(self):
        return self.username