// modules/ui/comboRenderer.js
export function renderCombos(data) {
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
  