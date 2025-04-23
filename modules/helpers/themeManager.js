// modules/helpers/themeManager.js
export function initThemeToggle() {
    const themeBtn = document.getElementById("themeToggle");
  
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      themeBtn.innerHTML = "☀️";
    }
  
    themeBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeBtn.innerHTML = isDark ? "☀️" : "🌙";
    });
  }
  