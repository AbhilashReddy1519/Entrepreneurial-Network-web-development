document.addEventListener('DOMContentLoaded', () => {
    let editProfileBtn = document.getElementById('editProfileBtn'); // Button to open popup
    let editProfilePopup = document.getElementById('editProfileInfo'); // Popup
    let closeEditProfile = document.getElementById('closeEditProfile'); // Close button
    let cancelEditProfile = document.getElementById('cancelEditProfile'); // Cancel button
    let profileForm = document.getElementById('profileInfoForm'); // Form

    // Open popup when clicking "Edit Profile" button
    editProfileBtn.addEventListener('click', () => {
        editProfilePopup.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    // Close popup function
    let closePopup = () => {
        editProfilePopup.classList.add('hidden');
        document.body.style.overflow = '';
    };

    // Close on outside click 
    editProfilePopup.addEventListener('click', (e) => {
        if (e.target === editProfilePopup) {
            closePopup();
        }
    });

    closeEditProfile.addEventListener('click', closePopup);
    cancelEditProfile.addEventListener('click', closePopup);

    // Fetch existing data from me.php and prefill inputs
    fetch("/Entrepreneurial-Network-web-development/Backend/me.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Server Error:", data.error);
            } else {
                document.getElementById('editUsername').value = data.username || "";
                document.getElementById('editCollege').value = data.college || "";
                document.getElementById('editHeadline').value = data.headline || "Hi guys! I am new to FounderForge";
                document.getElementById('editCity').value = data.city || "Your city";
                document.getElementById('editLocation').value = data.location || "Your country";
            }
        })
        .catch(error => console.error("Fetch Error:", error));

    // Handle profile update submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("editUsername", document.getElementById('editUsername').value);
        formData.append("editCollege", document.getElementById('editCollege').value);
        formData.append("editHeadline", document.getElementById('editHeadline').value);
        formData.append("editCity", document.getElementById('editCity').value);
        formData.append("editLocation", document.getElementById('editLocation').value);

        fetch("/Entrepreneurial-Network-web-development/Backend/update_profile.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text()) // Read response as text first
        .then(text => {
            try {
                let data = JSON.parse(text); // Convert to JSON
                if (data.success) {
                    alert("Profile updated successfully!");
                    location.reload(); // Refresh page
                } else {
                    alert("Error updating profile: " + data.error);
                }
            } catch (error) {
                console.error("JSON Parse Error:", error, "Raw Response:", text);
                alert("Unexpected error. Check console for details.");
            }
        })
        .catch(error => console.error("Fetch Error:", error));
    });
});
