document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search_box");
    let searchTimeout;
    let searchResultsContainer;

    // Create search results container
    function createSearchContainer() {
        searchResultsContainer = document.createElement('div');
        // Add all necessary styles inline to ensure they're applied
        searchResultsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            width: 300px;
            margin-top: 8px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-height: 400px;
            overflow-y: auto;
            display: none;
            border: 1px solid #e5e7eb;
        `;
        searchInput.parentElement.appendChild(searchResultsContainer);
    }

    createSearchContainer();

    // Handle search input
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length < 2) {
            searchResultsContainer.style.display = 'none';
            return;
        }

        // Show loading state
        searchResultsContainer.style.display = 'block';
        searchResultsContainer.innerHTML = `
            <div style="padding: 1rem; text-align: center; color: #6b7280;">
                <i class="fas fa-spinner fa-spin"></i> Searching...
            </div>
        `;

        // Debounce search requests
        searchTimeout = setTimeout(() => {
            fetchSearchResults(query);
        }, 300);
    });

    // Fetch search results
    async function fetchSearchResults(query) {
        try {
            const response = await fetch(`../../Backend/search.php?query=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.status === 'success') {
                displayResults(data.users);
            } else {
                throw new Error('Search failed');
            }
        } catch (error) {
            searchResultsContainer.innerHTML = `
                <div style="padding: 1rem; text-align: center; color: #ef4444;">
                    <i class="fas fa-exclamation-circle"></i> Error loading results
                </div>
            `;
        }
    }

    // Display results with inline styles
    function displayResults(users) {
        searchResultsContainer.style.display = 'block';
        
        if (users.length === 0) {
            searchResultsContainer.innerHTML = `
                <div style="padding: 1rem; text-align: center; color: #6b7280;">
                    <i class="fas fa-user-slash"></i>
                    <p style="margin-top: 0.25rem;">No users found</p>
                </div>
            `;
        } else {
            searchResultsContainer.innerHTML = `
                <div style="max-height: 400px; overflow-y: auto;">
                    ${users.map(user => `
                        <a href="./profile.html?id=${user.id}" 
                           style="
                               display: flex;
                               align-items: center;
                               gap: 0.75rem;
                               padding: 0.75rem;
                               border-bottom: 1px solid #e5e7eb;
                               transition: background-color 0.2s;
                               text-decoration: none;
                               color: inherit;
                           "
                           onmouseover="this.style.backgroundColor='#f3f4f6'"
                           onmouseout="this.style.backgroundColor='white'">
                            <img src="${user.profile_picture}" 
                                 alt="${user.username}" 
                                 style="
                                     height: 40px;
                                     width: 40px;
                                     border-radius: 50%;
                                     object-fit: cover;
                                     border: 1px solid #e5e7eb;
                                 ">
                            <div>
                                <h4 style="
                                    font-weight: 500;
                                    color: #111827;
                                    margin: 0;
                                ">${user.username}</h4>
                                <p style="
                                    font-size: 0.875rem;
                                    color: #6b7280;
                                    margin: 0;
                                ">${user.headline}</p>
                            </div>
                        </a>
                    `).join('')}
                </div>
            `;
        }
    }

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResultsContainer.contains(e.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });

    // Show results when focusing on search input
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            searchResultsContainer.style.display = 'block';
        }
    });
});