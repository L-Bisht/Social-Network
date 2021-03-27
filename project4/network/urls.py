
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API routes
    path("post", views.post, name="post"),
    path("posts/<str:posted_by>", views.fetch_posts, name="posts"),
    path("comments/<int:post_id>", views.fetch_comments, name="comments"),
    path("profiles/<str:username>", views.fetch_profile, name="profile"),
    path("isfollowing/<str:username>", views.is_following, name="is_following"),
    path("toggle/follow", views.toggle_follow, name="toggle_follow"),
    path("edit/post/<int:post_id>", views.edit_post, name="edit_post"),
]
