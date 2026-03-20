'use strict';

// Shared overlay modal — single element reused for all images
const overlay = document.createElement('div');
overlay.id = 'img-overlay';
overlay.innerHTML = `
  <button class="overlay-close" aria-label="Close">&times;</button>
  <img class="overlay-img" alt="">
  <p class="overlay-caption"></p>
`;
document.body.appendChild(overlay);

const overlayImg = overlay.querySelector('.overlay-img');
const overlayCaption = overlay.querySelector('.overlay-caption');

function openOverlay(src, alt) {
  overlayImg.src = src;
  overlayImg.alt = alt;
  overlayCaption.textContent = alt;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeOverlay() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Attach to all pop-up links
document.querySelectorAll('.pop-up-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const img = link.querySelector('img');
    openOverlay(img.src, img.alt);
  });
});

// Close on backdrop click
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeOverlay();
});

// Close on X button
overlay.querySelector('.overlay-close').addEventListener('click', closeOverlay);

// Close on Esc
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeOverlay();
});
