import { apiFetch } from './api.js';
import { showSpinner, hideSpinner, getSortParams } from './utils.js';

export async function loadProjects(page = 1) {
    showSpinner();

    const sortBy = document.getElementById('sort-by').value;
    const { sort, direction } = getSortParams(sortBy);

    const params = new URLSearchParams({
        page,
        limit: 5
    });

    if (sort) params.append('sort', sort);
    if (direction) params.append('direction', direction);

    const res = await apiFetch(`http://localhost:8080/api/projects?${params.toString()}`);
    const data = await res.json();

    hideSpinner();


    if (!res.ok) {
        alert('Failed to load tasks');
        return;
    }

    renderProjects(data.data);
    document.getElementById('page-info').textContent =
        `Page ${data.page} / ${Math.ceil(data.total / data.limit)}`;
}

function renderProjects(projects) {
    const list = document.getElementById("projects-list");
    list.innerHTML = '';

    projects.forEach(project => {
        const li = document.createElement('li');

        li.innerHTML = `
        <div class="bg-white shadow rounded-xl p-4 mb-4 border-l-4 border-blue-500">
            <div class="flex justify-between items-start mb-2">
            <div>
                <h3 class="font-bold text-lg text-blue-700">${project.name}</h3>
                <p class="text-sm text-gray-600 italic mb-1">${project.description || 'No description provided.'}</p>
                <p class="text-sm text-gray-500">Deadline: ${project.deadline || 'No deadline'}</p>
            </div>
            </div>

            <div class="flex justify-end space-x-2 pt-2 border-t pt-3">
            <button onclick="editProject('${project.id}')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
            <button onclick="deleteProject('${project.id}')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            <button onclick="viewTasksByProject('${project.id}')" class="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">View Tasks</a>
            </div>
        </div>
        `;

        li.classList.add('transition-opacity', 'opacity-0');
        setTimeout(() => li.classList.remove('opacity-0'), 10);
        list.appendChild(li);
    });
}

export function viewTasksByProject(projectId) {
    localStorage.setItem('selectedProjectId', projectId);
    window.location.href = 'tasks.html';
}