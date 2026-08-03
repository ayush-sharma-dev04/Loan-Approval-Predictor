/* ==========================================================
                    SLIDER VALUES
========================================================== */

const sliders = document.querySelectorAll("input[type='range']");

sliders.forEach((slider) => {
    const value = slider.parentElement.querySelector(".slider-value");

    if (value) {
        value.innerText = slider.value;
    }

    slider.addEventListener("input", () => {
        if (value) {
            value.innerText = slider.value;
        }
    });
});

/* ==========================================================
                FORM PROGRESS TRACKER
========================================================== */

const cards = document.querySelectorAll(".form-card");
const steps = document.querySelectorAll(".step");
const progressFill = document.querySelector(".progress-fill");
const header = document.querySelector(".site-header");

const updateProgress = () => {
    if (!cards.length || !steps.length || !progressFill) {
        return;
    }

    let current = 0;

    cards.forEach((card, index) => {
        const top = card.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.45) {
            current = index;
        }
    });

    steps.forEach((step, index) => {
        step.classList.toggle("active", index <= current);
    });

    progressFill.style.width = `${((current + 1) / cards.length) * 100}%`;
};

const updateHeaderState = () => {
    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 20);
    }
};

window.addEventListener("scroll", () => {
    updateProgress();
    updateHeaderState();
}, { passive: true });

window.addEventListener("load", () => {
    updateProgress();
    updateHeaderState();

    const resultSection = document.getElementById("prediction-result");
    const resultStatus = document.querySelector(".result-status");

    if (resultSection && resultStatus) {
        window.setTimeout(() => {
            resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
    }
});

/* ==========================================================
                    CLEAR INPUTS BUTTON
========================================================== */

const form = document.querySelector(".prediction-form form");
const clearButton = document.getElementById("clear-form-btn");
const resultSection = document.getElementById("prediction-result");

const resetSliderDisplay = () => {
    document.querySelectorAll("input[type='range']").forEach((slider) => {
        const value = slider.parentElement.querySelector(".slider-value");
        if (value) {
            value.innerText = slider.value;
        }
    });
};

const clearFormFields = (event) => {
    if (!form) {
        return;
    }

    event.preventDefault();

    // True default values (matches the server-side fallback defaults in
    // the Jinja template). form.reset() alone doesn't work here because
    // after a submission the page re-renders with the previously
    // submitted values baked into the HTML value/selected/checked
    // attributes — so the browser's "default" state is actually the
    // last submission, not a blank form. We reset each field type
    // manually instead so Clear Inputs always produces a truly blank form.
    const sliderDefaults = {
        age: "30",
        experience: "5",
        job_tenure: "5",
        credit_score: "700",
        credit_utilization: "0.30",
        payment_history: "25",
        credit_history_length: "10",
        loan_duration: "60",
        utility_history: "0.80",
    };

    // Reset sliders to their true defaults
    form.querySelectorAll("input[type='range']").forEach((slider) => {
        slider.value = sliderDefaults[slider.id] ?? slider.min;
    });

    // Clear number/text inputs
    form.querySelectorAll("input[type='number'], input[type='text']").forEach((input) => {
        input.value = "";
    });

    // Reset dropdowns to their placeholder option
    form.querySelectorAll("select").forEach((select) => {
        select.value = "";
    });

    // Uncheck all radio buttons
    form.querySelectorAll("input[type='radio']").forEach((radio) => {
        radio.checked = false;
    });

    // Sync the slider value labels with the new defaults
    resetSliderDisplay();

    if (resultSection) {
        resultSection.classList.add("is-hidden");
    }
};

if (clearButton) {
    clearButton.addEventListener("click", clearFormFields);
}