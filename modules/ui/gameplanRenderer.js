// modules/ui/gameplanRenderer.js
export function renderGameplan(data) {
    if (!data.gameplan) return;
  
    document.getElementById("earlyGame").innerHTML = data.gameplan.early;
    document.getElementById("midGame").innerHTML = data.gameplan.mid;
    document.getElementById("lateGame").innerHTML = data.gameplan.late;
  }
  