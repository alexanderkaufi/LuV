function anredeKind(fields) {
  const anrede = (fields.anrede || "").toLowerCase();
  if (anrede === "herr" || anrede === "hr" || anrede === "hr.") return "herr";
  if (anrede === "frau") return "frau";
  return "other";
}

export function pronounFor(fields) {
  const kind = anredeKind(fields);
  if (kind === "herr") return "Er";
  if (kind === "frau") return "Sie";
  return "Die Person";
}

export function fullName(fields) {
  const anrede = anredeKind(fields) === "other" ? "" : fields.anrede;
  return [anrede, fields.vorname, fields.nachname].filter(Boolean).join(" ").trim();
}

function phraseForAnrede(phrase, fields) {
  if (anredeKind(fields) === "herr") return phrase;

  const replacements = {
    er: "sie",
    ihn: "sie",
    ihm: "ihr",
    sein: "ihr",
    seine: "ihre",
    seinen: "ihren",
    seinem: "ihrem",
    seiner: "ihrer",
    seines: "ihres"
  };

  return phrase.replace(/\b(er|ihn|ihm|sein|seine|seinen|seinem|seiner|seines)\b/gi, (match) => {
    const replacement = replacements[match.toLowerCase()];
    return match[0] === match[0].toUpperCase()
      ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
      : replacement;
  });
}

export function phraseForIndicator(indicator, appState) {
  const entry = appState.ratings[indicator.id] || { rating: "", variant: "a" };
  const key = entry.rating ? entry.rating + (entry.variant || "a") : "";
  const phrase = indicator.options[key] || "";
  return phrase ? `${pronounFor(appState.fields)} ${phraseForAnrede(phrase, appState.fields)}` : "";
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
