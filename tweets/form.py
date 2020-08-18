from django import forms

from .models import Tweet

MAX_TWEET_LENGTH = 6


class TweetForm(forms.ModelForm):
    class Meta:
        model = Tweet
        fields = ['content']

    # use for validation
    def clean_content(self):  # clean_content no need to call built in fun
        content = self.cleaned_data.get("content")
        if len(content) > MAX_TWEET_LENGTH:
            raise forms.ValidationError("This tweet is too long")
        return content
