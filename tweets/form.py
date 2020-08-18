from django import forms

from .models import Tweet

from django.conf import settings

MAX_TWEET_LENGTH = settings.MAX_TWEET_LENGTH

# MAX_TWEET_LENGTH = 200


class TweetForm(forms.ModelForm):
    class Meta:
        # setting which model needs form
        model = Tweet
        # setting or selecting the fields from model to show in form
        fields = ['content']

    # use for validation
    def clean_content(self):  # clean_content no need to call built in fun
        content = self.cleaned_data.get("content")
        if len(content) > MAX_TWEET_LENGTH:
            raise forms.ValidationError("This tweet is too long")
        return content
