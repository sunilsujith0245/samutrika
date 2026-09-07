const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbx3d3ylCmhxlBcc0FukppJRQ2_C1rxJRTBiSSjy4p6NVQk6CcttlMtBe3wuFOGopOg-GQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("qualificationForm");
  const steps = document.querySelectorAll(".form-step");
  const nextButtons = document.querySelectorAll(".next-btn");
  const prevButtons = document.querySelectorAll(".prev-btn");
  const progressBar = document.getElementById("progressBar");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const successScreen = document.getElementById("successScreen");

  if (!form) {
    console.error('Form with id="qualificationForm" not found.');
    return;
  }

  let currentStep = 0;

  // Show current step
  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === stepIndex);
    });

    if (progressBar && steps.length > 0) {
      const progress = ((stepIndex + 1) / steps.length) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }

  // Validate current step
  function validateStep(stepIndex) {
    const currentStepElement = steps[stepIndex];

    if (!currentStepElement) {
      return false;
    }

    const requiredInputs = currentStepElement.querySelectorAll(
      'input[type="text"][required], input[type="email"][required], input[type="tel"][required]'
    );

    for (const input of requiredInputs) {
      if (!input.value.trim()) {
        input.focus();
        alert("Please complete all required fields.");
        return false;
      }

      if (input.type === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(input.value.trim())) {
          input.focus();
          alert("Please enter a valid email address.");
          return false;
        }
      }
    }

    // Validate radio buttons
    const radioGroups = {};

    currentStepElement
      .querySelectorAll('input[type="radio"][required]')
      .forEach((radio) => {
        radioGroups[radio.name] = true;
      });

    for (const groupName of Object.keys(radioGroups)) {
      const checked = currentStepElement.querySelector(
        `input[name="${groupName}"]:checked`
      );

      if (!checked) {
        alert("Please select an option before continuing.");
        return false;
      }
    }

    return true;
  }

  // NEXT buttons
  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!validateStep(currentStep)) {
        return;
      }

      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  });

  // PREVIOUS buttons
  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  });

  // FORM SUBMISSION
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    const submitButton = form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (loadingOverlay) {
      loadingOverlay.style.display = "flex";
    }

    // Get form data
    const formData = new FormData(form);

    const data = {
      name: formData.get("name") || "",
      phone: formData.get("phone") || "",
      email: formData.get("email") || "",
      location: formData.get("location") || "",
      profession: formData.get("profession") || "",
      experience: formData.get("experience") || "",
      goal: formData.get("goal") || "",
      coursePriority: formData.get("coursePriority") || "",
      learningTime: formData.get("learningTime") || "",
      learningFormat: formData.get("learningFormat") || "",
      branch: formData.get("branch") || "",
      startTime: formData.get("startTime") || "",
    };

    // Create hidden iframe
    const iframe = document.createElement("iframe");
    iframe.name = "google_sheet_iframe";
    iframe.style.display = "none";

    document.body.appendChild(iframe);

    // Create hidden form
    const submitForm = document.createElement("form");

    submitForm.method = "POST";
    submitForm.action = GOOGLE_SHEET_URL;
    submitForm.target = "google_sheet_iframe";
    submitForm.style.display = "none";

    // Add all data as hidden inputs
    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement("input");

      input.type = "hidden";
      input.name = key;
      input.value = value;

      submitForm.appendChild(input);
    });

    document.body.appendChild(submitForm);

    // Submit to Google Apps Script
    submitForm.submit();

    // Give Google Apps Script time to save
    setTimeout(() => {
      if (loadingOverlay) {
        loadingOverlay.style.display = "none";
      }

   fbq('track', 'Lead', {}, {eventID: 'TEST3363'});
      
      form.style.display = "none";

      if (successScreen) {
        successScreen.style.display = "block";
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      form.reset();

      // Remove temporary elements
      submitForm.remove();
      iframe.remove();

      if (submitButton) {
        submitButton.disabled = false;
      }
    }, 2000);
  });

  // Start on first step
  showStep(currentStep);
});
