# Generated by Django 2.2.15 on 2020-08-18 15:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tweets', '0004_tweet_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tweet',
            old_name='User',
            new_name='user',
        ),
    ]