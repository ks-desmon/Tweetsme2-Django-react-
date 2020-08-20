from rest_framework import serializers

from .models import Tweet

from django.conf import settings

MAX_TWEET_LENGTH = settings.MAX_TWEET_LENGTH

TWEET_ACTION_OPTION = settings.TWEET_ACTION_OPTION


# Serializer will take fields values from HTML
# (can do it with POST.get('data')) but to validate we pass data here
class TweetActionSerializer(serializers.Serializer):
    id = serializers.IntegerField
    action = serializers.CharField()

    def validate_action(self, value):
        value = value.lower().strip()
        if not value in TWEET_ACTION_OPTION:
            raise serializers.ValidationError('Not a valid Tweet')
        return value


# ModelSerializer will take fields values from model
class TweetSerializers(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = ['content']

    # validate_+field need to validate
    def validate_content(self, value):
        if len(value) > MAX_TWEET_LENGTH:
            raise serializers.ValidationError("This tweet is too long")
        return value
