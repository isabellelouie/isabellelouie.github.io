'use strict';

const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.ql-link');

// Default first link to active on load
if (links.length) links[0].classList.add('active');

let scrollTimeout;
let paused = false;

const observer = new IntersectionObserver(entries => {
  if (paused) return;
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(section => observer.observe(section));

// On click, set active immediately and pause observer briefly
links.forEach(link => {
  link.addEventListener('click', () => {
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    paused = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => { paused = false; }, 1000);
  });
});
