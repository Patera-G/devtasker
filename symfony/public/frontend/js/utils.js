export function showSpinner(id = 'loading-spinner') {
  document.getElementById(id).classList.remove('hidden');
}

export function hideSpinner(id = 'loading-spinner') {
  document.getElementById(id).classList.add('hidden');
}

export function formatDateToBackend(value) {
  if (!value) return null;
  const date = new Date(value);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function getSortParams(sortValue) {
  if (!sortValue) return {};
  const [field, direction] = sortValue.split('_');
  return { sort: field, direction };
}