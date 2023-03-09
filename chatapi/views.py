from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User, Group
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, viewsets, permissions, status
from .serializers import UserSerializer, GroupSerializer, RegisterSerializer, LoginSerializer

# Create your views here.
def index(request):
    return render(request, 'index.html')

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class LoginView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer
    
    def post(self, request, format=None):
        # serializer = LoginSerializer(data=request.data)
        # if serializer.is_valid():
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            login(request, user)
            return Response({'message': 'logged in!'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'invalid username/password'})
            
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

