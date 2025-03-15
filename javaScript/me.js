document.addEventListener('DOMContentLoaded', () => {
    const postsBtn = document.getElementById('postsBtn');
    const articlesBtn = document.getElementById('articlesBtn');

    if(postsBtn && articlesBtn) {
        postsBtn.addEventListener('click', () => {
            postsBtn.classList.remove('text-gray-600');
            postsBtn.classList.add('bg-green-600', 'text-white');
            articlesBtn.classList.remove('bg-green-600', 'text-white');
            articlesBtn.classList.add('text-gray-600');
        });

        articlesBtn.addEventListener('click', () => {
            articlesBtn.classList.remove('text-gray-600');
            articlesBtn.classList.add('bg-green-600', 'text-white');
            postsBtn.classList.remove('bg-green-600', 'text-white');
            postsBtn.classList.add('text-gray-600');
        });
    }
});