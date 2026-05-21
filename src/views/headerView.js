export function syncFieldControls(appState, root = document) {
  Object.entries(appState.fields).forEach(([field, value]) => {
    const control = root.querySelector(`[data-field="${field}"]`);
    if (control) {
      control.value = value;
    }
  });
}
