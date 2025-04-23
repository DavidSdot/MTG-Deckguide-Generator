import { createDeckTable } from './deckTableRenderer.js';
import { enableCardHoverLinks } from './hoverPreview.js';

let currentDeck = [];
let containerId = "deckTableContainer";
let currentSortKey = "Name";
let ascending = true;

export function initDeckSorter(deck, targetId = "deckTableContainer") {
  currentDeck = deck;
  containerId = targetId;
  renderSorted();
}

export function triggerSort(key) {
  if (currentSortKey === key) {
    ascending = !ascending;
  } else {
    currentSortKey = key;
    ascending = true;
  }
  renderSorted();
}

function renderSorted() {
  let sorted = [...currentDeck];

  sorted.sort((a, b) => {
    let valA = a[currentSortKey];
    let valB = b[currentSortKey];

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return ascending ? -1 : 1;
    if (valA > valB) return ascending ? 1 : -1;
    return 0;
  });

  createDeckTable(sorted, containerId);
  updateSortIndicators();
  enableCardHoverLinks(document.getElementById(containerId));
}

function updateSortIndicators() {
    const headers = document.querySelectorAll("th.sortable");
  
    headers.forEach(th => {
      const key = th.dataset.sortKey;
      if (key === currentSortKey) {
        th.classList.add("active");
        th.setAttribute("data-sort-dir", ascending ? "▲" : "▼");
      } else {
        th.classList.remove("active");
        th.removeAttribute("data-sort-dir");
      }
    });
  }