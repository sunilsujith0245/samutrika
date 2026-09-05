document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("qualificationForm");

    const steps = document.querySelectorAll(".form-step");

    const progressBar = document.getElementById("progressBar");

    const stepLabel = document.getElementById("stepLabel");

    const progressPercent = document.getElementById("progressPercent");

    const successScreen = document.getElementById("successScreen");

    const loadingOverlay = document.getElementById("loadingOverlay");

    let currentStep = 1;

    const totalSteps = steps.length;


    /* =====================================================
       SHOW STEP
    ===================================================== */

    function showStep(stepNumber) {

        steps.forEach(function (step) {

            step.classList.remove("active");

            if (Number(step.dataset.step) === stepNumber) {
                step.classList.add("active");
            }

        });


        const percentage =
            Math.round((stepNumber / totalSteps) * 100);


        progressBar.style.width = percentage + "%";

        stepLabel.textContent =
            "Step " + stepNumber + " of " + totalSteps;

        progressPercent.textContent =
            percentage + "%";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       VALIDATE CURRENT STEP
    ===================================================== */

    function validateStep(stepNumber) {

        const currentSection =
            document.querySelector(
                '.form-step[data-step="' + stepNumber + '"]'
            );


        let isValid = true;


        /* -----------------------------------------------
           TEXT / EMAIL / TEL INPUTS
        ------------------------------------------------ */

        const requiredInputs =
            currentSection.querySelectorAll(
                "input[required]:not([type='radio']):not([type='checkbox'])"
            );


        requiredInputs.forEach(function (input) {

            const error =
                input.parentElement.querySelector(".error-message");


            input.classList.remove("input-error");


            if (!input.value.trim()) {

                isValid = false;

                input.classList.add("input-error");

                if (error) {
                    error.textContent =
                        "Please enter your " +
                        inputLabel(input);
                }

            } else {

                if (
                    input.type === "email" &&
                    !isValidEmail(input.value.trim())
                ) {

                    isValid = false;

                    input.classList.add("input-error");

                    if (error) {
                        error.textContent =
                            "Please enter a valid email address.";
                    }

                } else {

                    if (error) {
                        error.textContent = "";
                    }

                }

            }

        });


        /* -----------------------------------------------
           RADIO GROUPS
        ------------------------------------------------ */

        const radioGroups = {};

        const radios =
            currentSection.querySelectorAll(
                "input[type='radio'][required]"
            );


        radios.forEach(function (radio) {

            if (!radioGroups[radio.name]) {
                radioGroups[radio.name] = [];
            }

            radioGroups[radio.name].push(radio);

        });


        Object.keys(radioGroups).forEach(function (groupName) {

            const group =
                radioGroups[groupName];


            const selected =
                currentSection.querySelector(
                    'input[name="' + groupName + '"]:checked'
                );


            const firstRadio = group[0];

            const field =
                firstRadio.closest(".field");


            const error =
                field
                    ? field.querySelector(".group-error")
                    : null;


            if (!selected) {

                isValid = false;

                if (field) {
                    field.classList.add("option-error");
                }

                if (error) {
                    error.textContent =
                        "Please select an option.";
                }

            } else {

                if (field) {
                    field.classList.remove("option-error");
                }

                if (error) {
                    error.textContent = "";
                }

            }

        });


        return isValid;

    }


    /* =====================================================
       INPUT LABEL HELPER
    ===================================================== */

    function inputLabel(input) {

        const label =
            input.parentElement.querySelector("label");


        if (!label) {
            return "this field.";
        }


        return label.textContent
            .replace("*", "")
            .trim()
            .toLowerCase();

    }


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    /* =====================================================
       NEXT BUTTON
    ===================================================== */

    document.querySelectorAll(".next-btn")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                if (!validateStep(currentStep)) {
                    return;
                }


                if (currentStep < totalSteps) {

                    currentStep++;

                    showStep(currentStep);

                }

            });

        });


    /* =====================================================
       BACK BUTTON
    ===================================================== */

    document.querySelectorAll(".prev-btn")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                if (currentStep > 1) {

                    currentStep--;

                    showStep(currentStep);

                }

            });

        });


    /* =====================================================
       CLEAR ERRORS WHEN USER TYPES
    ===================================================== */

    form.querySelectorAll("input").forEach(function (input) {

        input.addEventListener("input", function () {

            input.classList.remove("input-error");


            const error =
                input.parentElement.querySelector(".error-message");


            if (error) {
                error.textContent = "";
            }

        });


        input.addEventListener("change", function () {

            const field =
                input.closest(".field");


            if (!field) {
                return;
            }


            field.classList.remove("option-error");


            const error =
                field.querySelector(".group-error");


            if (error) {
                error.textContent = "";
            }

        });

    });


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        if (!validateStep(currentStep)) {
            return;
        }


        /* -----------------------------------------------
           COLLECT FORM DATA
        ------------------------------------------------ */

        const formData =
            new FormData(form);


        const data = {};


        formData.forEach(function (value, key) {

            data[key] = value;

        });


        console.log("Fashion Designing Assessment:", data);


        /* -----------------------------------------------
           SHOW LOADING
        ------------------------------------------------ */

        loadingOverlay.classList.add("active");


        /*
         ==================================================
         PABBLY / WEBHOOK CONNECTION
         ==================================================

         Replace YOUR_WEBHOOK_URL with your Pabbly webhook
         URL when you are ready.

         Example:

         await fetch("YOUR_WEBHOOK_URL", {
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(data)
         });

         ==================================================
        */


        try {

            /*
             * Temporary delay for demonstration.
             * Replace this with your Pabbly webhook request.
             */

            await new Promise(function (resolve) {
                setTimeout(resolve, 1200);
            });


            loadingOverlay.classList.remove("active");


            /* Hide form */

            form.style.display = "none";


            /* Hide progress */

            document.querySelector(".progress-section")
                .style.display = "none";


            /* Show success */

            successScreen.classList.add("active");


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


        } catch (error) {

            console.error(
                "Form submission failed:",
                error
            );


            loadingOverlay.classList.remove("active");

            alert(
                "Something went wrong. Please try again."
            );

        }

    });


    /* =====================================================
       INITIALIZE
    ===================================================== */

    showStep(1);

});