// This function fetches post posted by a user or all posts
function fetchPosts(postedBy) {
  // JS promise to fetch the posts
  fetch(`/posts/${postedBy}`)
    .then((response) => response.json())
    .then((posts) => {
      // post count is required for pagination
      let postCount = Object.keys(posts).length;
      let postsObject = document.querySelector("#posts");
      let pageNumber = 1;
      let from = 0;
      let maxPostsOnAPage = 10;
      let totalPages = Math.ceil(postCount / maxPostsOnAPage);
      let to = Math.min(maxPostsOnAPage * pageNumber, postCount);
      createPosts(posts, from, to);
      // For pagination
      if (postCount > 10) {
        // created and appended next button
        const prevButton = document.createElement("button");
        prevButton.innerHTML = "<-prev";
        prevButton.className = "pagination-button";
        prevButton.disabled = true;
        postsObject.appendChild(prevButton);

        // created and appended prev button
        const nextButton = document.createElement("button");
        nextButton.innerHTML = "next->";
        nextButton.className = "pagination-button";
        nextButton.disabled = false;
        postsObject.appendChild(nextButton);

        // to show next page when next button is clicked
        nextButton.addEventListener("click", () => {
          prevButton.disabled = false;
          if (pageNumber < totalPages) {
            pageNumber++;
            from = to;
            to = Math.min(maxPostsOnAPage * pageNumber, postCount);

            removeAllChildren(postsObject);
            createPosts(posts, from, to);

            postsObject.appendChild(prevButton);
            postsObject.appendChild(nextButton);

            if (pageNumber == totalPages) {
              nextButton.disabled = true;
            }
          }
        });

        // to show previous page when prev button is clicked
        prevButton.addEventListener("click", () => {
          nextButton.disabled = false;
          if (pageNumber > 0) {
            pageNumber--;
            to = from;
            from = Math.max(to - 10, 0);

            removeAllChildren(postsObject);
            createPosts(posts, from, to);

            postsObject.appendChild(prevButton);
            postsObject.appendChild(nextButton);

            if (pageNumber == 1) {
              prevButton.disabled = true;
            }
          }
        });
      }
    });
}

// This function removes all child of the given parent
function removeAllChildren(parent) {
  console.log("inside remove");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// Create posts at index from and to
function createPosts(posts, from, to) {
  for (let i = from; i < to; i++) {
    createPost(posts[i]);
  }
}

// This function creates individual posts
function createPost(post) {
  // Following chunk of code creates a new post element
  const postObject = document.createElement("div");
  postObject.className = "post";
  postObject.id = post.id;
  postObject.innerHTML = `
      <h3><a class="user-link" onclick="fetch_profile('${post.poster}');">${post.poster}</a></h3>
      <h4 id="post-content-${post.id}">${post.content}</h4>
      <h5>${post.timestamp}</h5>
      <h6 id="like-count-${post.id}">Liked By ${post.like_count}</h6>
  `;
  // If user is logged in user sees an edit icon if the post belongs to the logged in user
  if (sessionStorage.getItem("user") != null) {
    let likeCount = post.like_count;
    let likeButton = document.createElement("button");
    let likeFlag = true;
    if (post.liked_by.includes(sessionStorage.getItem("user"))) {
      likeButton.innerHTML = `<span class="material-icons">thumb_up</span>`;
    }
    else {
      likeFlag = false;
      likeButton.innerHTML = `<span class="material-icons">thumb_up_off_alt</span>`;
    }
    likeButton.className = "icon-button";
    postObject.appendChild(likeButton);
    likeButton.addEventListener("click", () => {
      console.log("inside event listener")
      fetch(`/toggle/like/${post.id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.message.includes("Success")) {
            console.log("toggle like");
            if (likeFlag == false) {
              likeCount++;
              likeFlag = true;
              likeButton.innerHTML = `<span class="material-icons">thumb_up</span>`;
            }
            else {
              likeCount--;
              likeFlag = false;
              likeButton.innerHTML = `<span class="material-icons">thumb_up_off_alt</span>`
            }
            document.querySelector(`#like-count-${post.id}`).innerHTML = `Liked By ${likeCount}`;
          }
        });
    });
    if (sessionStorage.getItem("user") == post.poster) {
      let editButton = document.createElement("button");
      editButton.innerHTML = `
        <span class="material-icons">create</span>
      `;
      editButton.className = "icon-button";
      postObject.appendChild(editButton);

      // When edit icon is clicked a form appears to edit the post
      editButton.addEventListener("click", () => {
        let editForm = document.createElement("form");
        editForm.id = "edit-form";
        const currentContents = document.querySelector(
          `#post-content-${post.id}`
        ).innerHTML;
        editForm.innerHTML = `
            <textarea name="post" class="post-textarea" id="edited-content-${post.id}" rows="5">${currentContents}</textarea>
            </br>
            <input class="post-button" type="submit" value="Save">
        `;
        document.querySelector("#posts").insertBefore(editForm, postObject);
        postObject.style.display = "none";
        editForm.onsubmit = () => {
          const newContent = document.querySelector(
            `#edited-content-${post.id}`
          ).value;
          if (newContent != null || newContent.trim() != "") {
            fetch(`/edit/post/${post.id}`, {
              method: "PUT",
              body: JSON.stringify({
                content: newContent,
              }),
            })
              .then((response) => response.json())
              .then((result) => {
                if (result.message.includes("success")) {
                  console.log("inside inside");
                  document.querySelector("#posts").removeChild(editForm);
                  postObject.style.display = "block";
                  document.querySelector(
                    `#post-content-${post.id}`
                  ).innerHTML = newContent;
                }
              });
          }
          return false;
        };
      });
    }
  }
  document.querySelector("#posts").appendChild(postObject);
}