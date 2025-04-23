// modules/components/FormatCard.js
import { createCardLink } from './CardLink.js';

export function createFormatCard(card, entry) {
  const container = document.createElement("div");
  container.className = "format-card";

  const name = entry.cardName || card?.Name || "Unknown";
  const imageUrl = card?.getImageUrl('art_crop');
  const previewUrl = card?.getImageUrl();
  const scryfallUrl = card?.scryfall_uri || null;

  container.innerHTML = `
    <img src="${imageUrl}" alt="${name}">
    <div class="format-card-label"><strong>${entry.name || "?"}: </strong></div>
  `;

  const link = createCardLink(card);
  container.querySelector(".format-card-label").appendChild(link);

  return container;
}
