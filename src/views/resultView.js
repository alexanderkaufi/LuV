import { buildResults, fullName } from "../services/textBuilder.js";
import { esc } from "../utils/html.js";

export function renderResults(container, data, appState) {
  let html = "";
  buildResults(data, appState).forEach((section, sectionIndex) => {
    html += `<section class="card header"><h2>${esc(section.title)}</h2>`;
    section.competencies.forEach((competency, competencyIndex) => {
      html += `<div class="result-box"><div class="comp-head"><h3>${esc(competency.title)}</h3><button class="btn small no-print" type="button" data-action="copy-result" data-section-index="${sectionIndex}" data-competency-index="${competencyIndex}">Kopieren</button></div><p>${esc(competency.text || "-")}</p></div>`;
    });
    html += "</section>";
  });
  container.innerHTML = html;
}

export function renderReport(container, data, appState) {
  const results = buildResults(data, appState);
  let html = `<section class="card header"><p class="eyebrow">Druckansicht</p><h1>Leistungs- und Verhaltensbeurteilung</h1><p><b>Teilnehmer:</b> ${esc(fullName(appState.fields) || "-")}<br><b>Datum:</b> ${esc(appState.fields.datum || "-")}</p></section>`;

  results.forEach((section) => {
    html += `<section class="card header"><h2>${esc(section.title)}</h2>`;
    section.competencies.forEach((competency) => {
      if (competency.text) {
        html += `<h3>${esc(competency.title)}</h3><p>${esc(competency.text)}</p>`;
      }
    });
    html += "</section>";
  });

  container.innerHTML = html;
}
