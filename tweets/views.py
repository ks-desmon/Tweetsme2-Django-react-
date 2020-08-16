from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def home_view(request, *args, **kwargs):
    print(args , kwargs)
    return HttpResponse('Hello world')

def tweet_detail_view(request,tweet_id, *args, **kwargs):
    print(args , kwargs)
    return HttpResponse(f'{tweet_id}Hello world')
