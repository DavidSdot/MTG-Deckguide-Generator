// modules/ui/hoverPreview.js

let currentPreview = null;
let delay;
let observer;

export function enableCardHoverLinks(root = document) {
  if (window.innerWidth < 768) return; // 💡 Deaktiviere auf Mobilgeräten

  root.querySelectorAll('.cardlink').forEach(el => {
    if (el.classList.contains('hover-enabled')) return;

    el.addEventListener('mouseenter', () => {
      clearTimeout(delay);
      delay = setTimeout(() => {
        showPreview(el);
      }, 250);
    });

    el.addEventListener('mouseleave', () => {
      clearTimeout(delay);
      hidePreview();
    });

    el.classList.add('hover-enabled');
  });
}

function showPreview(el) {
  hidePreview();

  const imageUrl = el.querySelector("span")?.dataset.image || el.dataset.image;
  if (!imageUrl) return;

  currentPreview = document.createElement('div');
  currentPreview.className = 'card-preview';

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = el.textContent;

  currentPreview.appendChild(img);
  document.body.appendChild(currentPreview);

  img.onload = () => {
    positionPreview(el);
    observeVisibility();
  };
}


function positionPreview(el) {
  const elRect = el.getBoundingClientRect();
  const previewRect = currentPreview.getBoundingClientRect();

  const spacing = 15;
  let left = elRect.right + spacing;
  let top = elRect.top + window.scrollY;

  if (left + previewRect.width > window.innerWidth) {
    left = elRect.left - previewRect.width - spacing;
  }

  if (top + previewRect.height > window.innerHeight + window.scrollY) {
    top = window.innerHeight + window.scrollY - previewRect.height - spacing;
  }

  currentPreview.style.top = `${top}px`;
  currentPreview.style.left = `${Math.max(left, spacing)}px`;
}

function observeVisibility() {
  if (!currentPreview) return;

  observer = new IntersectionObserver(entries => {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      hidePreview();
    }
  });

  observer.observe(currentPreview);
}

function hidePreview() {
  if (observer && currentPreview) {
    observer.unobserve(currentPreview);
    observer.disconnect();
  }

  if (currentPreview) {
    currentPreview.remove();
    currentPreview = null;
  }

  clearTimeout(delay);
}
