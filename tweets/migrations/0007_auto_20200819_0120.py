# Generated by Django 2.2.15 on 2020-08-18 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tweets', '0006_auto_20200819_0117'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tweet',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='tweetlike',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
