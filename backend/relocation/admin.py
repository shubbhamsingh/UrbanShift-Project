from django.contrib import admin
from .models import MoveRequest

@admin.register(MoveRequest)
class MoveRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'source', 'destination', 'move_date', 'status')
    list_filter = ('status', 'move_date')
    search_fields = ('source', 'destination', 'customer__username')