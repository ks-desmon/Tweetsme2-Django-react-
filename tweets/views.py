from django.shortcuts import render
from django.http import HttpResponse , Http404 , JsonResponse
from .models import Tweet
# Create your views here.

def home_view(request, *args, **kwargs):
    print(args , kwargs)
    #return HttpResponse('Hello world')
    return render(request, "pages/home.html", context={}, status=200)

def tweet_list_view(request ,*args , **kwargs):
    #select all values from model
    qs = Tweet.objects.all()
    tweet_list = [{"id":x.id,"content":x.content}for x in qs]
    data = {
        "response" : tweet_list
    }
    return JsonResponse(data,status=200)

def tweet_detail_view(request,tweet_id, *args, **kwargs):
    # print(args , kwargs)
    # Get single data from model
    # try:
    #     obj = Tweet.objects.get(id=tweet_id)                    
    # except:
    #     raise Http404
    # return HttpResponse(f'{tweet_id}Hello world {obj.content}')


    #    '''Rest API  For Returning JSON data'''


    try:
        obj = Tweet.objects.get(id=tweet_id)
        data = {
            "id" : tweet_id,
            "Content" : obj.content
        }
        status = 200
    except:
        data = {
            "id" : tweet_id,
            "message" : "id not found"
        }
        status = 400
        
    return JsonResponse(data,status=status)
