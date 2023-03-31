import json

from .serializers import UserSerializer, MessageSerializer, RoomSerializer
from .models import Room, Message

from rest_framework.exceptions import ValidationError

from django.shortcuts import get_object_or_404
from django.contrib.auth.models import AnonymousUser
from django.core import serializers
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from urllib.parse import parse_qsl

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name
        self.room = await self.get_room_model(self.room_name)
        
        if self.scope["user"].is_authenticated:
            # Join room group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            user = await self.get_user(self.scope['user'])

            await self.accept()
            await self.send(json.dumps({"type": 'current_user', 'user': user}))
            # Send chat history
            # room = await self.get_room_model(self.room_name)
            # messages = await self.get_room_messages(room)
            # await self.send(json.dumps({'type': 'load_messages', 'messages': messages}))
        

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        text = text_data_json["message"]
        user = self.scope["user"]

        data = {
            "text": text,
            "user": user.id,
            "room": self.room.id
        }

        try:
            # Create message in db when it's recieved
            message = await self.create_message(data)
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat_message", "message": message}
            )
        except:
            pass


    # Receive message from room group
    async def chat_message(self, event):
        
        # Get message dict
        message = event["message"]
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({'type': 'chat_message', "message": message}))
        
        
    @database_sync_to_async
    def serialize_user(self, instance):
        return UserSerializer(instance=instance).data
    
    @database_sync_to_async
    def get_user(self, obj):
        try:
            return UserSerializer(obj).data
        except:
            return AnonymousUser
    
    @database_sync_to_async
    def create_message(self, data):
        message = MessageSerializer(data=data)
        message.is_valid(raise_exception=True)
        message.save()

        return message.data
    
    @database_sync_to_async
    def get_room_messages(self, room):
        # room = get_object_or_404(Room, pk=pk)
        messages = RoomSerializer(room).get_messages()
        return messages
    
    @database_sync_to_async
    def get_room_model(self, slug):
        return get_object_or_404(Room, slug=slug)

        

