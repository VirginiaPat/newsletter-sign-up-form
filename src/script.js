"use strict";

const form = document.getElementById("form");
const emailInput = document.getElementById("email");
const errorMessage = document.getElementById("email-error");
const imgMobile = document.getElementById("mobile-img-ill");
const mainContainer = document.getElementById("main-container");
const successPopup = document.getElementById("success-popup");
const dismissBtn = document.getElementById("dismiss-btn");
const emailConfirmed = document.getElementById("email-confirmed");

// Functions
// Show error text message
const showError = function () {
  if (emailInput.validity.valueMissing) {
    // If empty
    errorMessage.textContent = "You need to enter an email address.";
  } else if (emailInput.validity.typeMismatch || !emailInput.validity.valid) {
    // If it's not an email address
    errorMessage.textContent = "Valid email required";
    emailInput.setAttribute("aria-invalid", "true");
  }
  errorMessage.classList.remove("sr-only");
};

// Show pop-up function
const showSuccessPopup = function () {
  imgMobile.classList.add("hidden");
  mainContainer.classList.remove("flex", "flex-col");
  mainContainer.classList.add("hidden");
  emailInput.classList.remove("input-style--error");

  // show success pop-up
  successPopup.classList.remove("hidden");
  successPopup.setAttribute("aria-hidden", "false");
  emailInput.setAttribute("aria-invalid", "false");
  emailConfirmed.textContent = emailInput.value; //add the email from the input into the pop-up text

  // Move keyboard focus to the success pop-up container
  successPopup.focus();

  // clear input field
  emailInput.value = "";
};

// Hide success pop-up
const hideSuccessPopup = function () {
  successPopup.classList.add("hidden");
  successPopup.setAttribute("aria-hidden", "true");
  imgMobile.classList.remove("hidden");
  mainContainer.classList.remove("hidden");
  mainContainer.classList.add("flex", "flex-col");
};

// Event listeners
// check input's valid
emailInput.addEventListener("input", function () {
  // if email valid
  if (emailInput.validity.valid) {
    errorMessage.classList.add("sr-only"); // Hide visually but keep accessible
    emailInput.classList.remove("input-style--error"); //remove red background when it exists
  } else {
    showError();
  }
});

// Submiting the form when press the button
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // if the email field is invalid
  if (!emailInput.validity.valid) {
    showError();
    emailInput.classList.add("input-style--error");
  }

  // if the email field is valid
  if (emailInput.validity.valid) {
    showSuccessPopup();
  }
});

// close success pop-up when pressing dismiss button
dismissBtn.addEventListener("click", function () {
  hideSuccessPopup();
});

// close sucess pop-up when clicking outside but not inseide the pop-up
document.addEventListener("click", function (e) {
  if (!successPopup.contains(e.target)) {
    hideSuccessPopup();
  }
});

// close sucess pop-up when pressing ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideSuccessPopup();
  }
});
