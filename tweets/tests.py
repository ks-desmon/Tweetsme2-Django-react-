from django.test import TestCase
from .models import Tweet
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

# Create your tests here.
User = get_user_model()


class TweetTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="abc", password="something")
        self.user2 = User.objects.create_user(
            username="abc2", password="something2")
        Tweet.objects.create(content="my tweet 1", user=self.user)
        Tweet.objects.create(content="my tweet 2", user=self.user)
        Tweet.objects.create(content="my tweet 3", user=self.user2)
        self.currentcount = Tweet.objects.all().count()

    def test_user_created(self):
        self.assertEqual(self.user.username, "abc")

    def test_tweet_created(self):
        tweet = Tweet.objects.create(content="my tweet 4", user=self.user)
        self.assertEqual(tweet.id, 4)
        self.assertEqual(tweet.user, self.user)

    def get_client(self):
        client = APIClient()
        client.login(username='abc', password='something')
        return client

    def test_tweet_list(self):
        client = self.get_client()
        response = client.get("/api/tweets/")
        self.assertEqual(response.status_code, 200)
        # print(response.json())

    def test_action_like(self):
        client = self.get_client()
        response = client.post("/api/tweets/action/",
                               {'id': 1, 'action': 'like'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('likes'), 1)

    def test_action_retweet(self):
        client = self.get_client()
        response = client.post("/api/tweets/action/",
                               {'id': 1, 'action': 'retweet'})
        self.assertEqual(response.status_code, 201)
        self.assertNotEqual(1, response.json().get('id'))
        # print(response.json())
        self.assertEqual(self.currentcount+1,
                         response.json().get('id'))

    def tweet_create_api_view(self):
        client = self.get_client()
        response = client.post("/api/tweets/create/",
                               {'content': ' this is my tweet'})
        self.assertEqual(response.status_code, 201)
        self.assertNotEqual(1, response.json().get('id'))
        # print(response.json(), "show off")
        self.assertEqual(self.currentcount+1,
                         response.json().get('id'))

    def tweet_detail_api_view(self):
        client = self.get_client()
        response = client.post("/api/tweets/1/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('id'), 1)

    def tweet_delete_api_view(self):
        client = self.get_client()
        response = client.post("/api/tweets/1/delete")
        self.assertEqual(response.status_code, 200)
        response = client.post("/api/tweets/1/delete")
        self.assertEqual(response.status_code, 404)
        response = client.post("/api/tweets/3/delete")
        self.assertEqual(response.status_code, 401)
