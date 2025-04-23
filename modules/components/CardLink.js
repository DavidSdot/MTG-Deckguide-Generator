// modules/components/CardLink.js

import { ScryfallCard } from "../models/ScryfallCard.js";

/**
 * Creates an anchor element for hover-enabled card name.
 * @param {ScryfallCard} card - Scryfall card data
 * @returns {HTMLElement}
 */
export function createCardLink(card) {

  const link = document.createElement("a");
  link.href = card.scryfall_uri;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "cardlink";

  const span = document.createElement("span");
  span.textContent = card.Name;
  span.dataset.id = card.id;
  span.dataset.image = card.getImageUrl() || "";
  if (card.isSideboard) {
    span.style.fontStyle = "italic";
    span.style.color = "gray";
  }
  link.appendChild(span);
  return link;

}