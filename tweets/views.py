import random
from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse
from .models import Tweet
from .form import TweetForm
from django.conf import settings
from django.utils.http import is_safe_url
# Create your views here.


def home_view(request, *args, **kwargs):
    print('hi there', args, kwargs)
    # return HttpResponse('Hello world')
    return render(request, "pages/home.html", context={}, status=200)


def tweet_create_view(request, *args, **kwargs):
    print('ajax', request.is_ajax())
    ALLOWED_HOSTS = settings.ALLOWED_HOSTS

    form = TweetForm(request.POST or None)
    if form.is_valid():
        nextUrl = request.POST.get('next') or None
        obj = form.save(commit=False)
        # Do other form logic
        obj.save()
        if request.is_ajax():
            return JsonResponse(obj.serialize(), status=201)
            # return JsonResponse({}, status=201)
        if nextUrl != None and is_safe_url(nextUrl, ALLOWED_HOSTS):
            return redirect(nextUrl)
        form = TweetForm()
    return render(request, 'components/form.html', context={"form": form})


def tweet_list_view(request, *args, **kwargs):
    # select all values from model
    qs = Tweet.objects.all()

    tweet_list = [x.serialize() for x in qs]

    # tweet_list = [{"id": x.id,
    #                "content": x.content,
    #                "likes": random.randint(1, 90)}for x in qs]
    data = {
        "response": tweet_list
    }
    status = 201
    return JsonResponse(data, status=status)


def tweet_detail_view(request, tweet_id, *args, **kwargs):
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
            "id": tweet_id,
            "Content": obj.content
        }
        status = 200
    except:
        data = {
            "id": tweet_id,
            "message": "id not found"
        }
        status = 400

    return JsonResponse(data, status=status)
