document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const addSkillsPopup = document.getElementById("addSkillsPopup");
    const editSkillsPopup = document.getElementById("editSkillsPopup");
    const skillBtn = document.getElementById("skillBtn");
    const closeSkills = document.getElementById("closeSkills");
    const cancelSkills = document.getElementById("cancelSkills");
    const closeEditSkills = document.getElementById("closeEditSkills");
    const closeEditSkillsBtn = document.getElementById("closeEditSkillsBtn");
    // const skillSearch = document.getElementById("skillSearch");
    const selectedSkills = document.getElementById("selectedSkills");
    const skillCount = document.getElementById("skillCount");
    const skillsForm = document.getElementById("skillsForm");
    const skillsContainer = document.getElementById("skillsContainer");

    let selectedSkillsArray = [];

    const skills = [
        "Leadership", "Project Management", "Communication", "Teamwork", "Problem Solving",
        "Critical Thinking", "Time Management", "Adaptability", "Creativity", "Decision Making",
        "Negotiation", "Conflict Resolution", "Emotional Intelligence", "Networking", "Public Speaking",
        "Data Analysis", "Machine Learning", "Artificial Intelligence", "Web Development", "Frontend Development",
        "Backend Development", "Full Stack Development", "Database Management", "Cybersecurity", "Cloud Computing",
        "DevOps", "Mobile App Development", "Software Testing", "UI/UX Design", "Digital Marketing",
        "Search Engine Optimization", "Social Media Marketing", "Copywriting", "Content Writing", "Graphic Design",
        "Video Editing", "Blockchain Development", "Game Development", "Financial Analysis", "Business Strategy",
        "Software Development", "Algorithm Design", "Data Structures", "Python", "JavaScript",
        "Java", "C++", "C#", "PHP", "Ruby", "Swift", "Go", "Kotlin", "TypeScript", "Shell Scripting",
        "Networking Basics", "Linux Administration", "System Architecture", "Embedded Systems", "Internet of Things (IoT)",
        "Cloud Security", "AWS", "Google Cloud", "Microsoft Azure", "Docker", "Kubernetes", 
        "Ethical Hacking", "Penetration Testing", "Incident Response", "IT Support", "Tech Consulting",
        "Agile Methodologies", "Scrum", "Kanban", "JIRA", "Trello", "Git", "GitHub", "Bitbucket",
        "Software Documentation", "Requirement Analysis", "Wireframing", "Figma", "Adobe XD", "Canva",
        "Sales Strategies", "Marketing Analytics", "Brand Management", "E-commerce Strategies", "Customer Relationship Management",
        "Risk Management", "Statistical Analysis", "Predictive Modeling", "Natural Language Processing",
        "Deep Learning", "Computer Vision", "Robotic Process Automation", "3D Modeling", "Motion Graphics",
        "Photography", "Video Production", "Sound Editing", "Game Level Design", "Virtual Reality Development"
    ];
    
    const skillSearch = document.getElementById("skillSearch");
    const skillSuggestions = document.getElementById("skillSuggestions");

    // Function to filter and show suggestions
    skillSearch.addEventListener("input", function() {
        let searchQuery = this.value.toLowerCase();
        skillSuggestions.innerHTML = "";
        
        if (searchQuery) {
            let filteredSkills = skills.filter(skill => 
                skill.toLowerCase().includes(searchQuery) && 
                !selectedSkillsArray.includes(skill)
            );
            
            if (filteredSkills.length > 0) {
                skillSuggestions.classList.remove("hidden");
                filteredSkills.forEach(skill => {
                    let li = document.createElement("li");
                    li.textContent = skill;
                    li.classList.add("px-4", "py-2", "cursor-pointer", "hover:bg-gray-100");
                    li.addEventListener("click", function() {
                        if (selectedSkillsArray.length >= 20) {
                            alert('You can select up to 20 skills only');
                            return;
                        }
                        selectedSkillsArray.push(skill);
                        updateSelectedSkills();
                        skillSearch.value = ''; // Clear the search input
                        skillSuggestions.classList.add("hidden"); // Hide dropdown
                    });
                    skillSuggestions.appendChild(li);
                });
            } else {
                skillSuggestions.classList.add("hidden");
            }
        } else {
            skillSuggestions.classList.add("hidden");
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", function(event) {
        if (!skillSearch.contains(event.target) && !skillSuggestions.contains(event.target)) {
            skillSuggestions.classList.add("hidden");
        }
    });

    // Save skills form submission
    skillsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (selectedSkillsArray.length === 0) {
            alert('Please select at least one skill');
            return;
        }

        const formData = new FormData();
        formData.append('skills', JSON.stringify(selectedSkillsArray));

        fetch('/Entrepreneurial-Network-web-development/Backend/save_skills.php', {
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
                alert('Skills saved successfully!');
                closePopups();
                loadSkills();
            } else {
                throw new Error(data.error || 'Failed to save skills');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save skills: ' + error.message);
        });
    });

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

    // Update the loadExistingSkillsForEdit function
    function loadExistingSkillsForEdit() {
        fetch("/Entrepreneurial-Network-web-development/Backend/get_skills.php")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const skillsList = document.getElementById('skillsList');
                    skillsList.innerHTML = '';
                    
                    // Display existing skills
                    data.skills.forEach(skill => {
                        const skillElement = document.createElement('div');
                        skillElement.className = 'p-4 border rounded-lg hover:bg-gray-50 transition-colors mb-2';
                        skillElement.innerHTML = `
                            <div class="flex justify-between items-center">
                                <div class="relative w-full">
                                    <h3 class="font-medium text-gray-800">${skill}</h3>
                                    <p class="text-sm text-gray-500">Added to your profile</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <button class="delete-skill text-red-500 hover:text-red-700 transition-colors"
                                            data-skill="${skill}" title="Delete skill">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                        skillsList.appendChild(skillElement);
                    });

                    // Add event listeners for delete buttons
                    document.querySelectorAll('.delete-skill').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const skillName = this.dataset.skill;
                            if (confirm(`Are you sure you want to delete "${skillName}"?`)) {
                                deleteSkill(skillName);
                            }
                        });
                    });
                }
            })
            .catch(error => console.error('Error loading skills for edit:', error));
    }

    // Add the deleteSkill function
    function deleteSkill(skillName) {
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
                loadExistingSkillsForEdit(); // Reload the skills list
                loadSkills(); // Reload the main skills display
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