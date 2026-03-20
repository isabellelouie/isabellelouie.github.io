'use strict';

// Apply saved theme immediately to prevent flash of wrong theme
(function () {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('dark-checkbox');
    if (!checkbox) return;

    // Sync checkbox state with current theme
    checkbox.checked = document.documentElement.classList.contains('dark');

    checkbox.addEventListener('change', function () {
        if (this.checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });
});
