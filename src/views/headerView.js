import { fullName } from "../services/textBuilder.js";

export function syncFieldControls(appState, root = document) {
  Object.entries(appState.fields).forEach(([field, value]) => {
    const control = root.querySelector(`[data-field="${field}"]`);
    if (control) {
      control.value = value;
    }
  });
}

export function updateStats(data, appState, root = document) {
  root.getElementById("statName").textContent = fullName(appState.fields) || "-";
  root.getElementById("statDone").textContent = `${appState.doneCount} von ${data.meta.indikatoren}`;
}
