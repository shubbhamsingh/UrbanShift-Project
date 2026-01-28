from rest_framework import serializers
from .models import Message, ChatRoom
from django.contrib.auth import get_user_model

User = get_user_model()

# ✅ 1. Message Serializer (Ye wahi purana wala hai)
class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    
    class Meta:
        model = Message
        fields = ['id', 'sender_name', 'content', 'timestamp']

# ✅ 2. NEW: Inbox List ke liye Serializer
class ChatRoomSerializer(serializers.ModelSerializer):
    partner_id = serializers.SerializerMethodField()
    partner_name = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'partner_id', 'partner_name', 'last_message']

    def get_partner_id(self, obj):
        # Logic: Room name agar "5_8" hai aur main user 5 hu, to partner 8 hai.
        try:
            ids = obj.name.split('_')
            request_user_id = self.context['request'].user.id
            
            # Agar ID[0] meri hai, to ID[1] partner hai.
            if int(ids[0]) == request_user_id:
                return int(ids[1])
            return int(ids[0])
        except:
            return None

    def get_partner_name(self, obj):
        try:
            partner_id = self.get_partner_id(obj)
            user = User.objects.get(id=partner_id)
            return user.username
        except User.DoesNotExist:
            return "Unknown User"

    def get_last_message(self, obj):
        # Sabse aakhri message dikhane ke liye
        last_msg = obj.messages.order_by('-timestamp').first()
        if last_msg:
            return f"{last_msg.sender.username}: {last_msg.content[:20]}..."
        return "No messages yet"