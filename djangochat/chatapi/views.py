from django.contrib.auth.models import User
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics, viewsets, permissions, filters, status
from .serializers import UserSerializer, RegisterSerializer, RoomSerializer
from .models import Room

import json

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


# For testing purposes 
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)
    

# Used for login
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