
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:username>", views.visit_profile, name="visit_profile"),
    path("followunfollow/<str:username>", views.follow_unfollow, name="follow_unfollow"),

    # API routes
    path("post", views.post, name="post"),
    path("posts/<str:posted_by>", views.fetch_posts, name="posts"),
    path("comments/<int:post_id>", views.fetch_comments, name="comments"),
    path("profiles/<str:username>", views.fetch_profile, name="profile"),
]
