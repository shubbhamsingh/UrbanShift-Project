from django.db import models
from django.conf import settings 

class Property(models.Model):
    # Property Types
    PROPERTY_TYPES = (
        ('FLAT', 'Flat/Apartment'),
        ('HOUSE', 'Independent House'),
        ('ROOM', 'Single Room'),
        ('COMMERCIAL', 'Commercial Space'),
    )
    
    # Isse hum Rent ya Sell ke liye mark karenge
    LISTING_TYPES = (
        ('RENT', 'For Rent'),
        ('SELL', 'For Sale'),
    )

    # Owner link karega User table se
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties')
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    address = models.CharField(max_length=500)
    city = models.CharField(max_length=100)
    
    # ✅ Price aur Phone Number
    price = models.DecimalField(max_digits=12, decimal_places=2) # e.g. 15000.00
    phone_number = models.CharField(max_length=15, default="919999999999") # WhatsApp number

    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES)
    listing_type = models.CharField(max_length=20, choices=LISTING_TYPES)
    
    # Suvidhayein (Amenities)
    bedrooms = models.IntegerField(default=1)
    bathrooms = models.IntegerField(default=1)
    is_furnished = models.BooleanField(default=False)
    
    # Photo upload ke liye (Main Cover Image)
    image = models.ImageField(upload_to='property_images/', blank=True, null=True)
    
    # ✅ Sold Status
    is_sold = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.city}"

# ✅ Gallery Images Class (Property ke bahar)
class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='property_gallery/')

    def __str__(self):
        return f"Image for {self.property.title}"