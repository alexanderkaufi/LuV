import { variants } from "../model/rating.js";

function randomVariant() {
  return variants[Math.floor(Math.random() * variants.length)];
}

export class AppState {
  constructor(data) {
    this.data = data;
    this.fields = {
      anrede: "Herr",
      vorname: "A.",
      nachname: "",
      datum: new Date().toISOString().slice(0, 10),
      formType: "Start-LuV"
    };
    this.ratings = {};
    this.freeTexts = {};
    this.open = {};
    this.resetRatingsToDefaults();
  }

  resetAll() {
    this.fields = {
      anrede: "Herr",
      vorname: "A.",
      nachname: "",
      datum: new Date().toISOString().slice(0, 10),
      formType: "Start-LuV"
    };
    this.freeTexts = {};
    this.resetRatingsToDefaults();
  }

  resetRatingsToDefaults() {
    this.ratings = {};
    this.open = {};
    this.data.sections.forEach((section, sectionIndex) => {
      this.open[sectionIndex] = true;
      section.competencies.forEach((competency) => {
        competency.indicators.forEach((indicator) => {
          this.ratings[indicator.id] = {
            rating: indicator.defaultRating || "",
            variant: randomVariant()
          };
        });
      });
    });
  }

  setAllEmpty() {
    this.data.sections.forEach((section) => {
      section.competencies.forEach((competency) => {
        competency.indicators.forEach((indicator) => {
          this.ratings[indicator.id] = { rating: "", variant: randomVariant() };
        });
      });
    });
  }

  randomizeAll() {
    this.data.sections.forEach((section) => {
      section.competencies.forEach((competency) => {
        competency.indicators.forEach((indicator) => {
          this.ratings[indicator.id] = {
            rating: String(1 + Math.floor(Math.random() * 5)),
            variant: randomVariant()
          };
        });
      });
    });
  }

  setRating(indicatorId, property, value) {
    this.ratings[indicatorId] = {
      ...(this.ratings[indicatorId] || { rating: "", variant: randomVariant() }),
      [property]: value
    };
  }

  setCompetency(compIndex, rating) {
    let currentIndex = 0;
    this.data.sections.forEach((section) => {
      section.competencies.forEach((competency) => {
        if (currentIndex === compIndex) {
          competency.indicators.forEach((indicator) => {
            this.ratings[indicator.id] = {
              ...(this.ratings[indicator.id] || { variant: randomVariant() }),
              rating: String(rating)
            };
          });
        }
        currentIndex += 1;
      });
    });
  }

  toggleSection(sectionIndex) {
    this.open[sectionIndex] = !this.open[sectionIndex];
  }

  setAllSections(open) {
    this.data.sections.forEach((_, sectionIndex) => {
      this.open[sectionIndex] = open;
    });
  }

  get doneCount() {
    return Object.values(this.ratings).filter((entry) => entry.rating).length;
  }

  toStoragePayload() {
    return {
      state: {
        ratings: this.ratings,
        freeTexts: this.freeTexts,
        open: this.open
      },
      fields: this.fields
    };
  }

  restore(payload) {
    if (!payload) return;
    this.ratings = payload.state?.ratings || this.ratings;
    this.freeTexts = payload.state?.freeTexts || {};
    this.open = payload.state?.open || this.open;
    this.fields = {
      ...this.fields,
      ...(payload.fields || {})
    };
    if (this.fields.anrede === "Hr." || this.fields.anrede === "Hr") {
      this.fields.anrede = "Herr";
    }
  }
}
