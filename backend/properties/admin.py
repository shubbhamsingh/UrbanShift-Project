from django.contrib import admin
from .models import Property, PropertyImage

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 8     # Shuru mein 8 dabbe dikhenge
    max_num = 8   # ✅ Limit: Total 8 se zyada upload nahi honge

class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline]
    list_display = ('title', 'price', 'city', 'property_type', 'is_sold') # ✅ Sold status bhi bahar dikhega
    list_filter = ('is_sold', 'city') # ✅ Filter karne ke liye option

admin.site.register(Property, PropertyAdmin)
admin.site.register(PropertyImage)