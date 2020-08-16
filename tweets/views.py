from django.shortcuts import render
from django.http import HttpResponse , Http404
from .models import Tweet
# Create your views here.

def home_view(request, *args, **kwargs):
    print(args , kwargs)
    return HttpResponse('Hello world')

def tweet_detail_view(request,tweet_id, *args, **kwargs):
    # print(args , kwargs)
    try:
        obj = Tweet.objects.get(id=tweet_id)
    except:
        raise Http404
    return HttpResponse(f'{tweet_id}Hello world {obj.content}')
