import {
  initSymbology,
  createDeckTable
} from "../modules/decklist.js";
import {
  createManaCurveChart,
  createManaColorChart
} from "../modules/mana-analysis.js";
import {
  linkCardNames,
  enableCardHoverLinks
} from '../modules/hoverPreview.js';

async function fetchCardData(name, lang) {
  const baseRes = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`);
  if (!baseRes.ok) return null;
  const baseCard = await baseRes.json();
  if (lang === "en") return baseCard;
  const printsRes = await fetch(baseCard.prints_search_uri + "&include_multilingual=true");
  if (printsRes.ok) {
    const data = await printsRes.json();
    const localized = data.data.find(card => card.lang === lang);
    if (localized) {
      return {
        ...baseCard,
        ...localized,
        image_uris: localized.image_uris || baseCard.image_uris
      };
    }
  }

  return baseCard;
}

function loadJsonFile() {
  const file = document.getElementById("jsonFile").files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("jsonInput").value = reader.result;
  };
  reader.readAsText(file);
}

function renderCombos(data) {
  const container = document.getElementById("comboListContainer");
  if (!data.combos || data.combos.length === 0) return;

  container.innerHTML = "";

  data.combos.forEach(combo => {
    const comboDiv = document.createElement("div");
    comboDiv.className = "combo-block";

    const cardRow = document.createElement("div");
    cardRow.className = "combo-cards";

    (combo.cards || []).forEach(card => {
      const tag = document.createElement("span");
      tag.className = "card-tag";
      tag.textContent = card;
      cardRow.appendChild(tag);
    });

    const effectDiv = document.createElement("div");
    effectDiv.className = "combo-effect";
    effectDiv.textContent = combo.effect || "";

    comboDiv.appendChild(cardRow);
    comboDiv.appendChild(effectDiv);
    container.appendChild(comboDiv);
  });
}


function renderGameplan(data) {
  if (!data.gameplan) return;

    document.getElementById("earlyGame").innerHTML = data.gameplan.early;
    document.getElementById("midGame").innerHTML = data.gameplan.mid;
    document.getElementById("lateGame").innerHTML = data.gameplan.late;

}

function renderMulligan(data) {
  if (!data.mulligan) return;

  const keepList = document.getElementById("mulliganKeep");
  const mullList = document.getElementById("mulliganMull");

  keepList.innerHTML = "";
  mullList.innerHTML = "";

  data.mulligan.keep.forEach(k => {
    const li = document.createElement("li");
    li.innerHTML = k;
    keepList.appendChild(li);
  });

  data.mulligan.mull.forEach(m => {
    const li = document.createElement("li");
    li.innerHTML = m;
    mullList.appendChild(li);
  });
}

async function renderFormat(data) {
  if (!data.format || !data.format.name) return;

  document.getElementById("formatName").innerHTML = data.format.name;
  const list = document.getElementById("formatCardsList");
  list.innerHTML = "";

  for (const entry of data.format.specialCards || []) {
    const card = await fetchCardData(entry.cardName, data.language || "en");

    const container = document.createElement("div");
    container.className = "format-card";

    container.innerHTML = `
      <img src="${card.image_uris?.art_crop}" alt="${entry.cardName}">
      <div class="format-card-label">
        <strong>${entry.name}:</strong> ${entry.cardName}
      </div>
    `;

    list.appendChild(container);
  }

}

function renderHeader(data) {
  if (data.deckName) document.getElementById("deckTitle").innerHTML = data.deckName;
  if (data.flavorText) document.getElementById("deckFlavor").innerHTML = data.flavorText;
}

function renderStrategy(data, cards) {
  if (data.strategy) {
    document.getElementById("strategyText").innerHTML = data.strategy;
  }
}

async function generateGuide() {
  const raw = document.getElementById("jsonInput").value;
  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");
  progressContainer.style.display = "block";
  progressBar.style.width = "0%";

  let data = {};
  try {
    data = JSON.parse(raw);
  } catch {
    alert("Fehlerhaftes JSON");
    progressContainer.style.display = "none";
    return;
  }

  const lang = data.language || "en";
  const cards = data.decklist || [];
  const total = cards.length;
  const details = [];

  for (let i = 0; i < total; i++) {
    const name = cards[i].replace(/^\d*x*\s/, "").replace(/\s\(\w{3}\)\s\d+$/, "");
    const info = await fetchCardData(name, lang);
    if (info) details.push(info);
    progressBar.style.width = `${((i + 1) / total) * 100}%`;
  }

  progressContainer.style.display = "none";

  renderHeader(data);
  renderFormat(data);
  renderStrategy(data, details);
  renderCombos(data);
  renderGameplan(data);
  renderMulligan(data);

  await initSymbology();
  createDeckTable(details, "deckTableContainer");

  document.querySelectorAll('.cardlink').forEach(link => {
    link.style.setProperty('--hover-image', `url(${link.dataset.image})`);
  });

  // Zeige alle page-blocks
  document.querySelectorAll(".page-block").forEach(el => {
    el.classList.add("visible");
  });

  const textKeys = [
    "formatCardsList",
    "strategyText",
    "comboListContainer",
    "earlyGame",
    "midGame",
    "lateGame",
    "mulligan"
  ];
  for (const key of textKeys) {
    if (document.getElementById(key)) {
      document.getElementById(key).innerHTML = linkCardNames(document.getElementById(key).innerHTML, details);
    }
  }

  document.querySelectorAll("#deckTableContainer table tbody tr td:first-child").forEach((td, i) => {
    td.innerHTML = linkCardNames(td.innerHTML, details);
  });

  enableCardHoverLinks();

  requestAnimationFrame(() => {
    createManaCurveChart(details, "curveCanvas");
    createManaColorChart(details, "colorCanvas");
  });

}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loadJsonBtn").addEventListener("click", loadJsonFile);
  document.getElementById("generateBtn").addEventListener("click", generateGuide);
});

const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  themeBtn.innerHTML = dark ? "☀️" : "🌙";
});

// Beim Laden Theme wiederherstellen
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.innerHTML = "☀️";
}
