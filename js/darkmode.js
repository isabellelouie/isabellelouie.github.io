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

document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('dark-checkbox');
    if (!checkbox) return;

    // Checkbox checked = light mode now
    checkbox.checked = !document.documentElement.classList.contains('dark');

    checkbox.addEventListener('change', function () {
        if (this.checked) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});
