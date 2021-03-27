from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.base import ModelBase
from django.db.models.fields import related


class User(AbstractUser, models.Model):
    following = models.ManyToManyField("self",symmetrical=False, related_name="follower")
    
    def serialize(self):
        return{
            "id": self.id,
            "username": self.username,
            "followers": [user.username for user in self.follower.all()],
            "followers_count": self.follower.count(),
            "following": [user.username for user in self.following.all()],
            "following_count": self.following.count()
        }


class Post(models.Model):
    content = models.CharField(max_length=1000)
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posted")
    timestamp = models.DateTimeField(auto_now_add=True)
    liked_by = models.ManyToManyField(User, related_name="liked")

    def serialize(self):
        return {
            "id": self.id,
            "poster": self.poster.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "like_count": self.liked_by.count(),
            "liked_by": [user.username for user in self.liked_by.all()]
        }

class Comment(models.Model):
    comment = models.CharField(max_length=256)
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="commented")
    commented_on = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comment")

    def serialize(self):
        return {
            "id": self.id,
            "comment": self.comment,
            "commenter": self.commenter.username,
            "commented_on": self.commented_on.id
        }