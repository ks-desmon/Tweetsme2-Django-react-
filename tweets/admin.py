from django.contrib import admin

# Register your models here.

from .models import Tweet


class TweetAdmin(admin.ModelAdmin):
    # list_display = ['__str__', 'User']
    # search_fields = ['User__username', 'User__email']

    class Meta:
        model = Tweet


admin.site.register(Tweet, TweetAdmin)
