let form = document.getElementById("signupForm");
let inputs = form.querySelectorAll("input");
let ageCheckBox = document.getElementById("ageCheck");
let ageError = document.getElementById("ageError");

const nonCheckboxInputs = Array.from(inputs).filter(
  (input) => input !== ageCheckBox,
);

// Validate input fields on blur (when user leaves input)
nonCheckboxInputs.forEach((input) => {
  input.addEventListener("blur", () => {
    validateInput(input);
  });
});

// Validate form on submit
form.addEventListener("submit", (e) => {
  let isValid = true;

  nonCheckboxInputs.forEach((input) => {
    if (!validateInput(input)) {
      isValid = false;
    }
  });

  if (!validateCheckBox()) {
    isValid = false;
  }

  if (!isValid) {
    e.preventDefault();
  }
});

ageCheckBox.addEventListener("change", () => {
  validateCheckBox();
});

function validateInput(input) {
  let errorSpan = input.closest("div").querySelector(".error-message");
  let isValid = true;
  if (input.name === "password") {
    isValid = validatePassword(input);
  } else if (!input.value.trim()) {
    let fieldName = input.name.charAt(0).toUpperCase() + input.name.slice(1);
    errorSpan.textContent = `${fieldName} is required!`;
    input.classList.add('border-red-500');
    isValid = false;
  } else {
    errorSpan.textContent = "";
    input.classList.remove("border-red-500");
  }

  return isValid;
}

function validatePassword(input) {
  const passError = document.getElementById("error-pass");
  const password = input.value.trim();
  const minLength = 10;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?!]/;

  let errors = [];

  if (password.length < minLength) {
    errors.push("At least 10 characters");
  }
  if (!uppercaseRegex.test(password)) {
    errors.push("One uppercase letter");
  }
  if (!lowercaseRegex.test(password)) {
    errors.push("One lowercase letter");
  }
  if (!numberRegex.test(password)) {
    errors.push("One number");
  }
  if (!specialCharRegex.test(password)) {
    errors.push("One special character (@#$%^&*)");
  }

  if (errors.length > 0) {
    passError.textContent = "Password must contain: " + errors.join(", ");
    input.classList.add("border-red-500");
    return false;
  } else {
    passError.textContent = "";
    input.classList.remove("border-red-500");
    return true;
  }
}

function validateCheckBox() {
  if (!ageCheckBox.checked) {
    ageError.textContent = "You must confirm that you are 18 or older.";
    ageCheckBox.classList.add("border-red-500");
    return false;
  } else {
    ageError.textContent = "";
    ageCheckBox.classList.remove("border-red-500");
    return true;
  }
}

// Password Toggle Visibility
let passwordType = document.getElementById("password");
let togglePassword = document.getElementById("togglePassword");
let eyeIcon = document.getElementById("eyeIcon");

togglePassword.addEventListener("click", () => {
  if (passwordType.type === "password") {
    passwordType.type = "text";
    eyeIcon.src = "/images/eyeopen.png";
    eyeIcon.alt = "Hide Password";
  } else {
    passwordType.type = "password";
    eyeIcon.src = "/images/eyeslash.png";
    eyeIcon.alt = "Show Password";
  }
});
