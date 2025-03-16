document.addEventListener('DOMContentLoaded', () => {
    let aboutPopup = document.getElementById('editAboutPopup'); // Popup
    let openAboutPopup = document.getElementById('editAboutBtn'); // Button to open
    let closeAboutPopup = document.getElementById('closeAboutPopup'); // Close button
    let cancelAboutEdit = document.getElementById('cancelAboutEdit'); // Cancel button
    let aboutForm = document.getElementById('aboutForm'); // Form
    let editAbout = document.getElementById('editAbout'); // Textarea
    let aboutSection = document.getElementById('about'); // Where about is displayed
    let charCount = document.getElementById('charCount'); // Character counter

    const MAX_CHAR = 2000;

    // Update Character Counter Dynamically
    editAbout.addEventListener('input', () => {
        let length = editAbout.value.length;
        charCount.textContent = `${length} / ${MAX_CHAR} characters`;

        // Change text color if near limit
        if (length >= 1800) {
            charCount.classList.add('text-red-500');
        } else {
            charCount.classList.remove('text-red-500');
        }

        // Prevent input beyond max characters
        if (length > MAX_CHAR) {
            editAbout.value = editAbout.value.substring(0, MAX_CHAR);
        }
    });

    // Open Popup and Load Data
    openAboutPopup.addEventListener('click', () => {
        aboutPopup.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        // Fetch current data from `me.php`
        fetch("/Entrepreneurial-Network-web-development/Backend/me.php")
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error("Server Error:", data.error);
                } else {
                    editAbout.value = data.about || "Aspiring to explore opportunities and connecting with like-minded professionals on FounderForge. Interested in innovation, business development, and building meaningful connections in the entrepreneurial ecosystem";
                    charCount.textContent = `${editAbout.value.length} / ${MAX_CHAR} characters`;
                }
            })
            .catch(error => console.error("Fetch Error:", error));
    });

    // Close Popup Function
    let closePopup = () => {
        aboutPopup.classList.add('hidden');
        document.body.style.overflow = '';
    };

    // Close on outside click 
    aboutPopup.addEventListener('click', (e) => {
        if (e.target === aboutPopup) {
            closePopup();
        }
    });

    closeAboutPopup.addEventListener('click', closePopup);
    cancelAboutEdit.addEventListener('click', closePopup);

    // Handle Form Submission
    aboutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("editAbout", editAbout.value.trim());

        fetch("/Entrepreneurial-Network-web-development/Backend/update_about.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("About section updated successfully!");
                aboutSection.textContent = editAbout.value; // Update UI
                closePopup(); // Close popup
            } else {
                alert("Error updating about section: " + data.error);
            }
        })
        .catch(error => console.error("Fetch Error:", error));
    });
});
