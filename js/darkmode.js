'use strict';

// Apply saved theme immediately to prevent flash of wrong theme
// Default is now dark; only remove dark class if user has explicitly chosen light
(function () {
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
})();

function applyThemedImages(isDark) {
    document.querySelectorAll('img[data-light-src]').forEach(function (img) {
        const darkSrc = img.getAttribute('data-dark-src') || img.getAttribute('src');
        if (!img.getAttribute('data-dark-src')) {
            img.setAttribute('data-dark-src', darkSrc);
        }
        img.src = isDark ? img.getAttribute('data-dark-src') : img.getAttribute('data-light-src');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    applyThemedImages(document.documentElement.classList.contains('dark'));

    const checkbox = document.getElementById('dark-checkbox');
    if (!checkbox) return;

    // Checkbox checked = light mode
    checkbox.checked = !document.documentElement.classList.contains('dark');

    checkbox.addEventListener('change', function () {
        if (this.checked) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        applyThemedImages(!this.checked);
    });
});
