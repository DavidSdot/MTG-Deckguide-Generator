// modules/components/CardTag.js
import { ScryfallCard } from '../models/ScryfallCard.js';
import { createCardLink } from './CardLink.js';

/**
 * Creates a tag-like visual component for a card name, with hover.
 * @param {ScryfallCard} card
 * @returns {HTMLElement}
 */
export function createCardTag(card) {
  const tag = document.createElement("span");
  tag.className = "card-tag";
  tag.appendChild(createCardLink(card));
  return tag;
}
