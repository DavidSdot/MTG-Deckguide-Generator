import { loadJsonFile, initThemeToggle } from './modules/helpers/index.js';
import { generateGuide } from './modules/logic/guideGenerator.js';

initApp();

async function initApp() {

  await new Promise(resolve => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        console.log("✅ DOMContentLoaded getriggert");
        resolve();
      });
    } else {
      resolve();
    }
  });

  initThemeToggle();

  const loadBtn = document.getElementById("loadJsonBtn");
  const genBtn = document.getElementById("generateBtn");

  if (loadBtn && genBtn) {
    loadBtn.addEventListener("click", loadJsonFile);
    genBtn.addEventListener("click", generateGuide);
  } 

  const saved = localStorage.getItem("lastDeckJson");
  const jsonInput = document.getElementById("jsonInput");
  if (saved && jsonInput) {
    jsonInput.value = saved;
    requestAnimationFrame(() => {
      generateGuide();
    });
  }
}
