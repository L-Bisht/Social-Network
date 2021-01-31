from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import Post, User, Comment, Follower


def index(request):
    if request.method == "POST":
        content = request.POST["post"]
        new_post = Post(content=content, poster=request.user)
        new_post.save()
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/index.html", {
            "posts" : Post.objects.all().order_by("-timestamp")
        })

def visit_profile(request, username):
    # Person whose profile is visited
    visited_user = User.objects.get(username=username)
    # Check is viewer is following the user
    try:
       Follower.objects.get(user=visited_user, follower=request.user)
       is_following = True
    except Follower.DoesNotExist:
        is_following = False

    return render(request, "network/profile.html", {
        "visited_user" : visited_user,
        "is_following" : is_following,
        "followers" : Follower.objects.filter(user=visited_user), # List all followers of the visited user
        "following" : Follower.objects.filter(follower=visited_user),
        "posts" : Post.objects.filter(poster=visited_user) # List all the posts of the user
    })


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def follow_unfollow(request, username):
    try:
        # Check if user is already following delete the entry
        entry = Follower.objects.get(user=User.objects.get(username=username), follower=request.user)
        entry.delete()
        print("Entry Deleted")
    except Follower.DoesNotExist:
        # If user does not already follow then add the entry
        follower_entry = Follower(user=User.objects.get(username=username), follower=request.user)
        follower_entry.save()
    return HttpResponseRedirect(reverse("visit_profile", args={username:username}))

@login_required
def followed_accounts_posts(request):
    pass