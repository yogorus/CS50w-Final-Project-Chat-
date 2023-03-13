import json

from .serializers import UserSerializer, MessageSerializer, RoomSerializer
from .models import Room, Message

from rest_framework.exceptions import ValidationError
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
        
        # Send chat history
        room = await self.get_room_model(self.room_name)
        messages = await self.get_room_messages(room)
        await self.send(messages)

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
        room = await self.get_room_model(self.room_name)
        data = {
            "text": event["message"],
            "room": room.id
        }
        try:
            message = await self.create_message(data)

            # Send message to WebSocket
            await self.send(text_data=json.dumps({"message": message}))
        
        except ValidationError:
            pass
    
    # @database_sync_to_async
    # def get_user(self):
    #     user = self.scope["user"]
    #     return UserSerializer(user)
    
    @database_sync_to_async
    def create_message(self, data):
        message_serializer = MessageSerializer(data=data)
        message_serializer.is_valid(raise_exception=True)
        
        message = Message.objects.create(
            user = self.scope['user'],
            room = message_serializer.validated_data['room'],
            text = message_serializer.validated_data['text']
        )
        
        return MessageSerializer(message).data
        
    @database_sync_to_async
    def get_room_messages(self, room):
        # room = get_object_or_404(Room, pk=pk)
        messages = RoomSerializer(room).get_messages()
        return json.dumps(messages)
    
    @database_sync_to_async
    def get_room_model(self, name):
        return get_object_or_404(Room, name=name)

        

