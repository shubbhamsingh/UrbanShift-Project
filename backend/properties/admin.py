from django.contrib import admin
from .models import Property, PropertyImage, Wishlist

# --- 1. Property Admin (Taaki details saaf dikhein) ---
class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'seller', 'price', 'location', 'category', 'created_at')
    list_filter = ('category', 'location')
    search_fields = ('title', 'location', 'seller__username')
    inlines = [PropertyImageInline] # Property ke andar hi Images add karne ka option

# --- 2. Wishlist Admin ---
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'property', 'created_at')

# --- Register Models ---
admin.site.register(Property, PropertyAdmin)
admin.site.register(Wishlist, WishlistAdmin)
# PropertyImage alag se dikhane ki zaroorat nahi, wo Property ke andar hi dikhega
# 👇 Custom Admin Titles
admin.site.site_header = "UrbanShift Admin Portal"
admin.site.site_title = "UrbanShift Admin"
admin.site.index_title = "Welcome to UrbanShift Master Control"