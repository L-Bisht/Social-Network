// To fetch profile of a user and display it on screen
function fetch_profile(ofUser) {
  // remove every element inside the body div
  const parent = document.querySelector(".body");
  removeAllChildren(parent);
  // fetch the profile of the user requested
  fetch(`/profiles/${ofUser}`)
    .then((response) => response.json())
    .then((details) => {
      const profileDetails = document.createElement("div");
      profileDetails.className = "profile-details text-center";
      profileDetails.innerHTML = `
            <h1>${details.username}</h1>
            <h2>Followers: ${details.followers_count}</h1>
            <h2>Following:${details.following_count}</h1>
        `;
      document.querySelector(".body").appendChild(profileDetails);

      if (sessionStorage.getItem("user") != null) {
        fetch(`isfollowing/${ofUser}`)
          .then((response) => response.json())
          .then((following) => {
            if (!following.error) {
              const followButton = document.createElement("button");
              followButton.className = "post-button";
              if (following.isFollowing) {
                followButton.innerHTML = "Unfollow";
              } else {
                followButton.innerHTML = "Follow";
              }
              profileDetails.appendChild(followButton);

              followButton.addEventListener("click", () => {
                console.log("inside followbutton");
                fetch(`toggle/follow/${ofUser}`)
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(data.message);
                    if (data.message.includes("Successful")) {
                      fetch_profile(ofUser);
                    }
                  });
              });
            }
          });
      }
      const posts = document.createElement("div");
      posts.id = "posts";
      document.querySelector(".body").appendChild(posts);
      fetchPosts(ofUser);
    });
}
