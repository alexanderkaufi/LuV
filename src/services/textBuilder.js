export function pronounFor(fields) {
  const anrede = fields.anrede.toLowerCase();
  return anrede === "herr" || anrede === "hr" || anrede === "hr." ? "Er" : "Sie";
}

export function fullName(fields) {
  return [fields.anrede, fields.vorname, fields.nachname].filter(Boolean).join(" ").trim();
}

export function phraseForIndicator(indicator, appState) {
  const entry = appState.ratings[indicator.id] || { rating: "", variant: "a" };
  const key = entry.rating ? entry.rating + (entry.variant || "a") : "";
  const phrase = indicator.options[key] || "";
  return phrase ? `${pronounFor(appState.fields)} ${phrase}` : "";
}

export function phraseById(data, appState, indicatorId) {
  for (const section of data.sections) {
    for (const competency of section.competencies) {
      for (const indicator of competency.indicators) {
        if (indicator.id === indicatorId) {
          return phraseForIndicator(indicator, appState);
        }
      }
    }
  }
  return "";
}

export function buildResults(data, appState) {
  return data.sections.map((section) => ({
    title: section.title,
    competencies: section.competencies.map((competency) => ({
      title: competency.title,
      text: competency.indicators.map((indicator) => phraseForIndicator(indicator, appState)).filter(Boolean).join(" ")
    }))
  }));
}
