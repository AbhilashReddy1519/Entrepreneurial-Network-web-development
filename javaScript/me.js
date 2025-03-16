document.addEventListener('DOMContentLoaded', () => {
    let postsBtn = document.getElementById('postsBtn');
    let articlesBtn = document.getElementById('articlesBtn');

    if (postsBtn && articlesBtn) {
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

    let bannerBtn = document.getElementById('banner');
    let bannerPopup = document.getElementById('bannerPopup');
    let closeBannerPopup = document.getElementById('closeBannerPopup');
    let cancelBannerChange = document.getElementById('cancelBannerChange');
    let bannerInput = document.getElementById('bannerInput');
    let bannerPreview = document.getElementById('bannerPreview');
    let saveBannerChange = document.getElementById('saveBannerChange');
    let mainBannerImg = document.getElementById('banner_img'); // Fixed

    // Open popup
    bannerBtn.addEventListener('click', () => {
        bannerPopup.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    // Close popup functions
    let closePopup = () => {
        bannerPopup.classList.add('hidden');
        document.body.style.overflow = '';
    };

    closeBannerPopup.addEventListener('click', closePopup);
    cancelBannerChange.addEventListener('click', closePopup);

    // Close on outside click
    bannerPopup.addEventListener('click', (e) => {
        if (e.target === bannerPopup) {
            closePopup();
        }
    });

    // Handle file input change
    bannerInput.addEventListener('change', (e) => {
        let file = e.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                bannerPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Save the new banner image
    saveBannerChange.addEventListener('click', () => {
        let file = bannerInput.files[0];
        if (!file) {
            alert("Please select an image first.");
            return;
        }
        if (!file.type.startsWith("image/")) {
            alert("Only image files are allowed!");
            return;
        }

        let formData = new FormData();
        formData.append("banner", file);

        fetch("/Entrepreneurial-Network-web-development/Backend/upload_banner.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Upload Response:", data); // Debugging
            if (data.success) {
                mainBannerImg.src = data.filepath; // Update banner image on UI
                alert("Background Photo updated successfully!");
                closePopup();
            } else {
                alert("Upload failed: " + data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    });

    let profileBtn = document.getElementById('profile_img'); // Profile image button
    let profilePopup = document.getElementById('profilePopup');
    let closeProfilePopup = document.getElementById('closeProfilePopup');
    let cancelProfileChange = document.getElementById('cancelProfileChange');
    let profileInput = document.getElementById('profileInput');
    let profilePreview = document.getElementById('profilePreview');
    let saveProfileChange = document.getElementById('saveProfileChange');
    let mainProfileImg = document.getElementById('profile_img'); // Ensure this exists in me.html

    // Open popup
    profileBtn.addEventListener('click', () => {
        profilePopup.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    // Close popup functions
    let closePopupP = () => {
        profilePopup.classList.add('hidden');
        document.body.style.overflow = '';
    };

    closeProfilePopup.addEventListener('click', closePopupP);
    cancelProfileChange.addEventListener('click', closePopupP);

    // Close on outside click
    profilePopup.addEventListener('click', (e) => {
        if (e.target === profilePopup) {
            closePopupP();
        }
    });

    // Handle file input change
    profileInput.addEventListener('change', (e) => {
        let file = e.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Save the new profile picture
    saveProfileChange.addEventListener('click', () => {
        let file = profileInput.files[0];
        if (!file) {
            alert("Please select an image first.");
            return;
        }
        if (!file.type.startsWith("image/")) {
            alert("Only image files are allowed!");
            return;
        }

        let formData = new FormData();
        formData.append("profile", file);

        fetch("/Entrepreneurial-Network-web-development/Backend/profile_upload.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Upload Response:", data); // Debugging
            if (data.success) {
                mainProfileImg.src = data.filepath; // Update profile image on UI
                alert("Profile Photo updated successfully!");
                closePopupP();
            } else {
                alert("Upload failed: " + data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    });



    // Fetch updated user data
    fetch("/Entrepreneurial-Network-web-development/Backend/me.php", { cache: "no-store" })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Server Error: ", data.error);
            } else {
                document.getElementById('Username').textContent = data.username;
                let urlFriendlyUsername = data.username.replace(/\s+/g, '-').toLowerCase();
                document.getElementById('userLink').textContent = `www.founderforge.com/in/${urlFriendlyUsername}`;
                document.getElementById('college').textContent = data.college && data.college.trim() !== ""
                    ? data.college
                    : "College/University is not Selected yet.";
                document.getElementById("Headline").textContent = data.headline && data.headline.trim() !== ""  
                    ? data.headline
                    : "Hi guys! I am new to FounderForge";
                document.getElementById('location').textContent = (data.location && data.city) && (data.location.trim() !== "" && data.city.trim() !== "")
                    ? data.city + ", " + data.location
                    : "Country";
                document.getElementById('about').textContent = data.about && data.about.trim() !== ""
                    ? data.about
                    : "Aspiring to explore opportunities and connecting with like-minded professionals on FounderForge. Interested in innovation, business development, and building meaningful connections in the entrepreneurial ecosystem.";
                document.getElementById('banner_img').src = data.back_cover_picture && data.back_cover_picture !== ""
                    ? data.back_cover_picture
                    : "../../images/banner.png";
                    document.getElementById('bannerPreview').src = data.back_cover_picture && data.back_cover_picture !== ""
                    ? data.back_cover_picture
                    : "../../images/banner.png";
                document.getElementById('profile_img').src = data.profile_picture && data.profile_picture.trim() !== "" 
                    ? data.profile_picture 
                    : "../../images/profile.png";
                document.getElementById('profilePreview').src = data.profile_picture && data.profile_picture.trim() !== "" 
                    ? data.profile_picture 
                    : "../../images/profile.png";
            }
        })
        .catch(error => console.error("Fetch Error: ", error));
});
