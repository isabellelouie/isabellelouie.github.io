const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.7
};

function observerCallback(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // fade in observed elements that are in view
            entry.target.classList.replace('fadeOut', 'fadeIn');
        } else {
            // fade out observed elements that are not in view
            entry.target.classList.replace('fadeIn', 'fadeOut');
        }
    });
}

const observer = new IntersectionObserver(observerCallback, observerOptions);

const fadeElms = document.querySelectorAll('.fade');
fadeElms.forEach(el => observer.observe(el));