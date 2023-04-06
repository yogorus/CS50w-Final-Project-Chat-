from django.shortcuts import render, reverse, get_object_or_404
from django.http import HttpResponseRedirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User, Group
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics, viewsets, permissions, filters, status
from .serializers import UserSerializer, GroupSerializer, RegisterSerializer, LoginSerializer, RoomSerializer
from .models import Room

import json

# Create your views here.
def index(request):
    return render(request, "chat/index.html")


def room(request, room_name):
    return render(request, "chat/room.html", {"room_name": room_name})


class RoomViewSet(viewsets.ModelViewSet):
    serializer_class = RoomSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_queryset(self):
        my_rooms = json.loads(self.request.query_params.get('my_rooms', 'false'))

        if my_rooms:
            queryset = self.request.user.current_rooms
        
        else:
            queryset = Room.objects.all()

        # in posgres we can do return queryset.order_by('messages').distinct()    
        return queryset
    
    @action(methods=['delete'], detail=True)
    def leave_room(self, request, *args, **kwargs):
        room = self.get_object()
        
        if request.user in room.current_users.all():
            room.current_users.remove(request.user)
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    # Join Room       
    def update(self, request, *args, **kwargs):
        room = self.get_object()

        if request.user not in room.current_users.all():
            room.current_users.add(request.user)
            return Response(status=status.HTTP_200_OK)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        room = self.get_object()

        if request.user == room.host:
            self.perform_destroy(room)
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def perform_create(self, serializer):
        serializer.save(host=self.request.user)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


# class LoginView(generics.GenericAPIView):
#     permission_classes = (permissions.AllowAny,)
#     serializer_class = LoginSerializer
    
#     def post(self, request, format=None):
#         # serializer = LoginSerializer(data=request.data)
#         # if serializer.is_valid():
#         username = request.data.get('username')
#         password = request.data.get('password')
#         user = authenticate(username=username, password=password)

#         if user:
#             login(request, user)
#             return Response({'message': 'logged in!'}, status=status.HTTP_200_OK)
        
#         return Response({'error': 'invalid username/password'})
            
        # return Response({'error': 'invalid data'}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)
    

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


# class LoginCheckView(APIView):
#     permission_classes = [permissions.AllowAny]
    
#     def get(self, request):
        
#         if request.user.is_authenticated:
#             return Response({'message':'authorized', "username": request.user.username}, status=status.HTTP_200_OK)

#         return Response({'message:' 'unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)


class CustomAuthToken(ObtainAuthToken):
    permission_classes = [permissions.AllowAny, ]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            # 'email': user.email
        })