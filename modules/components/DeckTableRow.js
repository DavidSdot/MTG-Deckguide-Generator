// modules/components/DeckTableRow.js
import { createCardLink } from './CardLink.js';
import { renderManaCost } from '../ui/symbology.js';

export function createDeckTableRow(card) {
  const tr = document.createElement("tr");

  const tdName = document.createElement("td");
  const tdType = document.createElement("td");
  const tdMana = document.createElement("td");


  tdName.appendChild(createCardLink(card));
  
  tdType.textContent = card.TypeLine;

  tdMana.innerHTML = renderManaCost(card.manaCost);

  tr.appendChild(tdName);
  tr.appendChild(tdType);
  tr.appendChild(tdMana);
  return tr;
}
