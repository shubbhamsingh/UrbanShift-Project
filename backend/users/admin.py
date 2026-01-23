from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    
    # 1. User List table me ye columns dikhenge
    list_display = ['username', 'email', 'user_type', 'is_verified', 'is_staff']
    
    # 2. Jab aap user ko edit karenge, tab ye fields dikhenge
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Details', {'fields': ('user_type', 'phone', 'is_verified', 'verification_document')}),
    )
    
    # 3. Naya user create karte waqt ye fields dikhenge
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Extra Details', {'fields': ('user_type', 'phone', 'is_verified', 'verification_document')}),
    )

# Purane UserAdmin ko hatakar apna wala register karein
admin.site.register(User, CustomUserAdmin)