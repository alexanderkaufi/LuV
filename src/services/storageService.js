const storageKey = "luvStandaloneStateV2";

export function saveLocal(payload) {
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

export function loadLocal() {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : null;
}
