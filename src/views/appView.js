import { exportJson, exportMarkdown } from "../services/exportService.js";
import { loadLocal, saveLocal } from "../services/storageService.js";
import { buildResults, phraseById } from "../services/textBuilder.js";
import { formNameByTab, formTabByName, renderFreeTexts, renderSpecificForm } from "./formView.js";
import { syncFieldControls } from "./headerView.js";
import { renderDataOverview } from "./dataOverviewView.js";
import { renderRatings } from "./ratingView.js";
import { renderReport, renderResults } from "./resultView.js";

export class AppView {
  constructor(data, appState) {
    this.data = data;
    this.appState = appState;
    this.currentTab = "bewertung";
  }

  start() {
    syncFieldControls(this.appState);
    this.bindEvents();
    this.renderAll();
  }

  bindEvents() {
    document.addEventListener("click", (event) => this.handleClick(event));
    document.addEventListener("change", (event) => this.handleChange(event));
    document.addEventListener("input", (event) => this.handleInput(event));
  }

  handleClick(event) {
    const tabButton = event.target.closest("[data-tab]");
    if (tabButton) {
      this.showTab(tabButton.dataset.tab);
      return;
    }

    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) return;

    const action = actionTarget.dataset.action;
    if (action === "randomize") this.appState.randomizeAll();
    if (action === "clear-ratings") this.appState.setAllEmpty();
    if (action === "reset") {
      this.appState.resetAll();
      syncFieldControls(this.appState);
    }
    if (action === "save") {
      saveLocal(this.appState.toStoragePayload());
      alert("Gespeichert.");
      return;
    }
    if (action === "load") {
      const payload = loadLocal();
      if (!payload) {
        alert("Keine gespeicherten Daten gefunden.");
        return;
      }
      this.appState.restore(payload);
      syncFieldControls(this.appState);
    }
    if (action === "export-markdown") {
      exportMarkdown(this.data, this.appState);
      return;
    }
    if (action === "export-json") {
      exportJson(this.appState);
      return;
    }
    if (action === "print") {
      window.print();
      return;
    }
    if (action === "open-all") this.appState.setAllSections(true);
    if (action === "close-all") this.appState.setAllSections(false);
    if (action === "toggle-section") this.appState.toggleSection(Number(actionTarget.dataset.sectionIndex));
    if (action === "set-competency") this.appState.setCompetency(Number(actionTarget.dataset.compIndex), actionTarget.dataset.rating);
    if (action === "copy-phrase") {
      this.copyText(phraseById(this.data, this.appState, actionTarget.dataset.indicatorId));
      return;
    }
    if (action === "copy-result") {
      const results = buildResults(this.data, this.appState);
      const section = results[Number(actionTarget.dataset.sectionIndex)];
      const competency = section?.competencies[Number(actionTarget.dataset.competencyIndex)];
      this.copyText(competency?.text || "");
      return;
    }

    this.renderAll();
  }

  handleChange(event) {
    const target = event.target;

    if (target.dataset.field) {
      this.appState.fields[target.dataset.field] = target.value;
      if (target.dataset.field === "formType") {
        this.showTab(formTabByName[target.value] || this.currentTab);
      } else {
        this.renderAll();
      }
      return;
    }

    if (target.dataset.action === "set-rating") {
      this.appState.setRating(target.dataset.indicatorId, target.dataset.property, target.value);
      this.renderAll();
    }
  }

  handleInput(event) {
    const target = event.target;

    if (target.dataset.field) {
      this.appState.fields[target.dataset.field] = target.value;
      this.renderAll();
      return;
    }

    if (target.dataset.action === "free-text") {
      this.appState.freeTexts[target.dataset.freeTextIndex] = target.value;
    }
  }

  showTab(tabId) {
    this.currentTab = tabId;
    const formName = formNameByTab[tabId];
    if (formName) {
      this.appState.fields.formType = formName;
      syncFieldControls(this.appState);
    }

    document.querySelectorAll(".tabcontent").forEach((element) => {
      element.classList.toggle("hidden", element.id !== tabId);
    });
    document.querySelectorAll(".tab").forEach((element) => {
      element.classList.toggle("active", element.dataset.tab === tabId);
    });
    this.renderCurrentTab();
  }

  renderAll() {
    renderRatings(document.getElementById("bewertung"), this.data, this.appState);
    this.renderCurrentTab();
  }

  renderCurrentTab() {
    if (this.currentTab === "ergebnis") {
      renderResults(document.getElementById("ergebnis"), this.data, this.appState);
    }
    if (this.currentTab === "bericht") {
      renderReport(document.getElementById("bericht"), this.data, this.appState);
    }
    if (formNameByTab[this.currentTab]) {
      renderSpecificForm(document.getElementById(this.currentTab), this.data, formNameByTab[this.currentTab]);
    }
    if (this.currentTab === "fachlich") {
      renderFreeTexts(document.getElementById("fachlich"), this.data, this.appState);
    }
    if (this.currentTab === "daten") {
      renderDataOverview(document.getElementById("daten"), this.data);
    }
  }

  async copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text || "");
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text || "";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}
