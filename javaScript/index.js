let signBtns = document.querySelectorAll('.signBtn');

signBtns.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent redirecting
        alert("Feature Coming Soon!");
    });
});

let signBtn1 = document.querySelectorAll('.signBtn1');

signBtn1.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = './login.html';
    })
})