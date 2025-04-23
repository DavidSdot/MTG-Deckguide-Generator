// modules/ui/symbology.js

let initalized = false;
let symbolMap = {};

async function initSymbology() {
  const res = await fetch("https://api.scryfall.com/symbology");
  const data = await res.json();

  data.data.forEach(sym => {
    symbolMap[sym.symbol] = sym.svg_uri;
  });
  document.documentElement.style.setProperty("--symbol-loaded", "true");
  initalized = true;
}

export function getSymbolUrl(symbol) {
  return symbolMap[symbol] || null;
}

export function renderManaCost(cost) {
  if (!cost || !symbolMap) return "";
  return cost.replace(/\{[^}]+\}/g, symbol => {
    const entry = getSymbolUrl(symbol);
    return entry
      ? `<img src="${entry}" alt="${symbol}" class="mana-icon" />`
      : symbol;
  });
}

await initSymbology();