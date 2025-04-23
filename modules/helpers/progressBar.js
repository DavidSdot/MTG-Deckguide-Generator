// modules/helpers/progressBar.js
const container = document.getElementById("progressContainer");
const bar = document.getElementById("progressBar");

export function showProgress() {
  container.style.display = "block";
  updateProgressBar(0);
}

export function hideProgress() {
  container.style.display = "none";
}

export function updateProgressBar(ratio) {
  bar.style.width = `${Math.min(ratio * 100, 100)}%`;
}
