from rest_framework import authentication
from django.contrib.auth import get_user_model


class DevAuthentication(authentication.BasicAuthentication):
    def authenticate(self, request):
        get_user_model().objects.all().first()
        return (get_user_model().objects.all().order_by('?').first(), None)
