"use strict";

const form = document.getElementById("form");
const email = document.getElementById("email");
const errorMessage = document.getElementById("email-error");
const imgMobile = document.getElementById("modile-img-ill");
const mainContainer = document.getElementById("main-container");
const successPopup = document.getElementById("success-popup");
const dismissBtn = document.getElementById("dismiss-btn");
const emailConfirmed = document.getElementById("email-confirmed");

// Functions
const showError = function () {
  if (email.validity.valueMissing) {
    // If empty
    errorMessage.textContent = "You need to enter an email address.";
  } else if (email.validity.typeMismatch) {
    // If it's not an email address
    errorMessage.textContent = "Valid email required";
  }
  errorMessage.classList.remove("hidden");
};

// Event listeners
email.addEventListener("input", function (e) {
  // if email valid
  if (email.validity.valid) {
    errorMessage.classList.add("hidden"); //hide the error message
    email.classList.remove("input-style--error"); //remove red background when it exists
  } else {
    showError();
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // if the email field is invalid
  if (!email.validity.valid) {
    showError();
    email.classList.add("input-style--error");
  }

  // if the email field is valid
  if (email.validity.valid) {
    imgMobile.classList.add("hidden");
    mainContainer.classList.remove("flex,flex-col");
    mainContainer.classList.add("hidden");
    email.classList.remove("input-style--error");

    // show success pop-up
    successPopup.classList.remove("hidden");
    emailConfirmed.textContent = email.value; //add the email from the input into the text

    // clear input field
    email.value = "";
  }
});

// function for closeing success pop-up
const closeSuccessPopup = function () {
  successPopup.classList.add("hidden");
  imgMobile.classList.remove("hidden");
  mainContainer.classList.remove("hidden");
  mainContainer.classList.add("flex,flex-col");
};

// close success pop-up when pressing dismiss button
dismissBtn.addEventListener("click", function () {
  closeSuccessPopup();
});

// close sucess pop-up when clicking outside
document.addEventListener("click", function (e) {
  closeSuccessPopup();
});

// close sucess pop-up when pressing ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSuccessPopup();
  }
});
