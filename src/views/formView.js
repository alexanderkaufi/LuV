import { esc } from "../utils/html.js";

export const formTabByName = {
  "Start-LuV": "startluv",
  "Abschluss-LuV": "abschlussluv",
  Ergebnis: "ergebnisformular"
};

export const formNameByTab = Object.fromEntries(Object.entries(formTabByName).map(([name, tab]) => [tab, name]));

export function renderSpecificForm(container, data, formName) {
  const rows = data.forms[formName] || [];
  const title = formName === "Ergebnis" ? "Ergebnisformular aus der Excel-Datei" : formName;
  const note = formName === "Abschluss-LuV"
    ? "Dieses Formular entspricht dem Abschluss-LuV-Blatt der ursprünglichen Arbeitsmappe."
    : formName === "Start-LuV"
      ? "Dieses Formular entspricht dem Start-LuV-Blatt der ursprünglichen Arbeitsmappe."
      : "Dieses Formular entspricht dem Ergebnis-Blatt der ursprünglichen Arbeitsmappe.";

  container.innerHTML = `<section class="card header"><h2>${esc(title)}</h2><p class="muted">${esc(note)}</p><div class="form-grid">${rows.map((row) => `<div class="form-row">${row.map(esc).join(" | ")}</div>`).join("")}</div></section>`;
}

export function renderFreeTexts(container, data, appState) {
  container.innerHTML = `<section class="card header"><h2>Fachliche Angaben</h2><p class="muted">Diese Felder ersetzen die fachlichen Freitextbereiche der Excel-Datei.</p>${data.questions.map((question, index) => `<label>${esc(question)}<textarea data-action="free-text" data-free-text-index="${index}">${esc(appState.freeTexts[index] || "")}</textarea></label>`).join("")}</section>`;
}
