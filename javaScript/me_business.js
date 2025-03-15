document.addEventListener('DOMContentLoaded', () => {
    const profile = document.getElementById('profile');
    const business = document.getElementById('business');
    const profile_preview = document.getElementById('profile_preview');
    const business_preview = document.getElementById('business_preview');

    let pro_click = true;
    profile.addEventListener('click', (e) => {
        e.stopPropagation();
        pro_click = !pro_click;
        if (!pro_click) {
            profile_preview.classList.remove('hidden');
            business_preview.classList.add('hidden'); // Hide business preview
        } else {
            profile_preview.classList.add('hidden');
        }
    });

    let bus_click = true;
    business.addEventListener('click', (e) => {
        e.stopPropagation();
        bus_click = !bus_click;
        if (!bus_click) {
            business_preview.classList.remove('hidden');
            profile_preview.classList.add('hidden'); // Hide profile preview
        } else {
            business_preview.classList.add('hidden');
        }
    });

    // Prevent clicks inside previews from closing them
    profile_preview.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    business_preview.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Global click handler to close previews when clicking outside
    document.addEventListener('click', (e) => {
        // Close profile preview if clicking outside
        if (!profile_preview.contains(e.target) && !profile.contains(e.target)) {
            profile_preview.classList.add('hidden');
            pro_click = true;
        }
        // Close business preview if clicking outside
        if (!business_preview.contains(e.target) && !business.contains(e.target)) {
            business_preview.classList.add('hidden');
            bus_click = true;
        }
    });


    fetch("/Entrepreneurial-Network-web-development/Backend/me_business.php")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // Get raw response
    })
    .then(text => {
        try {
            let data = JSON.parse(text);
            if (data.error) {
                console.error("Server Error:", data.error);
            } else {
                document.getElementById('username').textContent = data.username;
                document.getElementById('headline').textContent = data.headline && data.headline.trim() !== "" 
                    ? data.headline 
                    : "Hi guys! I am new to FounderForge";
                document.getElementById('profile_picture').src = data.profile_picture && data.profile_picture.trim() !== "" 
                    ? data.profile_picture 
                    : "../../images/profile.png"; 
            }
        } catch (error) {
            console.error("JSON Parse Error:", error, "Raw Response:", text);
        }
    })
    .catch(error => console.error("Fetch Error:", error));

});