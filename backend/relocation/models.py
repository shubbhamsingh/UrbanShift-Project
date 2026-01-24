from django.db import models
from django.conf import settings

class MoveRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    # Customer jo request kar raha hai
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='move_requests')
    
    # Company jo move accept karegi (shuru me khali rahega)
    company = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_moves')
    
    source = models.CharField(max_length=255)       # Kahan se
    destination = models.CharField(max_length=255)  # Kahan tak
    move_date = models.DateField()
    move_size = models.CharField(max_length=50)     # 1BHK, 2BHK, etc.
    items_list = models.TextField(blank=True)       # Saman ki list
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.source} to {self.destination} ({self.status})"