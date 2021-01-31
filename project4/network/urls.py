
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("follow/<str:username>", views.follow_unfollow, name="follow_unfollow"),
    path("profile/<str:username>", views.visit_profile, name="visit_profile"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("/post/followed", views.followed_accounts_posts, name="followed_accounts_posts"),
]
