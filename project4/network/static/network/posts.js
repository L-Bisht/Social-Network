// Show content after the dom is done loading
document.addEventListener("DOMContentLoaded", () => {
  // Fetch all the posts available
  fetchPosts("all");

  // Add event listener on the post form
  const postForm = document.querySelector("#post-form");

  if (postForm != null) {
    postForm.onsubmit = () => {
      // Get content object of the post
      const postContent = document.querySelector("#post-content");

      // Make the post request with the post content
      if (postContent.value != "" || postContent.trim() != "") {
        fetch("/post", {
          method: "POST",
          body: JSON.stringify({
            content: postContent.value,
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.message == "Post created successfully.") {
              postContent.value = "";
              document.querySelector("#posts").remove();
              const postsObject = document.createElement("div");
              postsObject.id = "posts";
              document.querySelector(".body").appendChild(postsObject);
              fetchPosts("all");
            }
          });
      }
      return false;
    };
  }

  const followingLink = document.querySelector('#following-link');
    if(followingLink != null){
        followingLink.onclick = () => {
            const parent = document.querySelector('.body');
            removeAllChildren(parent);
            const postsObject = document.createElement('div');
            postsObject.id = "posts";
            document.querySelector('.body').appendChild(postsObject);
            fetchPosts("following");
        };
    }
});