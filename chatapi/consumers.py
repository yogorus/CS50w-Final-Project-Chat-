from django.contrib.auth.models import User
from .serializers import UserSerializer
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.permissions import IsAuthenticated

from djangochannelsrestframework.mixins import (
    ListModelMixin,
    RetrieveModelMixin,
    PatchModelMixin,
    UpdateModelMixin,
    CreateModelMixin,
    DeleteModelMixin,
)

class UserConsumer(
        ListModelMixin,
        RetrieveModelMixin,
        PatchModelMixin,
        UpdateModelMixin,
        CreateModelMixin,
        DeleteModelMixin,
        GenericAsyncAPIConsumer,
):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]