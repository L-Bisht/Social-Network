function fetchPosts(postedBy) {
  console.log("inside fetch posts");
  fetch(`/posts/${postedBy}`)
    .then((response) => response.json())
    .then((posts) => {
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

        const nextButton = document.createElement("button");
        nextButton.innerHTML = "next->";
        nextButton.className = "pagination-button";
        nextButton.disabled = false;
        postsObject.appendChild(nextButton);

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

function removeAllChildren(parent) {
  console.log("inside remove");
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function createPosts(posts, from, to) {
  for (let i = from; i < to; i++) {
    createPost(posts[i]);
  }
}

function createPost(post) {
  const postObject = document.createElement("div");
  postObject.className = "post";
  postObject.id = post.id;
  postObject.innerHTML = `
      <h3><a class="user-link" onclick="fetch_profile('${post.poster}');">${post.poster}</a></h3>
      <h4>${post.content}</h4>
      <h5>${post.timestamp}</h5>
      <h6>Liked By ${post.like_count}</h6>
  `;
  if (sessionStorage.getItem('user') != null) {
    if (sessionStorage.getItem('user') == post.poster) {
      let editButton = document.createElement('button');
      editButton.innerHTML = `
        <span class="material-icons">create</span>
      `;
      editButton.id = 'edit-button';
      postObject.appendChild(editButton);
      editButton.addEventListener('click', () => {
        postObject.innerHTML = `
          <form id="edit-form" action="#">
            <textarea name="post" id="post-content" rows="5" placeholder="${post.content}"></textarea>
            </br>
            <input id="post-button" type="submit" value="Save">
          </form>
        `;
      });
    }
  }
  document.querySelector("#posts").appendChild(postObject);
}