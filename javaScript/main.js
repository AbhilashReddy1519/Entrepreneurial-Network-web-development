document.addEventListener('DOMContentLoaded', function() {
    let userData = null;
    let isModalOpen = false;

    // Fetch user data first
    async function initializeUserData() {
        try {
            const response = await fetch("/Entrepreneurial-Network-web-development/Backend/me_business.php");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            userData = {
                username: data.username || 'User Name',
                profilePicture: data.profile_picture?.trim() || '../../images/profile.png',
                headline: data.headline?.trim() || 'Hi guys! I am new to FounderForge'
            };

            // Update UI elements with user data
            updateUIWithUserData();
        } catch (error) {
            console.error("Failed to load user data:", error);
            userData = {
                username: 'User Name',
                profilePicture: '../../images/profile.png',
                headline: 'Hi guys! I am new to FounderForge'
            };
        }
    }

    function updateUIWithUserData() {
        // Update all profile pictures
        document.querySelectorAll('[data-profile-picture]').forEach(img => {
            img.src = userData.profilePicture;
        });

        // Update all username elements
        document.querySelectorAll('[data-username]').forEach(element => {
            element.textContent = userData.username;
        });

        // Update create post button
        const createPostBtn = document.querySelector('.create-post-button');
        if (createPostBtn) {
            const userImg = createPostBtn.previousElementSibling;
            if (userImg) userImg.src = userData.profilePicture;
        }
    }

    function createPostModal() {
        if (isModalOpen) return;
        isModalOpen = true;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-2xl shadow-2xl transform transition-all">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Create a Post</h2>
                    <button class="close-modal text-gray-500 hover:text-gray-700 transition-colors">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                <div class="flex items-center gap-3 mb-4 pb-4 border-b">
                    <img src="${userData?.profilePicture}" alt="Profile" class="h-12 w-12 rounded-full object-cover">
                    <div>
                        <h3 class="font-medium">${userData?.username}</h3>
                        <select class="text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1 mt-1 cursor-pointer hover:bg-gray-200">
                            <option value="public">🌎 Public</option>
                            <option value="connections">👥 Connections</option>
                            <option value="private">🔒 Private</option>
                        </select>
                    </div>
                </div>
                <textarea 
                    class="w-full h-32 p-4 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                    placeholder="What do you want to share?"
                ></textarea>
                <div class="flex justify-between items-center">
                    <div class="flex gap-4">
                        <button type="button" class="media-upload" data-type="image">
                            <i class="fa-regular fa-image text-blue-500"></i>
                        </button>
                        <button type="button" class="media-upload" data-type="video">
                            <i class="fa-solid fa-video text-green-500"></i>
                        </button>
                        <button type="button" class="media-upload" data-type="event">
                            <i class="fa-regular fa-calendar text-orange-500"></i>
                        </button>
                    </div>
                    <button type="submit" class="post-button bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Post
                    </button>
                </div>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(modal);
        addModalListeners(modal);
    }

    function addModalListeners(modal) {
        const closeModal = () => {
            if (!isModalOpen) return;
            modal.classList.add('fade-out');
            document.body.classList.remove('overflow-hidden');
            document.querySelectorAll('.blur-sm').forEach(el => el.classList.remove('blur-sm'));
            setTimeout(() => {
                modal.remove();
                isModalOpen = false;
            }, 200);
        };

        // Close modal handlers
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', e => e.target === modal && closeModal());
        document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());

        // Post button handler
        const textarea = modal.querySelector('textarea');
        const postButton = modal.querySelector('.post-button');

        textarea.addEventListener('input', () => {
            postButton.disabled = textarea.value.trim().length === 0;
        });

        // Media upload handlers
        modal.querySelectorAll('.media-upload').forEach(button => {
            button.addEventListener('click', () => handleMediaUpload(button.dataset.type));
        });
    }

    async function handleMediaUpload(type) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '';
        input.click();

        input.onchange = (e) => {
            const file = e.target.files[0];
            // Handle file upload logic here
            console.log(`Uploading ${type}:`, file.name);
        };
    }

    function handleComment(button) {
        if (!userData) return;

        const post = button.closest('.post');
        if (!post) return;

        let commentSection = post.querySelector('.comments-section');
        
        if (commentSection) {
            commentSection.classList.toggle('hidden');
            return;
        }

        commentSection = document.createElement('div');
        commentSection.className = 'comments-section p-4 border-t';
        commentSection.innerHTML = `
            <div class="flex gap-3">
                <img src="${userData.profilePicture}" 
                    alt="${userData.username}" 
                    class="h-8 w-8 rounded-full object-cover">
                <div class="flex-1">
                    <div class="relative">
                        <input type="text" 
                            placeholder="Write a comment..." 
                            class="w-full bg-gray-100 rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
                            disabled>
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 ml-2">
                        Commenting as ${userData.username}
                    </p>
                </div>
            </div>
            <div class="comments-list mt-4 space-y-3"></div>
        `;

        post.appendChild(commentSection);

        // Add comment input handler
        const input = commentSection.querySelector('input');
        const sendButton = commentSection.querySelector('button');

        input.addEventListener('input', () => {
            sendButton.disabled = input.value.trim().length === 0;
        });

        sendButton.addEventListener('click', () => submitComment(input, post.dataset.postId));
    }

    async function loadMorePosts() {
        let isLoading = false;
        let page = 1;

        window.addEventListener('scroll', async () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

            if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
                isLoading = true;

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Add loading indicator
                const loader = document.createElement('div');
                loader.className = 'text-center py-4';
                loader.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-gray-500 text-2xl"></i>';
                document.querySelector('.space-y-4').appendChild(loader);

                // Simulate getting new posts
                page++;

                // Remove loader after "loading"
                setTimeout(() => {
                    loader.remove();
                    isLoading = false;
                }, 1000);
            }
        });
    }

    function initializeStickyBehavior() {
        const sidebar = document.querySelector('.sticky.top-4');
        let lastScroll = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            const direction = currentScroll > lastScroll ? 'down' : 'up';

            if (direction === 'down' && currentScroll > 100) {
                sidebar.style.transform = 'translateY(-100px)';
            } else {
                sidebar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }

    // Initialize all features
    initializeUserData();
    loadMorePosts();
    initializeStickyBehavior();
});