import { apiFetch } from './api.js';
import {showSpinner, hideSpinner, formatDateToBackend} from './utils.js';

export function openTaskModal(task = null) {
    const modal = document.getElementById('task-modal');
    const form = document.getElementById('task-form');
    const title = document.getElementById('modal-title');

    modal.classList.remove('hidden');
    title.innerText = task ? 'Edit Task' : 'Create Task';

    if (task) {
        form['task-id'].value = task.id;
        form['task-title'].value = task.title;
        form['task-priority'].value = task.priority;
        form['task-description'].value = task.description || '';
        form['task-status'].value = task.status;
        form['task-due'].value = task.dueDate || '';
        form['task-project'].value = task.project?.id || '';
    } else {
        form.reset();
        form['task-id'].value = '';
    }
}

export async function handleFormSubmit(currentPage, reloadCallback) {
    const form = document.getElementById('task-form');

    const id = form['task-id'].value;
    const task = {
        title: form['task-title'].value,
        description: form['task-description'].value || '',
        priority: form['task-priority'].value,
        status: form['task-status'].value,
        dueDate: formatDateToBackend(form['task-due'].value),
        projectId: parseInt(form['task-project'].value)
    };

    showSpinner('loading-spinner-modal');

    const url = id
        ? `http://localhost:8080/api/tasks/${id}`
        : `http://localhost:8080/api/tasks`;

    const method = id ? 'PUT' : 'POST';
    const res = await apiFetch(url, {
        method,
        body: JSON.stringify(task)
    });

    hideSpinner('loading-spinner-modal');   

    if (res.ok) {
        document.getElementById('task-modal').classList.add('hidden');
        reloadCallback(currentPage);
    } else {
        alert('Failed to save task');
    }
}

export async function editTask(id, openModal) {
    showSpinner();

    const res = await apiFetch(`http://localhost:8080/api/tasks/${id}`);
    const task = await res.json();

    hideSpinner();;
    openModal(task);
}

export async function deleteTask(id, currentPage, reloadCallback) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    showSpinner();

    await apiFetch(`http://localhost:8080/api/tasks/${id}`, {
        method: 'DELETE'
    });

    hideSpinner();
    reloadCallback(currentPage);
}

export async function loadProjects() {
    const select = document.getElementById('task-project');
    const res = await apiFetch('http://localhost:8080/api/projects');
    const projects = await res.json();

    select.innerHTML = projects.data.map(p => `
        <option value="${p.id}">${p.name}</option>
    `).join('');
}