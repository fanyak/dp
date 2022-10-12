// REF: https://developer.chrome.com/docs/puppeteer/ssr/
// https://www.youtube.com/watch?v=TsTt7Tja30Q

/**
 *  function to mount the app to a DOM element
 * @param {*} posts resolved promise from /posts call
 * @param {*} container // the DOM element to mount the app on
 */

function renderPosts(posts, container) {
    const html = posts.reduce((html, post) => {
        return `${html}
        <li class="post">
            <h2>${post.title}</h2>
            <div class="summary">${post.body}</div>
            <p>id: ${post.id}</p>
        </li>`;
    }, '');

    // CAREFUL: assumes html is sanitized.
    container.innerHTML = `<ul id="posts">${html}</ul>`;
}

// mount the app to a DOM element
(async() => {
    // check if the page has been pre-rendered (if the #posts element exists)
    // Posts markup is already in DOM if we're seeing a SSR'd.
    // Don't re-hydrate the posts here on the client.
    const PRE_RENDERED = document.querySelector('#posts');
    if (PRE_RENDERED) {
        return;
    }
    const container = document.querySelector('#container');
    const posts = await fetch('/posts').then(resp => resp.json());
    renderPosts(posts, container);
})().then((_) => {
    const posts = document.querySelectorAll('#posts li');
    Array.from(posts).forEach((li) => li.addEventListener('click', console.log))
});
            
