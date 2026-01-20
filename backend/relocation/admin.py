from django.contrib import admin
from .models import RelocationRequest

@admin.register(RelocationRequest)
class RelocationAdmin(admin.ModelAdmin): # <-- Yahan bhi sudhar diya
    list_display = ('customer', 'from_location', 'to_location', 'status')