import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message, ChatRoom

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # 1. URL se Room Name nikalo (e.g. "chat_1_2")
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # 2. Join Room Group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave Room Group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # 3. Receive Message from WebSocket (Frontend)
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        username = data['username']

        # 4. Save Message to Database (Async function call)
        await self.save_message(username, self.room_name, message)

        # 5. Send Message to Group (Room me sabko dikhe)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username
            }
        )

    # 6. Receive Message from Group
    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        # Send message to WebSocket (Frontend)
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        }))

    # 💾 Database Helper Function
    @database_sync_to_async
    def save_message(self, username, room_name, content):
        user = User.objects.get(username=username)
        room, created = ChatRoom.objects.get_or_create(name=room_name)
        Message.objects.create(sender=user, room=room, content=content)