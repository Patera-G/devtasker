let currentPage = 1;

export function getCurrentPage() {
  return currentPage;
}

export function resetPage() {
  currentPage = 1;
}

export function nextPage(callback) {
  currentPage++;
  callback(currentPage);
}

export function prevPage(callback) {
  if (currentPage > 1) {
    currentPage--;
    callback(currentPage);
  }
}

export function setupNavListeners() {
  ['tasks', 'projects', 'index'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        window.location.href = `${id}.html`;
      });
    }
  });
}