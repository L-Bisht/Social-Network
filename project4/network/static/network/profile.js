// To fetch profile of a user and display it on screen
function fetch_profile(ofUser) {
  const parent = document.querySelector(".body");
  removeAllChildren(parent);
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
      const posts = document.createElement("div");
      fetch(`isfollowing/${ofUser}`)
        .then((response) => response.json())
        .then((following) => {
          if (!following.error) {
            const followButton = document.createElement("button");
            if (following.isFollowing) {
              followButton.innerHTML = "Unfollow";
            } else {
              followButton.innerHTML = "Follow";
            }
            profileDetails.appendChild(followButton);

            followButton.addEventListener("click", () => {
              console.log("inside followbutton");
              fetch(`toggle/follow`, {
                method: "POST",
                body: JSON.stringify({
                  user: ofUser,
                }),
              })
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
      posts.id = "posts";
      document.querySelector(".body").appendChild(posts);
      fetchPosts(ofUser);
    });
}