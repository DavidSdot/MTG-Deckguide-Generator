// modules/ui/strategyRenderer.js
export function renderStrategy(data) {
    if (!data.strategy) return;
    document.getElementById("strategyText").innerHTML = data.strategy;
  }
  