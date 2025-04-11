document.addEventListener('DOMContentLoaded', function() {
    // Store messages for each conversation
    const conversations = {};
    let currentChat = null;

    // Initialize chat interface
    function initializeChat() {
        // Get all conversation elements
        const chatItems = document.querySelectorAll('.overflow-y-auto > div');
        const messagesContainer = document.querySelector('.flex-1.overflow-y-auto');
        const messageInput = document.querySelector('textarea');
        const sendButton = document.querySelector('.bg-blue-500.text-white.rounded-full');

        // Add click handlers to conversation items
        chatItems.forEach(chat => {
            chat.addEventListener('click', () => {
                // Update active state
                chatItems.forEach(item => {
                    item.classList.remove('bg-blue-50', 'border-l-4', 'border-blue-500');
                    item.classList.add('hover:bg-gray-50');
                });
                chat.classList.add('bg-blue-50', 'border-l-4', 'border-blue-500');
                chat.classList.remove('hover:bg-gray-50');

                // Update chat header
                const userName = chat.querySelector('h3').textContent;
                const lastMessage = chat.querySelector('p').textContent;
                const userImage = chat.querySelector('img').src;
                updateChatHeader(userName, lastMessage, userImage);

                // Load chat history
                currentChat = userName;
                loadChatHistory(userName, messagesContainer);
            });
        });

        // Handle message sending
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message && currentChat) {
                const newMessage = {
                    text: message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'sent'
                };

                // Add to conversation history
                if (!conversations[currentChat]) {
                    conversations[currentChat] = [];
                }
                conversations[currentChat].push(newMessage);

                // Add message to UI
                addMessageToUI(newMessage, messagesContainer);

                // Clear input
                messageInput.value = '';
                messageInput.style.height = 'auto';
                
                // Update last message in conversation list
                updateLastMessage(currentChat, message);
            }
        }

        // Send button click handler
        sendButton.addEventListener('click', sendMessage);

        // Enter key handler
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize textarea
        messageInput.addEventListener('input', () => {
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
        });

        // Initialize with first conversation
        if (chatItems[0]) {
            chatItems[0].click();
        }
    }

    function updateChatHeader(name, lastMessage, image) {
        const header = document.querySelector('.p-4.border-b.flex');
        const headerHTML = `
            <div class="flex items-center gap-3">
                <img src="${image}" alt="${name}" class="h-12 w-12 rounded-full">
                <div>
                    <h2 class="font-medium">${name}</h2>
                    <p class="text-sm text-gray-500">${lastMessage}</p>
                </div>
            </div>
            <div class="flex gap-4 text-gray-600">
                <button class="hover:text-gray-900" title="Video Call">
                    <i class="fa-solid fa-video"></i>
                </button>
                <button class="hover:text-gray-900" title="More Options">
                    <i class="fa-solid fa-ellipsis"></i>
                </button>
            </div>
        `;
        header.innerHTML = headerHTML;
    }

    function loadChatHistory(userName, container) {
        container.innerHTML = '';
        if (conversations[userName]) {
            conversations[userName].forEach(msg => addMessageToUI(msg, container));
        }
    }

    function addMessageToUI(message, container) {
        const messageHTML = `
            <div class="flex gap-3 ${message.type === 'sent' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in">
                ${message.type === 'received' ? `
                    <div class="flex-shrink-0">
                        <img src="../../images/profile.png" alt="User" class="h-8 w-8 rounded-full shadow-sm">
                    </div>
                ` : ''}
                <div class="max-w-[60%] group">
                    <div class="flex items-end gap-2">
                        ${message.type === 'received' ? `
                            <span class="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                ${message.time}
                            </span>
                        ` : ''}
                        <div class="${message.type === 'sent' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-800'} 
                            p-3 rounded-2xl ${message.type === 'sent' 
                            ? 'rounded-tr-sm' 
                            : 'rounded-tl-sm'} shadow-sm">
                            <p class="text-sm whitespace-pre-wrap break-words">${escapeHTML(message.text)}</p>
                        </div>
                        ${message.type === 'sent' ? `
                            <span class="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                ${message.time}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', messageHTML);
        container.scrollTop = container.scrollHeight;
    }

    function updateLastMessage(userName, message) {
        const chatItem = Array.from(document.querySelectorAll('.overflow-y-auto > div'))
            .find(div => div.querySelector('h3')?.textContent === userName);
        
        if (chatItem) {
            const lastMessageElement = chatItem.querySelector('p');
            if (lastMessageElement) {
                lastMessageElement.textContent = message;
            }
        }
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Initialize chat
    initializeChat();
});