let form = document.getElementById("loginForm");
let inputs = form.querySelectorAll("input");
let logged_in = document.getElementById("logged_in");

const nonCheckboxInputs = Array.from(inputs).filter(
  (input) => input !== logged_in,
);

nonCheckboxInputs.forEach((input) => {
  input.addEventListener("blur", () => {
    validateInput(input);
  });
});

form.addEventListener("submit", (e) => {
  let isValid = true;

  nonCheckboxInputs.forEach((input) => {
    if (!validateInput(input)) {
      isValid = false;
    }
  });

  if (!isValid) {
    e.preventDefault();
  }
});

function validateInput(input) {
  let isValid = true;
  let errorSpan = input.closest(".mb-6").querySelector(".error-message");

  if (!input.value.trim()) {
    let fieldName = input.name.charAt(0).toUpperCase() + input.name.slice(1);
    errorSpan.textContent = `${fieldName} is required!`;
    input.classList.add("border-red-500");
    isValid = false;
  } else {
    errorSpan.textContent = "";
    input.classList.remove("border-red-500");
  }

  return isValid;
}

let passwordType = document.getElementById("password");
let togglePassword = document.getElementById("togglePassword");
let eyeIcon = document.getElementById("eyeIcon");

togglePassword.addEventListener("click", () => {
  if (passwordType.type === "password") {
    passwordType.type = "text";
    eyeIcon.src = "../images/eyeopen.png";
    eyeIcon.alt = "Hide Password";
  } else {
    passwordType.type = "password";
    eyeIcon.src = "../images/eyeslash.png";
    eyeIcon.alt = "Show Password";
  }
});
