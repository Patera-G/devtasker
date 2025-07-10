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