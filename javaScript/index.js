let signBtns = document.querySelectorAll('.signBtn');

signBtns.forEach(signBtn => {
    signBtn.addEventListener('click', () => {
        window.location.href = './login.html';
    });
});