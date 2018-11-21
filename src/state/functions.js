export function getSavedState (key, type = 'local') {
  return JSON.parse(window[`${type}Storage`].getItem(key));
}

export function saveState (key, state, type = 'local') {
  window[`${type}Storage`].setItem(key, JSON.stringify(state));
}
