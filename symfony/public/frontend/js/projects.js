import { apiFetch } from './api.js';
import { setupNavListeners } from './nav.js';
import { loadProjects, viewTasksByProject, nextPage, prevPage } from './projectUI.js';
import { openProjectModal, editProject, deleteProject, handleFormSubmit } from './projectForm.js';

let currentPage = 1;

window.addEventListener('DOMContentLoaded', async () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('hidden');
    setupNavListeners();
    loadProjects();
});

document.getElementById('filter-btn').addEventListener('click', () => {
    currentPage = 1;
    loadProjects(currentPage);
});

document.getElementById('project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(currentPage, loadProjects);
});

document.getElementById('modal-cancel').addEventListener('click', () => {
    document.getElementById('project-modal').classList.add('hidden');
});

window.openProjectModal = openProjectModal;
window.editProject = (id) => editProject(id, openProjectModal);
window.deleteProject = (id) => deleteProject(id, currentPage, loadProjects);
window.viewTasksByProject = (id) => viewTasksByProject(id);
window.nextPage = () => loadProjects(++currentPage);
window.prevPage = () => {
    if (currentPage > 1) loadProjects(--currentPage);
};