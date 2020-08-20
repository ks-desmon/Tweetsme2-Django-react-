from django.db import models
import random
# Create your models here.
from django.conf import settings

User = settings.AUTH_USER_MODEL  # initialize user table in to databasetables


class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # have to use "" because Tweet is placed below then TweetLike
    tweet = models.ForeignKey("Tweet", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


class Tweet(models.Model):
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL)
    # Adding User table's primary key into Tweet table as ForeignKey in user field
    # one user can have many tweets, if user delete so tweets too
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # models.ForeignKey(User,null=True,on_delete=models.SET_NULL)
    # one user can have many tweets, if user delete so tweets "null"
    content = models.TextField(null=True, blank=True)
    # manyto mnay will give list of users who like that tweet
    likes = models.ManyToManyField(
        User, related_name='tweet_user', blank=True, through=TweetLike)
    image = models.FileField(upload_to='images/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    # uncomment and check the tweet table in db
    # def __str__(self):
    #     return self.content

    class Meta:
        # so data will store in reverse order and we will get latest data at the top
        ordering = ["-id"]

    def serialize(self):
        return{
            "id": self.id,
            "content": self.content,
            "likes": random.randint(0, 200)
        }
