// modules/ui/manaCurveChart.js
const Chart = window.Chart;

let chartInstance = null;
export function createManaCurveChart(cards, canvasId) {
  const maxCmc = Math.max(...cards.map(card => card.cmc ?? 0));
  const curve = Array(maxCmc).fill(0);

  if (chartInstance) {
    chartInstance.destroy();
  }

  cards.forEach(card => {
    if (!card.isSideboard && !card.TypeLine.toLowerCase().includes("land")) {
      const cmc = Math.min(Math.floor(card.cmc || 0), maxCmc);
      curve[cmc]++;
    }
  });

  const ctx = document.getElementById(canvasId);
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: createCmcLabels(maxCmc),
      datasets: [{
        label: 'Mana Curve',
        data: curve,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function createCmcLabels(maxCmc) {
  return Array.from({ length: maxCmc + 1 }, (_, i) =>
    i === maxCmc ? `${i}+` : `${i}`
  );
}