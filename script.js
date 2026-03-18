const form = document.getElementById("registrationForm");

// Auto Title-Case for name fields
const nameFields = ["firstName", "middleName", "lastName"];
nameFields.forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener("input", function () {
    let start = this.selectionStart;
    let transformed = this.value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    if (this.value !== transformed) {
      this.value = transformed;
      this.setSelectionRange(start, start);
    }
  });
});

// Password strength indicator
const password = document.getElementById("password");
const strengthDiv = document.createElement("div");
strengthDiv.className = "strength-wrap";
strengthDiv.innerHTML = `
  <div class="strength-track">
    <div id="strengthBar"></div>
  </div>
  <small id="strengthText"></small>
`;
password.parentNode.insertBefore(strengthDiv, password.nextSibling);

password.addEventListener("input", function () {
  const val = this.value;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[@$!%*?&]/.test(val)) score++;

  const bar = document.getElementById("strengthBar");
  const text = document.getElementById("strengthText");
  const colors = ["#f85149", "#e3b341", "#3fb950", "#58a6ff"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (val === "") {
    bar.style.width = "0%";
    text.textContent = "";
  } else {
    bar.style.width = (score / 4 * 100) + "%";
    bar.style.backgroundColor = colors[score - 1] || colors[0];
    text.textContent = labels[score - 1] || labels[0];
    text.style.color = colors[score - 1] || colors[0];
  }
});

// Form validation
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let isValid = true;

  const firstName = document.getElementById("firstName");
  const middleName = document.getElementById("middleName");
  const lastName = document.getElementById("lastName");
  const course = document.getElementById("course");
  const gender = document.getElementsByName("gender");
  const terms = document.getElementById("terms");

  const nameRegex = /^[A-Za-z\s]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  document.querySelectorAll(".error").forEach(e => e.textContent = "");

  if (!firstName.value.trim() || !nameRegex.test(firstName.value)) {
    showError(firstName, "Only letters allowed");
    isValid = false;
  }
  if (middleName.value && !nameRegex.test(middleName.value)) {
    showError(middleName, "Only letters allowed");
    isValid = false;
  }
  if (!lastName.value.trim() || !nameRegex.test(lastName.value)) {
    showError(lastName, "Only letters allowed");
    isValid = false;
  }
  if (course.value === "") {
    showError(course, "Please select a course");
    isValid = false;
  }
  if (!passwordRegex.test(password.value)) {
    showError(password, "Min 8 chars, 1 uppercase, 1 number, 1 special char");
    isValid = false;
  }

  let genderSelected = false;
  gender.forEach(g => { if (g.checked) genderSelected = true; });
  if (!genderSelected) {
    showError(gender[0], "Please select a gender");
    isValid = false;
  }

  if (!terms.checked) {
    showError(terms, "You must accept the terms");
    isValid = false;
  }

  if (isValid) {
    alert("Registration Successful!");
    form.reset();
    document.getElementById("strengthBar").style.width = "0%";
    document.getElementById("strengthText").textContent = "";
  }
});

function showError(input, message) {
  const formGroup = input.closest(".form-group");
  formGroup.querySelector(".error").textContent = message;
}