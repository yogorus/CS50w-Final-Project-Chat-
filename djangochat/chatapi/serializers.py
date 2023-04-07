from django.contrib.auth.models import User, Group
from .models import Message, Room
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import login, authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'groups'] 


class RegisterSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True, required=True, ) #validators=[validate_password]
    password2 = serializers.CharField(write_only=True, required=True, label='Confirm password')

    class Meta:
        model = User
        fields = ['username', 'password', 'password2']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        
        return user


class MessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S", required=False)
    
    class Meta:
        model = Message
        fields = ('__all__')


class RoomSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    host = UserSerializer(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Room
        fields = '__all__'
        read_only_fields = ['messages']
    
    
    def get_messages(self):
        return self.data["messages"]
    