import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
from django.http.response import JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import Comment, User, Post


def index(request):
    return render(request, "network/index.html")


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

def visit_profile(request, username):
    visited_user = User.objects.get(username=username)
    return render(request, "network/profile.html", {
        "visited_user" : visited_user,
        "following" : visited_user.following.all(),
        "followers" : visited_user.follower.all()
    })

@login_required
def follow_unfollow(request, username):
    visited_user = User.objects.get(username=username)
    if visited_user in request.user.following.all():
        request.user.following.remove(visited_user)
        print("user is following visited user")
    else:
        request.user.following.add(visited_user)
        print("user is not following user")

    return HttpResponseRedirect(reverse("visit_profile", args={username:username}))

# API functions
@csrf_exempt
@login_required
def post(request):

    # Creating a post requires POST request (no pun intended)
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)

    # Fetch the content of post
    content = data.get("content", "")
    if not content:
        return JsonResponse({"error": "Post content required."}, status=400)
    new_post = Post(content=content, poster=request.user)
    new_post.save()

    return JsonResponse({"message": "Post created successfully."}, status=201)


def fetch_posts(request, posted_by):
    # return the posts based on the parameters passed
    if posted_by == "following":
        posts = Post.objects.filter(
            posted_by__in=request.user.follower.all()
        )
    elif posted_by == "all":
        posts = Post.objects.all()
    else:
        try:
            posts = Post.objects.filter(
                poster=User.objects.get(username=posted_by)
            )
        except User.DoesNotExist:
            return JsonResponse({"error": "no such User"}, status=400)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post does not exist"}, status=400)
    
    # Return posts in reverse chronological order
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)

def fetch_comments(request, post_id):

    comments = Comment.objects.filter(
        commented_on=Post.objects.get(pk=post_id)
    )

    comments = comments.order_by("-pk").all()
    return JsonResponse([comment.serialize() for comment in comments], safe=False)

def fetch_profile(request, username):
    try:
        requested_user = User.objects.get(
            username=username
        )
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=400)
        
    return JsonResponse(requested_user.serialize(), safe=False)