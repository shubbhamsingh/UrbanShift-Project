from django.urls import path
from .views import ChatHistoryView, ChatInboxView # 👈 Import InboxView

urlpatterns = [
    path('history/<str:room_name>/', ChatHistoryView.as_view(), name='chat-history'),
    path('inbox/', ChatInboxView.as_view(), name='chat-inbox'), # 👈 New URL
]