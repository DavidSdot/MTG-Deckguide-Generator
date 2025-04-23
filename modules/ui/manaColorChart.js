// modules/ui/manaColorChart.js
const Chart = window.Chart;

let chartInstance = null;
export function createManaColorChart(cards, canvasId) {
  const counts = { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 };

  if (chartInstance) {
    chartInstance.destroy();
  }

  cards.forEach(card => {
    if (card.isSideboard || !card.TypeLine.toLowerCase().includes("land")) {
      return;
    }
    (card.colorIdentity || []).forEach(c => {
      counts[c] = (counts[c] || 0) + 1;
    });
    if ((card.colorIdentity || []).length === 0) counts.C++;
  });

  const ctx = document.getElementById(canvasId);
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(counts),
      backgroundColor: [
        'rgb(201, 197, 192)',
        'rgb(165, 191, 150)',
        'rgb(222, 154, 121)',
        'rgb(13, 15, 15)',
        'rgb(195, 215, 232)',
        'rgb(247, 246, 217)',
      ],
      datasets: [{
        data: Object.values(counts)
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}
