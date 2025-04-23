import { renderManaCost } from '../ui/symbology.js';

// modules/ui/headerRenderer.js
export function renderHeader(data) {
  const titleEl = document.getElementById("deckTitle");
  const flavorEl = document.getElementById("deckFlavor");

  if (data.deckName) titleEl.innerHTML = data.deckName + " " + renderManaCost(data.colors.map(c => `{${c}}`).join(''));
  if (data.flavorText) flavorEl.innerHTML = data.flavorText;
}
