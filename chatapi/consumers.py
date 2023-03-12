import json

from .serializers import UserSerializer, MessageSerializer, RoomSerializer
from .models import Room, Message

from django.shortcuts import get_object_or_404
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()
        await self.send.get_room_messages(pk=1)

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        user = await self.get_user()
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message, "user": user}))
    
    @database_sync_to_async
    def get_user(self):
        user = self.scope["user"]
        return UserSerializer(user).data
    
    @database_sync_to_async
    def create_message(self):
        user = self.scope["user"]
        

    @database_sync_to_async
    def get_message(self):
        pass

    @database_sync_to_async
    def get_room_messages(self, pk):
        room = get_object_or_404(Room, pk=pk)
        serializer = RoomSerializer(room)
        return serializer.data.messages