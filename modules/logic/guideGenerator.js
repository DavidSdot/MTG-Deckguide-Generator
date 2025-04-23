import {
  renderHeader,
  renderFormat,
  renderCombos,
  renderStrategy,
  renderGameplan,
  renderMulligan,
  createManaCurveChart,
  createManaColorChart,
  renderOptimization,
  initDeckSorter
} from '../ui/index.js';

import {
  showProgress,
  hideProgress,
  updateProgressBar,
  linkCardNames
} from '../helpers/index.js';

import { getCard } from '../cards.js';

import { enableCardHoverLinks } from '../ui/hoverPreview.js';

export async function generateGuide() {

  document.querySelectorAll(".page-block").forEach(el => el.classList.remove("visible"));

  const raw = document.getElementById("jsonInput").value;
  showProgress();

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    alert("Invalid JSON");
    hideProgress();
    return;
  }

  localStorage.setItem("lastDeckJson", raw);

  const lang = data.language || "en";
  const details = [];
  const total = (data.decklist.mainboard?.length || 0) + (data.decklist.sideboard?.length || 0);

  if (data.decklist.mainboard) {
    for (const entry of data.decklist.mainboard) {
      const card = await getCard(entry.name, lang, entry.set, entry.setnum);
      card.quantity = entry.quantity;
      if (card) details.push(card);

      updateProgressBar(details.length / total);
    }
  }

  if (data.decklist.sideboard) {
    for (const entry of data.decklist.sideboard) {
      const card = await getCard(entry.name, lang, entry.set, entry.setnum);
      card.isSideboard = true;
      card.quantity = entry.quantity;
      if (card) details.push(card);

      updateProgressBar(details.length / total);
    }
  }

  hideProgress();

  renderHeader(data);
  await renderFormat(data);
  renderStrategy(data);
  renderCombos(data);
  renderGameplan(data);
  renderMulligan(data);
  await renderOptimization(data, details); 
  initDeckSorter(details, "deckTableContainer");

  const keys = ["formatCardsList", "strategyText", "comboListContainer", "earlyGame", "midGame", "lateGame", "mulligan", "optimizationContainer"];
  for (const key of keys) {
    const el = document.getElementById(key); 
    if (el) linkCardNames(el, details);
  }

  // Update deck table links
  document.querySelectorAll("#deckTableContainer table tbody tr td:first-child").forEach((td) => {
    linkCardNames(td, details);
  });

  enableCardHoverLinks();

  document.querySelectorAll(".page-block").forEach(el => el.classList.add("visible"));

  requestAnimationFrame(() => {
    createManaCurveChart(details, "curveCanvas");
    createManaColorChart(details, "colorCanvas");
  });
}
