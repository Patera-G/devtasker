import { nextPage, prevPage, resetPage, getCurrentPage,setupNavListeners } from './nav.js';
import { loadProjects, viewTasksByProject } from './projectUI.js';
import { openProjectModal, editProject, deleteProject, handleFormSubmit } from './projectForm.js';
import {showSpinner, hideSpinner} from './utils.js'

window.addEventListener('DOMContentLoaded', async () => {
    showSpinner();
    setupNavListeners();
    await loadProjects();
});

document.getElementById('filter-btn').addEventListener('click', () => {
    resetPage();
    loadProjects(getCurrentPage());
});

document.getElementById('project-form').addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(getCurrentPage(), loadProjects);
});

document.getElementById('modal-cancel').addEventListener('click', () => {
    document.getElementById('project-modal').classList.add('hidden');
});

window.openProjectModal = openProjectModal;
window.editProject = (id) => editProject(id, openProjectModal);
window.deleteProject = (id) => deleteProject(id, getCurrentPage(), loadProjects);
window.viewTasksByProject = (id) => viewTasksByProject(id);
window.nextPage = () => nextPage(loadTasks);
window.prevPage = () => prevPage(loadTasks);