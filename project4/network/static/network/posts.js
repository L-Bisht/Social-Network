document.addEventListener('DOMContentLoaded', () => {
    fetch_posts('all');
});

function fetch_posts(by){
    fetch(`/posts/${by}`)
    .then(response => response.json())
    .then(posts => {
        for(post of posts){
            console.log(post.poster);
            console.log(post.content);
        }
    })

    fetch(`/profiles/lbisht`)
    .then(response => response.json())
    .then(data => {
        console.log(data.username);
        console.log(data.id);
        console.log(data.followers);
        console.log(data.following)
    })
}