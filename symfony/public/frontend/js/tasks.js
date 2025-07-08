import { loadTasks, nextPage, prevPage } from './taskUI.js';
import { openTaskModal, editTask, deleteTask, loadProjects, handleFormSubmit } from './taskForm.js';

let currentPage = 1;

window.addEventListener('DOMContentLoaded', async () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('hidden');
    await loadProjects();
    await loadTasks(currentPage);
    spinner.classList.add('hidden');
});

document.getElementById('filter-btn').addEventListener('click', () => {
    currentPage = 1;
    loadTasks(currentPage);
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('jwt_token');
    window.location.href = 'index.html';
});

document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(currentPage, loadTasks);
});

document.getElementById('modal-cancel').addEventListener('click', () => {
    document.getElementById('task-modal').classList.add('hidden');
});

window.openTaskModal = openTaskModal;
window.editTask = (id) => editTask(id, openTaskModal);
window.deleteTask = (id) => deleteTask(id, currentPage, loadTasks);
window.nextPage = () => loadTasks(++currentPage);
window.prevPage = () => {
    if (currentPage > 1) loadTasks(--currentPage);
};
