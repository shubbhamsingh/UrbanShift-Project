from django.db import models
from django.conf import settings

class ChatRoom(models.Model):
    # Room ka naam participants ki ID se banega (e.g., "chat_1_4")
    name = models.CharField(max_length=255, unique=True) 
    
    def __str__(self):
        return self.name

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}"