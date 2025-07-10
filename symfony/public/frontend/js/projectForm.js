import { apiFetch } from './api.js';
import {showSpinner, hideSpinner, formatDateToBackend} from './utils.js';


export function openProjectModal(project = null) {
    const modal = document.getElementById('project-modal');
    const form = document.getElementById('project-form');
    const title = document.getElementById('modal-title');

    modal.classList.remove('hidden');
    title.innerText = project ? 'Edit Project' : 'Create Project';

    if (project) {
        form['project-id'].value = project.id;
        form['project-name'].value = project.name;
        form['project-description'].value = project.description || '';
        form['project-deadline'].value = project.deadline || '';
    } else {
        form.reset();
        form['project-id'].value = '';
    }
}

export async function handleFormSubmit(currentPage, reloadCallback) {
    const form = document.getElementById('project-form');

    const id = form['project-id'].value;
    const task = {
        name: form['project-name'].value,
        description: form['project-description'].value || '',
        deadline: formatDateToBackend(form['project-deadline'].value),
    };

    showSpinner('loading-spinner-modal');

    const url = id
        ? `http://localhost:8080/api/projects/${id}`
        : `http://localhost:8080/api/projects`;

    const method = id ? 'PUT' : 'POST';
    const res = await apiFetch(url, {
        method,
        body: JSON.stringify(task)
    });

    hideSpinner('loading-spinner-modal');   

    if (res.ok) {
        document.getElementById('project-modal').classList.add('hidden');
        reloadCallback(currentPage);
    } else {
        alert('Failed to save project');
    }
}

export async function editProject(id, openModal) {
    showSpinner();

    const res = await apiFetch(`http://localhost:8080/api/projects/${id}`);
    const task = await res.json();

    hideSpinner();
    openModal(task);
}

export async function deleteProject(id, currentPage, reloadCallback) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    showSpinner();

    await apiFetch(`http://localhost:8080/api/projects/${id}`, {
        method: 'DELETE'
    });

    hideSpinner();
    reloadCallback(currentPage);
}