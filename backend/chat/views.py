from rest_framework import generics, permissions
from .models import Message, ChatRoom
from .serializers import MessageSerializer, ChatRoomSerializer
from django.db.models import Q

# 1. Existing History View (No changes needed, just verify)
class ChatHistoryView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_name = self.kwargs['room_name']
        try:
            room = ChatRoom.objects.get(name=room_name)
            return Message.objects.filter(room=room).order_by('timestamp')
        except ChatRoom.DoesNotExist:
            return Message.objects.none()

# 2. 👇 NEW: Inbox View (List of people I talked to)
class ChatInboxView(generics.ListAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.user.id
        # Filter rooms where the name contains the user's ID (e.g. "5_8" or "8_5")
        # Ideally, we should have a ManyToMany field in ChatRoom, but string matching works for now based on your logic
        return ChatRoom.objects.filter(
            Q(name__startswith=f"{user_id}_") | 
            Q(name__endswith=f"_{user_id}")
        )