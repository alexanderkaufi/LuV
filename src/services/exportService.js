import { buildResults, fullName } from "./textBuilder.js";

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportMarkdown(data, appState) {
  const lines = [
    "# Leistungs- und Verhaltensbeurteilung",
    "",
    `Teilnehmer: ${fullName(appState.fields) || "-"}`,
    `Datum: ${appState.fields.datum || "-"}`,
    ""
  ];

  buildResults(data, appState).forEach((section) => {
    lines.push(`## ${section.title}`, "");
    section.competencies.forEach((competency) => {
      lines.push(`### ${competency.title}`, competency.text || "-", "");
    });
  });

  data.questions.forEach((question, index) => {
    if (appState.freeTexts[index]) {
      lines.push(`### ${question}`, appState.freeTexts[index], "");
    }
  });

  download("LuV-Ergebnis.md", lines.join("\n"), "text/markdown;charset=utf-8");
}

export function exportJson(appState) {
  download("LuV-Fall.json", JSON.stringify(appState.toStoragePayload(), null, 2), "application/json;charset=utf-8");
}
