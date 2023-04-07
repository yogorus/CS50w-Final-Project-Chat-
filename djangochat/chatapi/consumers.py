import json

from .serializers import UserSerializer, MessageSerializer, RoomSerializer
from .models import Room

from django.shortcuts import get_object_or_404
from django.contrib.auth.models import AnonymousUser
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name
        self.room = await self.get_room_model(self.room_name)
        
        if self.scope["user"].is_authenticated and await self.user_in_room():
            # Join room group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)

            await self.accept()
            
            # Load room
            await self.send(json.dumps({'type': 'load_room', 'room': await self.serialize_room(self.room)}))
        

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
        
        # Get serialized message
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
        messages = RoomSerializer(room).get_messages()
        return messages
    
    @database_sync_to_async
    def get_room_model(self, slug):
        return get_object_or_404(Room, slug=slug)
    
    @database_sync_to_async
    def serialize_room(self, model):
        return RoomSerializer(instance=model).data
    
    @database_sync_to_async
    def user_in_room(self):
        return self.scope["user"] in self.room.current_users.all() 
