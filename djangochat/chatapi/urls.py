from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'rooms', views.RoomViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('chat/', views.index, name='index'),
     path("chat/<str:room_name>/", views.room, name="room"),
    path('login/', views.LoginView.as_view()),
    path('register/', views.RegisterView.as_view())
]
