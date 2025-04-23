// modules/helpers/jsonLoader.js
export function loadJsonFile() {
    const fileInput = document.getElementById("jsonFile");
    if (!fileInput?.files?.[0]) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("jsonInput").value = reader.result;
    };
    reader.readAsText(fileInput.files[0]);
  }
  