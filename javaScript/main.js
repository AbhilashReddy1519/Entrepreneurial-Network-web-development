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

    function initializeCreatePost() {
        const createPostButton = document.querySelector('.flex-1.text-left');
        const createPostContainer = document.querySelector('.flex.gap-3');

        if (createPostButton && createPostContainer) {
            // Add click handler to both button and container
            [createPostButton, createPostContainer].forEach(element => {
                element.addEventListener('click', () => {
                    if (!userData) {
                        console.error('User data not loaded');
                        return;
                    }
                    createPostModal();
                });
            });
        }
    }

    function createPostModal() {
        if (isModalOpen) return;
        isModalOpen = true;

        // Add blur effect
        document.body.classList.add('overflow-hidden');
        document.querySelector('header').classList.add('blur-sm');
        document.querySelector('main').classList.add('blur-sm');

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
                        <button type="button" class="media-upload p-2 rounded hover:bg-gray-100" data-type="image">
                            <i class="fa-regular fa-image text-blue-500"></i>
                        </button>
                        <button type="button" class="media-upload p-2 rounded hover:bg-gray-100" data-type="video">
                            <i class="fa-solid fa-video text-green-500"></i>
                        </button>
                        <button type="button" class="media-upload p-2 rounded hover:bg-gray-100" data-type="event">
                            <i class="fa-regular fa-calendar text-orange-500"></i>
                        </button>
                    </div>
                    <button type="submit" class="post-button bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Post
                    </button>
                </div>
            </div>
        `;

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

    function initializeCommentSystem() {
        // Add click handlers to all comment buttons
        document.querySelectorAll('[class*="flex justify-between px-4 py-2 border-t"] button').forEach(button => {
            if (button.querySelector('span').textContent === 'Comment') {
                button.addEventListener('click', () => handleComment(button));
            }
        });
    }

    function handleComment(button) {
        const post = button.closest('.bg-white');
        if (!post) return;

        // Check if comment section already exists
        let commentSection = post.querySelector('.comment-section');
        
        if (commentSection) {
            // Toggle visibility if already exists
            commentSection.classList.toggle('hidden');
            return;
        }

        // Create new comment section
        commentSection = document.createElement('div');
        commentSection.className = 'comment-section p-4 border-t';
        commentSection.innerHTML = `
            <div class="flex gap-3">
                <img src="${userData?.profilePicture || '../../images/profile.png'}" 
                    alt="Profile" 
                    class="h-8 w-8 rounded-full object-cover">
                <div class="flex-1">
                    <div class="relative">
                        <input type="text" 
                            placeholder="Write a comment..." 
                            class="w-full bg-gray-100 rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:opacity-50 send-comment"
                            disabled>
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 ml-2">
                        Commenting as ${userData?.username || 'User'}
                    </p>
                </div>
            </div>
            <div class="comments-list mt-4 space-y-3"></div>
        `;

        post.appendChild(commentSection);

        // Add input handler
        const input = commentSection.querySelector('input');
        const sendButton = commentSection.querySelector('.send-comment');

        input.addEventListener('input', () => {
            sendButton.disabled = input.value.trim().length === 0;
        });

        // Add send handler
        sendButton.addEventListener('click', () => {
            if (input.value.trim()) {
                addCommentToList(post, input.value);
                input.value = '';
                sendButton.disabled = true;
            }
        });

        // Add enter key handler
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                addCommentToList(post, input.value);
                input.value = '';
                sendButton.disabled = true;
            }
        });
    }

    function addCommentToList(post, commentText) {
        const commentsList = post.querySelector('.comments-list');
        const comment = document.createElement('div');
        comment.className = 'flex gap-3 items-start animate-fade-in';
        comment.innerHTML = `
            <img src="${userData?.profilePicture || '../../images/profile.png'}" 
                alt="Profile" 
                class="h-8 w-8 rounded-full object-cover">
            <div class="flex-1 bg-gray-100 rounded-lg p-3">
                <div class="flex items-center gap-2">
                    <h4 class="font-medium text-sm">${userData?.username || 'User'}</h4>
                    <span class="text-xs text-gray-500">Just now</span>
                </div>
                <p class="text-sm mt-1">${escapeHTML(commentText)}</p>
                <div class="flex gap-4 mt-2 text-xs text-gray-500">
                    <button class="hover:text-blue-600">Like</button>
                    <button class="hover:text-blue-600">Reply</button>
                </div>
            </div>
        `;
        
        commentsList.insertBefore(comment, commentsList.firstChild);
    }

    // Helper function to escape HTML and prevent XSS
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function handleShare(button) {
        const post = button.closest('.bg-white');
        if (!post) return;

        const postContent = {
            text: post.querySelector('p')?.textContent || '',
            author: post.querySelector('.font-semibold')?.textContent || '',
            image: post.querySelector('img[alt="Profile"]')?.src || ''
        };

        const shareModal = document.createElement('div');
        shareModal.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50';
        shareModal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl transform transition-all">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Share this post</h2>
                    <button class="close-modal text-gray-500 hover:text-gray-700">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
                
                <!-- Post Preview -->
                <div class="border rounded-lg p-3 mb-4 bg-gray-50">
                    <div class="flex items-center gap-2 mb-2">
                        <img src="${postContent.image}" alt="Author" class="h-8 w-8 rounded-full">
                        <span class="font-medium">${postContent.author}</span>
                    </div>
                    <p class="text-sm text-gray-600">${postContent.text.substring(0, 100)}${postContent.text.length > 100 ? '...' : ''}</p>
                </div>

                <!-- Share Options -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <!-- Social Media Sharing -->
                    <button class="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition-colors" 
                        onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href))">
                        <i class="fab fa-linkedin text-[#0077b5] text-xl"></i>
                        <span>LinkedIn</span>
                    </button>
                    <button class="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                        onclick="window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent('Check out this post: ' + window.location.href))">
                        <i class="fab fa-twitter text-[#1DA1F2] text-xl"></i>
                        <span>Twitter</span>
                    </button>
                    <button class="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                        onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href))">
                        <i class="fab fa-facebook text-[#4267B2] text-xl"></i>
                        <span>Facebook</span>
                    </button>
                    <button class="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                        onclick="navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!'))">
                        <i class="fas fa-link text-gray-600 text-xl"></i>
                        <span>Copy Link</span>
                    </button>
                </div>

                <!-- Direct Share -->
                <div class="border-t pt-4">
                    <div class="relative">
                        <input type="text" 
                            placeholder="Search connections to share with..." 
                            class="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(shareModal);

        // Add event listeners
        const closeButton = shareModal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
            shareModal.classList.add('fade-out');
            setTimeout(() => shareModal.remove(), 200);
        });

        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.classList.add('fade-out');
                setTimeout(() => shareModal.remove(), 200);
            }
        });
    }

    function initializePostInteractions() {
        document.querySelectorAll('.flex.justify-between.px-4.py-2.border-t button').forEach(button => {
            const buttonText = button.querySelector('span')?.textContent;
            if (buttonText === 'Share') {
                button.addEventListener('click', () => handleShare(button));
            }
        });
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

    function initializeLikeButtons() {
        document.querySelectorAll('button:has(.fa-thumbs-up)').forEach(button => {
            // Create reaction popup
            const reactionPopup = document.createElement('div');
            reactionPopup.className = 'absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-white rounded-full shadow-lg p-1 transition-all opacity-0 scale-95 origin-bottom-left';
            reactionPopup.innerHTML = `
                <button class="reaction-btn p-2 hover:bg-gray-100 rounded-full group transition-all" data-reaction="like">
                    <i class="fa-solid fa-thumbs-up text-blue-500 group-hover:scale-125 transition-transform"></i>
                </button>
                <button class="reaction-btn p-2 hover:bg-gray-100 rounded-full group transition-all" data-reaction="love">
                    <i class="fa-solid fa-heart text-red-500 group-hover:scale-125 transition-transform"></i>
                </button>
                <button class="reaction-btn p-2 hover:bg-gray-100 rounded-full group transition-all" data-reaction="celebrate">
                    <i class="fa-solid fa-rocket text-yellow-500 group-hover:scale-125 transition-transform"></i>
                </button>
                <button class="reaction-btn p-2 hover:bg-gray-100 rounded-full group transition-all" data-reaction="support">
                    <i class="fa-solid fa-hands-clapping text-green-500 group-hover:scale-125 transition-transform"></i>
                </button>
            `;

            // Make the button relative for positioning
            button.classList.add('relative');
            button.appendChild(reactionPopup);

            // Show/hide reaction popup on hover
            let timeoutId;
            button.addEventListener('mouseenter', () => {
                clearTimeout(timeoutId);
                reactionPopup.classList.remove('opacity-0', 'scale-95');
                reactionPopup.classList.add('opacity-100', 'scale-100');
            });

            button.addEventListener('mouseleave', () => {
                timeoutId = setTimeout(() => {
                    reactionPopup.classList.remove('opacity-100', 'scale-100');
                    reactionPopup.classList.add('opacity-0', 'scale-95');
                }, 300);
            });

            // Handle reactions
            reactionPopup.querySelectorAll('.reaction-btn').forEach(reactionBtn => {
                reactionBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const reaction = reactionBtn.dataset.reaction;
                    const mainButton = reactionBtn.closest('button[class*="flex items-center"]');
                    const icon = mainButton.querySelector('i');
                    const text = mainButton.querySelector('span');

                    // Update the button appearance
                    icon.className = ''; // Clear existing classes
                    text.textContent = reaction.charAt(0).toUpperCase() + reaction.slice(1);

                    switch(reaction) {
                        case 'like':
                            icon.className = 'fa-solid fa-thumbs-up text-blue-500';
                            break;
                        case 'love':
                            icon.className = 'fa-solid fa-heart text-red-500';
                            break;
                        case 'celebrate':
                            icon.className = 'fa-solid fa-rocket text-yellow-500';
                            break;
                        case 'support':
                            icon.className = 'fa-solid fa-hands-clapping text-green-500';
                            break;
                    }

                    // Add active state
                    mainButton.classList.add('is-active');
                    mainButton.setAttribute('data-reaction', reaction);

                    // Hide popup
                    reactionPopup.classList.remove('opacity-100', 'scale-100');
                    reactionPopup.classList.add('opacity-0', 'scale-95');

                    // Update reaction count
                    const countElement = mainButton.closest('.bg-white').querySelector('.flex.gap-1.items-center span:last-child');
                    if (countElement) {
                        let count = parseInt(countElement.textContent);
                        if (!mainButton.classList.contains('is-active')) {
                            count++;
                        }
                        countElement.textContent = count;
                    }
                });
            });

            // Handle main button click (toggle like)
            button.addEventListener('click', function(e) {
                if (e.target.closest('.reaction-btn')) return;
                
                const icon = this.querySelector('i');
                const text = this.querySelector('span');
                const isActive = this.classList.contains('is-active');

                if (!isActive) {
                    icon.className = 'fa-solid fa-thumbs-up text-blue-500';
                    text.textContent = 'Like';
                    this.classList.add('is-active');
                    this.setAttribute('data-reaction', 'like');
                } else {
                    icon.className = 'fa-regular fa-thumbs-up';
                    text.textContent = 'Like';
                    this.classList.remove('is-active');
                    this.removeAttribute('data-reaction');
                }

                // Update count
                const countElement = this.closest('.bg-white').querySelector('.flex.gap-1.items-center span:last-child');
                if (countElement) {
                    let count = parseInt(countElement.textContent);
                    count += isActive ? -1 : 1;
                    countElement.textContent = count;
                }
            });
        });
    }

    async function initialize() {
        try {
            await initializeUserData();
            initializeCreatePost();
            initializeCommentSystem();
            initializePostInteractions();
            initializeStickyBehavior();
            initializeLikeButtons();
            loadMorePosts();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    initialize();
});
