from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Follower(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follows")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")

class Post(models.Model):
    content = models.CharField(max_length=1000)
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posted")
    timestamp = models.DateTimeField(auto_now_add=True)
    liked_by = models.ManyToManyField(User, related_name="liked_post")


class Comment(models.Model):
    comment = models.CharField(max_length=256)
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="commented")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
