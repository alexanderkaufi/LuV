import { ratings, ratingLabels, variants } from "../model/rating.js";
import { phraseForIndicator } from "../services/textBuilder.js";
import { esc, slug } from "../utils/html.js";

function sidebar(data) {
  let html = '<section class="card sidebar no-print"><h3>Navigation</h3>';
  data.sections.forEach((section, sectionIndex) => {
    html += `<a href="#section-${sectionIndex}">${esc(section.title)}</a>`;
    section.competencies.forEach((competency, competencyIndex) => {
      html += `<a style="padding-left:22px" href="#comp-${sectionIndex}-${competencyIndex}-${slug(competency.title)}">${esc(competency.title)}</a>`;
    });
  });
  html += "</section>";
  return html;
}

export function renderRatings(container, data, appState) {
  let compCounter = 0;
  let html = `<div class="layout">${sidebar(data)}<div>`;
  html += '<div class="toolbar no-print"><button class="btn small" type="button" data-action="open-all">Alle öffnen</button><button class="btn small" type="button" data-action="close-all">Alle schließen</button><button class="btn small" type="button" data-action="clear-ratings">Alle Bewertungen löschen</button></div>';

  data.sections.forEach((section, sectionIndex) => {
    html += `<section id="section-${sectionIndex}" class="card section"><button class="section-title" type="button" data-action="toggle-section" data-section-index="${sectionIndex}"><span>${esc(section.title)}</span><span>${appState.open[sectionIndex] ? "−" : "+"}</span></button>`;

    if (appState.open[sectionIndex]) {
      section.competencies.forEach((competency, competencyIndex) => {
        const thisComp = compCounter;
        compCounter += 1;

        html += `<div id="comp-${sectionIndex}-${competencyIndex}-${slug(competency.title)}" class="competency"><div class="comp-head"><div><h2>${esc(competency.title)}</h2><p class="definition">${esc(competency.definition)}</p></div><div class="row-actions no-print">${[1, 2, 3, 4, 5].map((rating) => `<button class="btn small" type="button" data-action="set-competency" data-comp-index="${thisComp}" data-rating="${rating}">alle ${rating}</button>`).join("")}</div></div>`;
        html += '<div class="table-wrap"><table><thead><tr><th>Nr.</th><th>Verhaltensindikator</th><th>Bewertung</th><th>Variante</th><th>gebildeter Text</th><th>Aktion</th></tr></thead><tbody>';

        competency.indicators.forEach((indicator) => {
          const entry = appState.ratings[indicator.id] || { rating: "", variant: "a" };
          const phrase = phraseForIndicator(indicator, appState);
          html += `<tr><td>${esc(indicator.row)}</td><td class="indicator">${esc(indicator.text)}</td><td><select data-action="set-rating" data-indicator-id="${esc(indicator.id)}" data-property="rating">${ratings.map((rating) => `<option value="${rating}" ${entry.rating === rating ? "selected" : ""}>${ratingLabels[rating]}</option>`).join("")}</select></td><td><select data-action="set-rating" data-indicator-id="${esc(indicator.id)}" data-property="variant">${variants.map((variant) => `<option value="${variant}" ${entry.variant === variant ? "selected" : ""}>${variant}</option>`).join("")}</select></td><td class="preview">${phrase ? esc(phrase) : '<span class="muted">Keine Bewertung ausgewählt.</span>'}</td><td><button class="btn small" type="button" data-action="copy-phrase" data-indicator-id="${esc(indicator.id)}">Kopieren</button></td></tr>`;
        });

        html += "</tbody></table></div></div>";
      });
    }

    html += "</section>";
  });

  html += "</div></div>";
  container.innerHTML = html;
}
