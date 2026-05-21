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

function subjectFor(fields, subjectIndex) {
  const name = fullName(fields);
  return subjectIndex % 2 === 0 && name ? name : pronounFor(fields);
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

function phraseBodyForIndicator(indicator, appState) {
  const entry = appState.ratings[indicator.id] || { rating: "", variant: "a" };
  const key = entry.rating ? entry.rating + (entry.variant || "a") : "";
  const phrase = indicator.options[key] || "";
  return phrase ? phraseForAnrede(phrase, appState.fields) : "";
}

export function phraseIndexByIndicator(data, appState) {
  const indexes = new Map();
  let subjectIndex = 0;

  data.sections.forEach((section) => {
    section.competencies.forEach((competency) => {
      competency.indicators.forEach((indicator) => {
        if (phraseBodyForIndicator(indicator, appState)) {
          indexes.set(indicator.id, subjectIndex);
          subjectIndex += 1;
        }
      });
    });
  });

  return indexes;
}

export function phraseForIndicator(indicator, appState, subjectIndex = 0) {
  const phrase = phraseBodyForIndicator(indicator, appState);
  return phrase ? `${subjectFor(appState.fields, subjectIndex)} ${phrase}` : "";
}

export function phraseById(data, appState, indicatorId) {
  const phraseIndexes = phraseIndexByIndicator(data, appState);

  for (const section of data.sections) {
    for (const competency of section.competencies) {
      for (const indicator of competency.indicators) {
        if (indicator.id === indicatorId) {
          return phraseForIndicator(indicator, appState, phraseIndexes.get(indicator.id) ?? 0);
        }
      }
    }
  }
  return "";
}

export function buildResults(data, appState) {
  const phraseIndexes = phraseIndexByIndicator(data, appState);

  return data.sections.map((section) => ({
    title: section.title,
    competencies: section.competencies.map((competency) => ({
      title: competency.title,
      text: competency.indicators
        .map((indicator) => phraseForIndicator(indicator, appState, phraseIndexes.get(indicator.id) ?? 0))
        .filter(Boolean)
        .join(" ")
    }))
  }));
}
