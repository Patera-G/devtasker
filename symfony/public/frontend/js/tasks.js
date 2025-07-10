import { nextPage, prevPage, resetPage, getCurrentPage, setupNavListeners } from './nav.js';
import { loadTasks, populateProjectFilter } from './taskUI.js';
import { openTaskModal, editTask, deleteTask, loadProjects, handleFormSubmit } from './taskForm.js';
import {showSpinner, hideSpinner} from './utils.js'

window.addEventListener('DOMContentLoaded', async () => {
    showSpinner();
    setupNavListeners();
    await populateProjectFilter();
    await loadProjects();
    await loadTasks(getCurrentPage());
});

document.getElementById('filter-btn').addEventListener('click', () => {
    resetPage();
    loadTasks(getCurrentPage());
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
window.deleteTask = (id) => deleteTask(id, getCurrentPage(), loadTasks);
window.nextPage = () => nextPage(loadTasks);
window.prevPage = () => prevPage(loadTasks);
