"use strict";

const form = document.getElementById("form");

const emailInput = document.getElementById("email");
const errorMessage = document.getElementById("email-error");
const imgMobile = document.getElementById("mobile-img-ill");
const mainContainer = document.getElementById("main-container");
const successPopup = document.getElementById("success-popup");
const dismissBtn = document.getElementById("dismiss-btn");
const emailConfirmed = document.getElementById("email-confirmed");
const popupContent = document.getElementById("popup-content");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Functions
const validateEmail = function (email) {
  return EMAIL_REGEX.test(email);
};

// Show error text message
const showError = function () {
  // If empty
  if (emailInput.validity.valueMissing) {
    errorMessage.textContent = "You need to enter an email address.";
  } else if (!validateEmail(emailInput.value)) {
    // If it's not an email address
    errorMessage.textContent = "Valid email required";
    emailInput.setAttribute("aria-invalid", "true");
  }
  errorMessage.classList.remove("sr-only");
  emailInput.classList.add("input-style--error");
};

// Focus trap utility with proper cleanup
const createFocusTrap = function (element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    console.warn("No focusable elements found in", element);
    return null;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1]; //in the success popup we only have one element so basically first and last element is the same

  const handleKeyDown = function (e) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      // Going backwards
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      // Going forwards
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener("keydown", handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener("keydown", handleKeyDown);
  };
};

let removeFocusTrap = null;

// Show pop-up function
const showSuccessPopup = function () {
  imgMobile.classList.add("hidden");
  mainContainer.classList.remove("flex", "flex-col");
  mainContainer.classList.add("hidden");
  errorMessage.classList.add("sr-only"); // Hide visually but keep accessible
  emailInput.classList.remove("input-style--error");

  // show success pop-up
  successPopup.classList.remove("hidden");
  successPopup.setAttribute("aria-hidden", "false");
  emailInput.setAttribute("aria-invalid", "false");
  emailConfirmed.textContent = emailInput.value; //add the email from the input into the pop-up text

  // Focus first focusable element
  const focusableElements = successPopup.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements[0]) {
    focusableElements[0].focus();
  }

  //Setup focus trap
  removeFocusTrap = createFocusTrap(successPopup);

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

  // Remove focus trap
  if (removeFocusTrap) {
    removeFocusTrap();
    removeFocusTrap = null;
  }

  // Return focus to email input
  emailInput.focus();
};

// Event listeners
// Remove red background and error text when re-writing input
emailInput.addEventListener("input", function () {
  // if input is empty but containes error message and bg
  if (
    emailInput.validity.valueMissing &&
    emailInput.classList.contains("input-style--error")
  ) {
    emailInput.classList.remove("input-style--error");
    errorMessage.textContent = "";
  }
});

// Submiting the form when press the button
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // if the email field is invalid
  if (!emailInput.validity.valid) {
    showError();
  } else {
    showSuccessPopup();
  }
});

// close success pop-up when pressing dismiss button
dismissBtn.addEventListener("click", hideSuccessPopup);

// Stop clicks inside popup from bubbling up and closing it accidentally
popupContent.addEventListener("click", function (e) {
  e.stopPropagation();
});

// close sucess pop-up when clicking outside but not inside the pop-up content
document.addEventListener("click", function (e) {
  // Check if popup is not hidden
  if (!successPopup.classList.contains("hidden")) {
    // hide if click is outside popup content
    if (popupContent && !popupContent.contains(e.target)) {
      hideSuccessPopup();
    }
  }
});

// close sucess pop-up when pressing ESC key
document.addEventListener("keydown", function (e) {
  if (!successPopup.classList.contains("hidden")) {
    if (e.key === "Escape") {
      hideSuccessPopup();
    }
  }
});
