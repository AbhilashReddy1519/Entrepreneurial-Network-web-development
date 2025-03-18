document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const addSkillsPopup = document.getElementById("addSkillsPopup");
    const editSkillsPopup = document.getElementById("editSkillsPopup");
    const skillBtn = document.getElementById("skillBtn");
    const closeSkills = document.getElementById("closeSkills");
    const cancelSkills = document.getElementById("cancelSkills");
    const closeEditSkills = document.getElementById("closeEditSkills");
    const closeEditSkillsBtn = document.getElementById("closeEditSkillsBtn");
    const skillSearch = document.getElementById("skillSearch");
    const selectedSkills = document.getElementById("selectedSkills");
    const skillCount = document.getElementById("skillCount");
    const skillsForm = document.getElementById("skillsForm");
    const skillsContainer = document.getElementById("skillsContainer");

    let selectedSkillsArray = [];

    // Load existing skills
    function loadSkills() {
        fetch("/Entrepreneurial-Network-web-development/Backend/get_skills.php")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    skillsContainer.innerHTML = '';
                    data.skills.forEach(skill => {
                        const skillElement = document.createElement('div');
                        skillElement.className = 'p-3 border rounded-lg flex items-center gap-2';
                        skillElement.innerHTML = `
                            <div class="bg-blue-100 w-2 h-2 rounded-full"></div>
                            <span class="text-gray-800">${skill}</span>
                        `;
                        skillsContainer.appendChild(skillElement);
                    });
                }
            })
            .catch(error => console.error('Error loading skills:', error));
    }

    // Event Listeners
    skillBtn.addEventListener("click", () => {
        addSkillsPopup.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    });

    function closePopups() {
        addSkillsPopup.classList.add("hidden");
        editSkillsPopup.classList.add("hidden");
        document.body.style.overflow = "";
        selectedSkillsArray = [];
        updateSelectedSkills();
    }

    [closeSkills, cancelSkills, closeEditSkills, closeEditSkillsBtn].forEach(btn => {
        btn.addEventListener("click", closePopups);
    });

    // Handle skill selection
    document.querySelectorAll('input[name="skills"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (selectedSkillsArray.length >= 20) {
                    e.target.checked = false;
                    alert('You can select up to 20 skills only');
                    return;
                }
                selectedSkillsArray.push(e.target.value);
            } else {
                selectedSkillsArray = selectedSkillsArray.filter(skill => skill !== e.target.value);
            }
            updateSelectedSkills();
        });
    });

    // Update selected skills display
    function updateSelectedSkills() {
        selectedSkills.innerHTML = '';
        skillCount.textContent = `${selectedSkillsArray.length}/20 selected`;

        selectedSkillsArray.forEach(skill => {
            const skillTag = document.createElement('div');
            skillTag.className = 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2';
            skillTag.innerHTML = `
                <span>${skill}</span>
                <button type="button" class="remove-skill text-blue-600 hover:text-blue-800">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            selectedSkills.appendChild(skillTag);
        });
    }

    // Handle skill removal
    selectedSkills.addEventListener('click', (e) => {
        if (e.target.closest('.remove-skill')) {
            const skillTag = e.target.closest('.bg-blue-100');
            const skill = skillTag.querySelector('span').textContent;
            selectedSkillsArray = selectedSkillsArray.filter(s => s !== skill);
            updateSelectedSkills();
            
            // Uncheck corresponding checkbox if exists
            const checkbox = document.querySelector(`input[value="${skill}"]`);
            if (checkbox) checkbox.checked = false;
        }
    });

    // Delete skill
    skillsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.delete-skill')) {
            const skillName = e.target.closest('.delete-skill').dataset.id;
            if (confirm('Are you sure you want to delete this skill?')) {
                const formData = new FormData();
                formData.append('skill_name', skillName);

                fetch('/Entrepreneurial-Network-web-development/Backend/delete_skill.php', {
                    method: 'POST',
                    body: formData
                })
                .then(async response => {
                    const text = await response.text();
                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        console.error('Server response:', text);
                        throw new Error('Invalid server response');
                    }
                })
                .then(data => {
                    if (data.success) {
                        loadSkills();
                        alert('Skill deleted successfully!');
                    } else {
                        throw new Error(data.error || 'Failed to delete skill');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to delete skill: ' + error.message);
                });
            }
        }
    });

    // Edit button functionality
    document.querySelector('button[title="take quiz"]').addEventListener("click", () => {
        editSkillsPopup.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        loadExistingSkillsForEdit();
    });

    function loadExistingSkillsForEdit() {
        fetch("/Entrepreneurial-Network-web-development/Backend/get_skills.php")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const skillsList = document.getElementById('skillsList');
                    skillsList.innerHTML = '';
                    
                    // Create input field for new skills
                    const newSkillDiv = document.createElement('div');
                    newSkillDiv.className = 'mb-6';
                    newSkillDiv.innerHTML = `
                        <div class="relative">
                            <input type="text" id="newSkill" 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Add a new skill">
                            <button id="addNewSkill" class="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    `;
                    skillsList.appendChild(newSkillDiv);

                    // Display existing skills
                    data.skills.forEach(skill => {
                        const skillElement = document.createElement('div');
                        skillElement.className = 'p-4 border rounded-lg hover:bg-gray-50 transition-colors mb-2';
                        skillElement.innerHTML = `
                            <div class="flex justify-between items-center">
                                <div>
                                    <h3 class="font-medium text-gray-800">${skill}</h3>
                                    <p class="text-sm text-gray-500">Added to your profile</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer" checked>
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                                peer-focus:ring-blue-300 rounded-full peer 
                                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                                after:bg-white after:border-gray-300 after:border after:rounded-full 
                                                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                    </div>
                                </label>
                            </div>
                        `;
                        skillsList.appendChild(skillElement);
                    });

                    // Add new skill functionality
                    document.getElementById('addNewSkill').addEventListener('click', addNewSkill);
                    document.getElementById('newSkill').addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            addNewSkill();
                        }
                    });
                }
            })
            .catch(error => console.error('Error loading skills for edit:', error));
    }

    function addNewSkill() {
        const newSkillInput = document.getElementById('newSkill');
        const skillName = newSkillInput.value.trim();
        
        if (skillName) {
            const formData = new FormData();
            formData.append('skill_name', skillName);

            fetch('/Entrepreneurial-Network-web-development/Backend/add_skill.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    newSkillInput.value = '';
                    loadExistingSkillsForEdit();
                    loadSkills();
                } else {
                    alert(data.error || 'Failed to add skill');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to add skill');
            });
        }
    }

    // Initialize
    loadSkills();
});