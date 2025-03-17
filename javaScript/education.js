document.addEventListener("DOMContentLoaded", () => {
    let addEducationPopup = document.getElementById("addEducationPopup");
    let editEducationPopup = document.getElementById("editEducationPopup");
    let addEducationBtn = document.getElementById("addEducationBtn");
    let closeEducation = document.getElementById("closeEducation");
    let closeEditEducation = document.getElementById("closeEditEducation");
    let cancelEducation = document.getElementById("cancelEducation");
    let cancelEditEducation = document.getElementById("cancelEditEducation");
    let deleteEducationBtn = document.getElementById("deleteEducationBtn");
    let educationForm = document.getElementById("educationForm");
    let editEducationForm = document.getElementById("editEducationForm");
    let educationList = document.getElementById("educationList");
    let noEducationMessage = document.getElementById("noEducationMessage");
    let editEducationId = document.getElementById("editEducationId");

    let editingId = null; // Track the education being edited

    // Populate year dropdowns
    function populateYears() {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
        const futureYears = Array.from({ length: 7 }, (_, i) => currentYear + i + 1);

        document.querySelectorAll("#startYear, #editStartYear").forEach(select => {
            select.innerHTML = '<option value="">Select Year</option>';
            years.forEach(year => select.add(new Option(year, year)));
        });

        document.querySelectorAll("#endYear, #editEndYear").forEach(select => {
            select.innerHTML = '<option value="">Select Year</option>';
            [...years, ...futureYears].forEach(year => select.add(new Option(year, year)));
        });
    }
    populateYears();

    // Open Add Education Popup
    addEducationBtn.addEventListener("click", () => {
        addEducationPopup.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    });

    // Close Popups
    function closePopup() {
        addEducationPopup.classList.add("hidden");
        editEducationPopup.classList.add("hidden");
        document.body.style.overflow = "";
        educationForm.reset();
        editEducationForm.reset();
        editingId = null;
    }
    [closeEducation, closeEditEducation, cancelEducation, cancelEditEducation].forEach(btn => {
        btn.addEventListener("click", closePopup);
    });

    // Fetch and Display Education
    function loadEducation() {
        fetch("/Entrepreneurial-Network-web-development/Backend/get_education.php")
            .then(response => response.json())
            .then(data => {
                educationList.innerHTML = "";

                if (data.length > 0) {
                    noEducationMessage.classList.add("hidden");
                    educationList.classList.remove("hidden");

                    data.forEach(edu => {
                        let educationItem = document.createElement("div");
                        educationItem.className = "bg-white border-b p-4 hover:bg-gray-50 transition-colors";

                        educationItem.innerHTML = `
                            <div class="flex justify-between items-start">
                                <div class="space-y-1">
                                    <h3 class="text-lg font-semibold text-gray-900">${edu.institution}</h3>
                                    <p class="text-gray-600">${edu.degree} • ${edu.field_of_study}</p>
                                    <p class="text-sm text-gray-500">Grade: ${edu.grade}</p>
                                    <p class="text-sm text-gray-500">${edu.start_year} - ${edu.end_year}</p>
                                </div>
                                <button class="editEducationBtn p-2 hover:bg-gray-100 rounded-full transition-colors" 
                                        data-id="${edu.id}" title="Edit education">
                                    <i class="fa-solid fa-pencil text-gray-600"></i>
                                </button>
                            </div>
                        `;

                        educationList.appendChild(educationItem);
                    });

                    // Attach event listeners for Edit buttons
                    document.querySelectorAll(".editEducationBtn").forEach(btn => {
                        btn.addEventListener("click", () => openEditEducationPopup(btn.dataset.id));
                    });
                } else {
                    noEducationMessage.classList.remove("hidden");
                    educationList.classList.add("hidden");
                }
            })
            .catch(error => console.error("Fetch Error:", error));
    }
    loadEducation();

    // Add Education
    document.getElementById("educationForm").addEventListener("submit", function (e) {
        e.preventDefault();
    
        let formData = new FormData();
        formData.append("institution", document.getElementById("institution").value.trim());
        formData.append("degree", document.getElementById("degree").value.trim());
        formData.append("fieldOfStudy", document.getElementById("fieldOfStudy").value.trim());
        formData.append("grade", document.getElementById("grade").value.trim());
        formData.append("startYear", document.getElementById("startYear").value.trim());
        formData.append("endYear", document.getElementById("endYear").value.trim());
    
        fetch("/Entrepreneurial-Network-web-development/Backend/save_education.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Education added successfully!");
                location.reload(); // Refresh page to reflect changes
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch(error => console.error("Fetch Error:", error));
    });
    

    // Open Edit Education Popup
    function openEditEducationPopup(id) {
        editingId = id;

        fetch(`/Entrepreneurial-Network-web-development/Backend/get_single_education.php?id=${id}`)
            .then(response => response.json())
            .then(data => {
                editEducationId.value = data.id;
                document.getElementById("editInstitution").value = data.institution;
                document.getElementById("editDegree").value = data.degree;
                document.getElementById("editFieldOfStudy").value = data.field_of_study;
                document.getElementById("editGrade").value = data.grade;
                document.getElementById("editStartYear").value = data.start_year;
                document.getElementById("editEndYear").value = data.end_year;

                editEducationPopup.classList.remove("hidden");
                document.body.style.overflow = "hidden";
            })
            .catch(error => console.error("Fetch Error:", error));
    }

    // Edit Education
    editEducationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let formData = new FormData(editEducationForm);
        formData.append("id", editingId);

        fetch("/Entrepreneurial-Network-web-development/Backend/update_education.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closePopup();
                loadEducation();
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch(error => console.error("Fetch Error:", error));
    });

    // Delete Education
    deleteEducationBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this education record?")) {
            fetch(`/Entrepreneurial-Network-web-development/Backend/delete_education.php?id=${editingId}`, {
                method: "DELETE"
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    closePopup();
                    loadEducation();
                } else {
                    alert("Error: " + data.error);
                }
            })
            .catch(error => console.error("Fetch Error:", error));
        }
    });
});
