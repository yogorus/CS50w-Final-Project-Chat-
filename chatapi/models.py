from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Room(models.Model):
    name = models.CharField(max_length=50, null=False, blank=False, unique=True, db_index=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rooms_as_host')
    users = models.ManyToManyField(User, related_name='rooms', blank=True)

    def __str__(self) -> str:
        return f'{self.name} by {self.host}'


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    text = models.TextField(max_length=400)
    author = models.ForeignKey(User, on_delete=models.PROTECT, related_name='messages')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self) -> str:
        return f'By {self.author} in {self.room} on {self.timestamp}'