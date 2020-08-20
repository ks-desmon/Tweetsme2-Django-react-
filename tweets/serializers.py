from rest_framework import serializers

from .models import Tweet

from django.conf import settings

MAX_TWEET_LENGTH = settings.MAX_TWEET_LENGTH

TWEET_ACTION_OPTION = settings.TWEET_ACTION_OPTION


# Serializer will take fields values from HTML
# (can do it with POST.get('data')) but to validate we pass data here
class TweetActionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    action = serializers.CharField()
    content = serializers.CharField(allow_blank=True, required=False)

    # Validate+action(feild need to validate)
    def validate_action(self, value):
        value = value.lower().strip()
        if not value in TWEET_ACTION_OPTION:
            raise serializers.ValidationError('Not a valid Tweet')
        print(value, "validating")
        return value


# ModelSerializer will take fields values from model


class TweetCreateSerializers(serializers.ModelSerializer):

    # get the data from db need to place at top require
    likes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Tweet
        fields = ['id', 'content', 'likes']

    # counting the perticular field
    def get_likes(self, obj):
        return obj.likes.count()

    # validate_+field need to validate
    def validate_content(self, value):
        if len(value) > MAX_TWEET_LENGTH:
            raise serializers.ValidationError("This tweet is too long")
        return value


# ModelSerializer will take fields values from model
class TweetSerializers(serializers.ModelSerializer):

    # get the data from db need to place at top require
    likes = serializers.SerializerMethodField(read_only=True)
    content = serializers.SerializerMethodField(read_only=True)

    parent = TweetCreateSerializers(read_only=True)

    class Meta:
        model = Tweet
        fields = ['id', 'content', 'likes', 'parent']

    # counting the perticular field
    def get_likes(self, obj):
        return obj.likes.count()

    def get_content(self, obj):
        content = obj.content
        # if obj.is_retweet:
        #     content = obj.parent.content
        return content
