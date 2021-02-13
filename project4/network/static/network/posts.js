document.addEventListener("DOMContentLoaded", () => {
    fetchPosts('all');
    const postForm = document.querySelector('#post-form');

    if(postForm != null){
        postForm.onsubmit = () => {
            // Get content object of the post
            const postContent = document.querySelector('#post-content');

            // Make the post request with the post content
            if(postContent.value != ""){
                fetch('/post', {
                    method: 'POST',
                    body: JSON.stringify({
                        content: postContent.value
                    })
                })
                .then(response => response.json())
                .then(result => {
                    if(result.message == "Post created successfully."){
                        postContent.value = "";
                    }
                    document.querySelector('#posts').remove();
                    const postsObject = document.createElement('div');
                    postsObject.id = "posts";
                    document.querySelector('.body').appendChild(postsObject);
                    fetchPosts('all');
                });
            }
            return false;
        };
    }
});

function fetchPosts(postedBy){
    console.log("inside fetch posts");
    fetch(`/posts/${postedBy}`)
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => {
            const postObject = document.createElement('div');
            postObject.className = "post";
            postObject.id = post.id;
            postObject.innerHTML = `
                <h3><a class="user-link" href="/profiles/${post.poster}">${post.poster}</a></h3>
                <h4>${post.content}</h4>
                <h4>${post.timestamp}</h4>
                <h6>Liked By ${post.like_count}</h6>
            `;
            document.querySelector('#posts').appendChild(postObject);
        });
    });
}