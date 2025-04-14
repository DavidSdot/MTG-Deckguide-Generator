import {
  linkCardNames
} from '../modules/hoverPreview.js';

let symbolMap = {}; // Für Mana-Symbole

// Hole Manasymbole von Scryfall (einmalig)
export async function initSymbology() {
  const res = await fetch("https://api.scryfall.com/symbology");
  const json = await res.json();
  json.data.forEach(s => {
    symbolMap[s.symbol] = s;
  });
}

function renderManaCost(cost) {
  if (!cost || !symbolMap) return "";
  return cost.replace(/\{[^}]+\}/g, symbol => {
    const entry = symbolMap[symbol];
    return entry
      ? `<img src="${entry.svg_uri}" alt="${symbol}" class="mana-icon">`
      : symbol;
  });
}

function parseManaValue(manaCost) {
  if (!manaCost) return 0;
  const matches = manaCost.match(/\{([^}]+)\}/g);
  if (!matches) return 0;

  return matches.reduce((sum, m) => {
    const val = m.replace(/[{}]/g, '');
    if (!isNaN(parseInt(val))) return sum + parseInt(val);
    if (val === 'X') return sum; // X zählt als 0
    return sum + 1;
  }, 0);
}


export function createDeckTable(cards, targetId) {
  const target = document.getElementById(targetId);
  if (!target || !Array.isArray(cards)) return;

  target.innerHTML = "";

  const filterInput = document.createElement("input");
  filterInput.placeholder = "🔍 Karten filtern …";
  filterInput.className = "decklist-filter";
  filterInput.oninput = () => {
    const query = filterInput.value.toLowerCase();
    Array.from(tableBody.children).forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
    });
  };
  target.appendChild(filterInput);

  const table = document.createElement("table");
  table.className = "decklist-table";

  const header = document.createElement("thead");
  header.innerHTML = `
    <tr>
      <th class="sortable">Name</th>
      <th class="sortable">Typ</th>
      <th class="sortable">Mana</th>
    </tr>`;
  table.appendChild(header);

  const tableBody = document.createElement("tbody");

  cards.forEach(c => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.innerHTML = c.printed_name ? c.printed_name : c.name;

    const typeCell = document.createElement("td");
    typeCell.innerHTML = c.printed_type_line ? c.printed_type_line : c.type_line;

    const manaCell = document.createElement("td");
    manaCell.innerHTML = renderManaCost(c.mana_cost);
    manaCell.setAttribute("data-cmc", parseManaValue(c.mana_cost));

    row.appendChild(nameCell);
    row.appendChild(typeCell);
    row.appendChild(manaCell);
    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  target.appendChild(table);

  target.querySelectorAll("th.sortable").forEach((th, i) => {
    console.log(th.innerHTML)
    th.addEventListener("click", () => {
      console.log(th.innerHTML)
      const rows = Array.from(tableBody.rows);
      const asc = th.classList.toggle("asc");
      rows.sort((a, b) => {
        const A = a.cells[i].getAttribute("data-cmc") || a.cells[i].textContent;
        const B = b.cells[i].getAttribute("data-cmc") || b.cells[i].textContent;

        if (!isNaN(A) && !isNaN(B)) {
          return asc ? A - B : B - A;
        }

        return asc
          ? A.toString().localeCompare(B)
          : B.toString().localeCompare(A);
      });
      rows.forEach(r => tableBody.appendChild(r));
    });
  });
  
}
