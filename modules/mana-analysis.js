export{
    createManaCurveChart,
    createManaColorChart
}


let ManaCurveChart;
function createManaCurveChart(cards, canvasId) {
    const counts = new Array(7).fill(0); // 0–6+

    cards.forEach(c => {
        if (c.type_line.toLowerCase().includes("land")) {
            return;
        }
        const cost = c.cmc ? c.cmc : parseManaValue(c.manacost);
        const bucket = Math.min(cost, 6);
        counts[bucket]++;
    });

    ManaCurveChart?.destroy();
    ManaCurveChart = new Chart(document.getElementById(canvasId), {
        type: 'bar',
        data: {
            labels: ['0', '1', '2', '3', '4', '5', '6+'],
            datasets: [{
                label: 'Karten pro Manakosten',
                data: counts,
                backgroundColor: '#4caf50'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: '🔢 Manakurve' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }

    });
}

let ManaColorChart;
function createManaColorChart(cards, canvasId) {
    const colorMap = { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 };

    cards.forEach(c => {
        if (c.cmc > 0) {
            (c.manacost.match(/\{([WUBRGC])\}/g) || []).forEach(m => {
                const symbol = m.replace(/\{|\}/g, '');
                if (colorMap[symbol] !== undefined) {
                    colorMap[symbol]++;
                }
            });
        }
    });

    const labels = Object.keys(colorMap).filter(k => colorMap[k] > 0);
    const data = labels.map(k => colorMap[k]);
    const colors = {
        W: '#fff176', U: '#64b5f6', B: '#757575',
        R: '#ef5350', G: '#81c784', C: '#bdbdbd'
    };

    ManaColorChart?.destroy();
    ManaColorChart = new Chart(document.getElementById(canvasId), {
        type: 'doughnut',
        data: {
            labels: labels.map(k => `{${k}}`),
            datasets: [{
                data: data,
                backgroundColor: labels.map(k => colors[k])
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: '🎨 Farbverteilung (Mana)' }
            }
        }
    });
}

// Hilfsfunktion: CMC aus Mana-Kosten schätzen
function parseManaValue(manaCost) {
    if (!manaCost) return 0;
    const matches = manaCost.match(/\{([^}]+)\}/g);
    if (!matches) return 0;

    return matches.reduce((sum, m) => {
        const val = m.replace(/[{}]/g, '');
        if (!isNaN(parseInt(val))) return sum + parseInt(val);
        if (val === 'X') return sum + 0;
        return sum + 1;
    }, 0);
}
