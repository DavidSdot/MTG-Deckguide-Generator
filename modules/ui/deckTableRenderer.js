import { triggerSort } from './deckSorter.js';
import { renderManaCost } from '../ui/symbology.js';
import { createCardLink } from '../components/CardLink.js';

/**
 * Creates and renders a sortable deck table.
 * @param {Array} cards - Array of ScryfallCard
 * @param {string} containerId - ID of the container element
 */
export function createDeckTable(cards, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headers = [
    { label: "Menge", key: "quantity" },
    { label: "Name", key: "Name" },
    { label: "Typ", key: "TypeLine" },
    { label: "CMC", key: "cmc" },
  ];

  const tr = document.createElement("tr");

  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h.label;
    th.classList.add("sortable");
    th.dataset.sortKey = h.key;
    th.addEventListener("click", () => triggerSort(h.key));
    tr.appendChild(th);
  });

  thead.appendChild(tr);
  table.appendChild(thead);

  cards.forEach(card => {
    const row = document.createElement("tr");

    const tdQuantity = document.createElement("td");
    tdQuantity.textContent = card.quantity;

    const tdName = document.createElement("td");
    tdName.appendChild(createCardLink(card));

    const tdType = document.createElement("td");
    tdType.textContent = card.TypeLine;

    const tdCmc = document.createElement("td");
    tdCmc.innerHTML = renderManaCost(card.manaCost);

    row.appendChild(tdQuantity);
    row.appendChild(tdName);
    row.appendChild(tdType);
    row.appendChild(tdCmc);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}
