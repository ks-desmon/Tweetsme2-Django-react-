from django.db import models
import random
# Create your models here.


class Tweet(models.Model):
    content = models.TextField(null=True, blank=True)
    image = models.FileField(upload_to='images/', blank=True, null=True)

    class Meta:
        # so data will store in reverse order and we will get latest data at the top
        ordering = ["-id"]

    def serialize(self):
        return{
            "id": self.id,
            "content": self.content,
            "likes": random.randint(0, 200)
        }
