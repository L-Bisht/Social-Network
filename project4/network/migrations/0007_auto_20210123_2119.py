# Generated by Django 3.1.2 on 2021-01-23 15:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0006_auto_20210123_2047'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Followers',
            new_name='Follower',
        ),
    ]
