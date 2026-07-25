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
});