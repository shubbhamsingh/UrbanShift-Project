from django.db import models
from django.conf import settings

class RelocationRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),   # Jab user request dale
        ('ACCEPTED', 'Accepted'), # Jab mover accept kar le
        ('COMPLETED', 'Completed'), # Jab shifting ho jaye
    )

    # Request kisne dali hai
# ✅ Change: null=True, blank=True joda gaya hai taaki bina login ke test kar sakein
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='move_requests', null=True, blank=True)    
    from_location = models.CharField(max_length=255)
    to_location = models.CharField(max_length=255)
    move_date = models.DateField()
    
    # Kya shift karna hai (Bed, Sofa, Fridge etc.)
    inventory_items = models.TextField(help_text="List items like: 1 Bed, 2 Chairs, 1 Fridge")
    
    # Calculator se jo cost aayegi wo yahan save hogi
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Move from {self.from_location} to {self.to_location}"