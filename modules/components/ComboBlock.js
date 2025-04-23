// modules/components/ComboBlock.js
import { createCardTag } from './CardTag.js';

export function createComboBlock(combo) {
  const comboDiv = document.createElement("div");
  comboDiv.className = "combo-block";

  const cardRow = document.createElement("div");
  cardRow.className = "combo-cards";

  (combo.cards || []).forEach(card => {
    cardRow.appendChild(createCardTag(card));
  });

  const effectDiv = document.createElement("div");
  effectDiv.className = "combo-effect";
  effectDiv.textContent = combo.effect || "";

  comboDiv.appendChild(cardRow);
  comboDiv.appendChild(effectDiv);

  return comboDiv;
}
