import { esc } from "../utils/html.js";

export function renderDataOverview(container, data) {
  let html = `<section class="card header"><h2>Datenübersicht</h2><div class="two-col"><div class="stat"><b>${data.meta.kompetenzbereiche}</b>Kompetenzbereiche</div><div class="stat"><b>${data.meta.kompetenzmerkmale}</b>Kompetenzmerkmale</div><div class="stat"><b>${data.meta.indikatoren}</b>Verhaltensindikatoren</div><div class="stat"><b>${data.meta.textbausteine}</b>Textbausteine</div></div></section>`;

  data.sections.forEach((section) => {
    html += `<section class="card header"><h2>${esc(section.title)}</h2>${section.competencies.map((competency) => `<div class="result-box"><b>${esc(competency.title)}</b><br><span class="muted">${competency.indicators.length} Indikatoren</span></div>`).join("")}</section>`;
  });

  container.innerHTML = html;
}
