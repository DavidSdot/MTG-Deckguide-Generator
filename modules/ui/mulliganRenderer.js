// modules/ui/mulliganRenderer.js
export function renderMulligan(data) {
    if (!data.mulligan) return;
  
    const keepList = document.getElementById("mulliganKeep");
    const mullList = document.getElementById("mulliganMull");
  
    keepList.innerHTML = "";
    mullList.innerHTML = "";
  
    data.mulligan.keep.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = item;
      keepList.appendChild(li);
    });
  
    data.mulligan.mull.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = item;
      mullList.appendChild(li);
    });
  }
  