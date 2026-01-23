from django.db import models
from django.conf import settings

class Property(models.Model):
    # Property Seller se link hogi
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    
    # Dropdown Options
    CATEGORY_CHOICES = [('RENT', 'Rent'), ('SELL', 'Sell')]
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='RENT')
    
    BEDROOM_CHOICES = [('1BHK', '1 BHK'), ('2BHK', '2 BHK'), ('3BHK', '3 BHK'), ('Villa', 'Villa')]
    bedrooms = models.CharField(max_length=10, choices=BEDROOM_CHOICES, default='1BHK')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# 🖼️ Property Images Model
class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='property_photos/', null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"Image for {self.property.title}"

# ❤️ Wishlist Model
class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property')
        ordering = ['-created_at']

    def __str__(self):
        # ✅ Ab ye sahi jagah (indented) hai
        return f"{self.user.username} likes {self.property.title}"