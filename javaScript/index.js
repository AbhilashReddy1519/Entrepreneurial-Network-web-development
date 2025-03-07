let signBtns = document.querySelectorAll('.signBtn');

document.querySelectorAll('.signBtn').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        
        let alertBox = document.getElementById("topAlert");
        alertBox.classList.remove("hidden");
        alertBox.classList.add('flex');

        // Hide after 600 milli seconds
        setTimeout(() => {
            alertBox.classList.add("hidden");
        }, 600);
    });
});

// Function to close manually
function closeAlert() {
    document.getElementById("topAlert").classList.add("hidden");
}


let signBtn1 = document.querySelectorAll('.signBtn1');

signBtn1.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = './login.html';
    })
})