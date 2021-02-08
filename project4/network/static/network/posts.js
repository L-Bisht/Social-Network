document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#post-form').onsubmit = () => {
        const contentElement = document.querySelector('#post-content');
        const content = contentElement.value;
        fetch(`/post`, {
            method: 'POST',
            body: JSON.stringify({
                content: content
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result.message);
        })
        contentElement.value = "";
        return false;
    }
});