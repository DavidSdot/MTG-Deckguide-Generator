// modules/ui/formatRenderer.js
import { getCard } from '../cards.js';
import { createFormatCard } from '../components/FormatCard.js';

/**
 * Renders the "special format cards" section of the guide.
 * @param {Object} data - Parsed deck JSON data
 */
export async function renderFormat(data) {
  if (!data.format || !data.format.name) return;

  const titleEl = document.getElementById("formatName");
  const listEl = document.getElementById("formatCardsList");

  titleEl.innerHTML = data.format.name;
  listEl.innerHTML = "";

  const lang = data.language || "en";
  const cardEntries = data.format.specialCards || [];

  for (const entry of cardEntries) {
    const card = await getCard(entry.cardName, lang, entry.set, entry.setnum);
    if (!card) continue;

    const element = createFormatCard(card, entry, 'art_crop');
    if (element) listEl.appendChild(element);
  }
}
