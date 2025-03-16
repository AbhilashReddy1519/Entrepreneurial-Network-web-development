document.addEventListener('DOMContentLoaded', () => {
    let openToWorkPopup = document.getElementById('openToWorkPopup');
    let openToWorkBtn = document.getElementById('opentowork'); // Edit button
    let closeOpenToWork = document.getElementById('closeOpenToWork');
    let cancelOpenToWork = document.getElementById('cancelOpenToWork');
    let openToWorkForm = document.getElementById('openToWorkForm');
    let selectedProfessionsContainer = document.getElementById('selectedProfessions');
    let customProfessionInput = document.getElementById('customProfession');
    let addCustomProfessionBtn = document.getElementById('addCustomProfession');
    let professionCheckboxes = document.querySelectorAll('input[name="professions"]');
    let professionCount = document.getElementById('professionCount'); // Counter
    let profileProfessions = document.getElementById('profileProfessions'); // Profile section
    let maxProfessions = 5;
    let selectedProfessions = [];

    // Fetch Professions on Page Load
    function loadProfileProfessions() {
        fetch("/Entrepreneurial-Network-web-development/Backend/get_open_to_work.php")
            .then(response => response.json())
            .then(data => {
                if (data.success && data.professions.length > 0) {
                    selectedProfessions = data.professions;
                    profileProfessions.innerHTML = selectedProfessions
                        .map(p => `<span class="bg-blue-200 text-blue-700 px-2 py-1 mx-1 my-1 rounded-full text-sm">${p}</span>`)
                        .join(" ");
                } else {
                    profileProfessions.textContent = "No professions selected yet.";
                }
            })
            .catch(error => console.error("Fetch Error:", error));
    }

    // Open Popup
    openToWorkBtn.addEventListener('click', () => {
        openToWorkPopup.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Fetch user-selected professions from server
        fetch("/Entrepreneurial-Network-web-development/Backend/get_open_to_work.php")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    selectedProfessions = data.professions;
                    updateSelectedProfessions();
                }
            })
            .catch(error => console.error("Fetch Error:", error));
    });

    // Close Popup
    let closePopup = () => {
        openToWorkPopup.classList.add('hidden');
        document.body.style.overflow = '';
    };

    closeOpenToWork.addEventListener('click', closePopup);
    cancelOpenToWork.addEventListener('click', closePopup);

    // Function to Update Displayed Selected Professions
    function updateSelectedProfessions() {
        selectedProfessionsContainer.innerHTML = "";
        professionCount.textContent = `${selectedProfessions.length}/5 selected`;

        selectedProfessions.forEach(profession => {
            let badge = document.createElement("span");
            badge.className = "px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center space-x-2";
            badge.innerHTML = `${profession} <button class="ml-2 text-red-500 hover:text-red-700 remove-profession" data-profession="${profession}">&times;</button>`;
            selectedProfessionsContainer.appendChild(badge);
        });

        // Remove Profession Event
        document.querySelectorAll(".remove-profession").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let professionToRemove = e.target.getAttribute("data-profession");
                selectedProfessions = selectedProfessions.filter(prof => prof !== professionToRemove);
                updateSelectedProfessions();
            });
        });

        // Disable checkboxes if max is reached
        professionCheckboxes.forEach(checkbox => {
            checkbox.disabled = selectedProfessions.length >= maxProfessions && !selectedProfessions.includes(checkbox.value);
            checkbox.checked = selectedProfessions.includes(checkbox.value);
        });
    }

    // Handle Profession Selection
    professionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                if (selectedProfessions.length < maxProfessions) {
                    selectedProfessions.push(checkbox.value);
                } else {
                    checkbox.checked = false;
                }
            } else {
                selectedProfessions = selectedProfessions.filter(prof => prof !== checkbox.value);
            }
            updateSelectedProfessions();
        });
    });

    // Handle Custom Profession Addition
    addCustomProfessionBtn.addEventListener("click", () => {
        let customProfession = customProfessionInput.value.trim();
        if (customProfession && selectedProfessions.length < maxProfessions) {
            selectedProfessions.push(customProfession);
            customProfessionInput.value = "";
            updateSelectedProfessions();
        }
    });

    // Handle Form Submission
    openToWorkForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("professions", JSON.stringify(selectedProfessions));

        fetch("/Entrepreneurial-Network-web-development/Backend/save_open_to_work.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Open to Work updated successfully!");
                loadProfileProfessions();
                closePopup();
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch(error => console.error("Fetch Error:", error));
    });

    // Load professions on page load
    loadProfileProfessions();
});
