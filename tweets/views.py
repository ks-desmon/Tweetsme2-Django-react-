import random
from django.shortcuts import render, redirect
from django.http import HttpResponse, Http404, JsonResponse
from django.conf import settings
from django.utils.http import is_safe_url
from .models import Tweet
from .form import TweetForm
from .serializers import TweetSerializers, TweetActionSerializer, TweetCreateSerializers
# replacing jsonresponse to response so no need to send status seprate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

# Create your views here.


def home_view(request, *args, **kwargs):
    # print('hi there', args, kwargs)
    print(request.user)
    # return HttpResponse('Hello world')
    return render(request, "pages/home.html", context={}, status=200)


@api_view(['POST'])
# @authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def tweet_create_view(request, *args, **kwargs):
    serializer = TweetCreateSerializers(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response({}, status=400)


@api_view(['GET'])
def tweet_list_view(request, *args, **kwargs):
    qs = Tweet.objects.all()
    # converting obj into json form for response
    username = request.GET.get('username')
    if username != None:
        qs = qs.filter(user__username__iexact=username)
    serializer = TweetSerializers(qs, many=True)
    return Response(serializer.data, status=200)


@api_view(['GET'])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    # converting obj into json form for response
    serializer = TweetSerializers(qs.first())
    return Response(serializer.data, status=201)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    # chcking user req and the user auth same
    qs = qs.filter(user=request.user)
    if not qs.exists():
        return Response({'message': 'You can not delete this tweet'}, status=401)
    obj = qs.first()
    obj.delete()
    return Response({'message': 'delete tweet done'}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tweet_action_view(request, *args, **kwargs):
    '''Tweet id is req , Actions are like unlike retweet'''
    # while receving/saving JSON.stringify(data) from js to db use request.data not request.POST
    # print(request.data, "checking reqdata")
    serializer = TweetActionSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        tweet_id = data.get('id')
        action = data.get('action')
        content = data.get('content')
        qs = Tweet.objects.filter(id=tweet_id)
        if not qs.exists():
            return Response({"'message': 'my time'"}, status=404)
        obj = qs.first()
        if action == "like":
            data = obj.likes.add(request.user)
            serializer = TweetSerializers(obj)
            return Response(serializer.data, status=200)
        elif action == "unlike":
            obj.likes.remove(request.user)
            serializer = TweetSerializers(obj)
            return Response(serializer.data, status=200)
        elif action == "retweet":
            new_tweet = Tweet.objects.create(
                user=request.user, parent=obj, content=content)
            serializer = TweetSerializers(new_tweet)
            return Response(serializer.data, status=201)
    return Response({}, status=200)

# one button like unlike

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def tweet_Like_view(request, tweet_id, *args, **kwargs):
#     qs = Tweet.objects.filter(id=tweet_id)
#     if not qs.exists():
#         return Response({}, status=404)
#     obj = qs.first()
#     if not request.user in obj.likes.all():
#         obj.likes.add(request.user)
#         return Response({}, status=404)
#     else:
#         obj.likes.remove(request.user)
#         return Response({}, status=404)
#     return Response({'message': 'delete tweet done'}, status=200)


# ////////////////////////////////////////////////////////////////////////////////


# ////////////////////////////////////////////////////////////////////////////////

# ////////////////////////////////////////////////////////////////////////////////


# ////////////////////////////////////////////////////////////////////////////////

# ////////////////////////////////////////////////////////////////////////////////


# ////////////////////////////////////////////////////////////////////////////////

# ////////////////////////////////////////////////////////////////////////////////


# ////////////////////////////////////////////////////////////////////////////////


def tweet_create_view_pure_django(request, *args, **kwargs):
    user = request.user
    if not request.user.is_authenticated:
        print("user is not authenticated")
        user = None
        if request.is_ajax():
            status = 401
            return JsonResponse({}, status=401)
        return redirect(settings.LOGIN_URL)
    # print('ajax', request.is_ajax())
    ALLOWED_HOSTS = settings.ALLOWED_HOSTS

    form = TweetForm(request.POST or None)
    if form.is_valid():
        nextUrl = request.POST.get('next') or None
        obj = form.save(commit=False)
        # Do other form logic
        obj.user = user
        obj.save()
        if request.is_ajax():
            return JsonResponse(obj.serialize(), status=201)
            # return JsonResponse({}, status=201)
        # check url is safe or not
        if nextUrl != None and is_safe_url(nextUrl, ALLOWED_HOSTS):
            return redirect(nextUrl)
        form = TweetForm()
    if form.errors:
        status = 400
        return JsonResponse(form.errors, status=status)
    return render(request, 'components/form.html', context={"form": form})


def tweet_list_view_pure_django(request, *args, **kwargs):
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


def tweet_detail_view_pure_django(request, tweet_id, *args, **kwargs):
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
