import { apiFetch } from './api.js';

export async function loadTasks(page = 1) {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('hidden');

    const status = document.getElementById('status-filter').value;
    const priority = document.getElementById('priority-filter').value;
    let projectId = document.getElementById('project-filter').value;
    const sortBy = document.getElementById('sort-by').value;

    if (!projectId) {
        projectId = localStorage.getItem('selectedProjectId');
        if (projectId) {
            const projectSelect = document.getElementById('project-filter');
            if (projectSelect) projectSelect.value = projectId;
            localStorage.removeItem('selectedProjectId'); // optional
        }
    }

    const params = new URLSearchParams({
        page,
        limit: 5
    });

    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    if (projectId) params.append('projectId', projectId);
    if (sortBy) {
        const [field, dir] = sortBy.split('_');
        params.append('sort', field);
        params.append('direction', dir);
    }

    const res = await apiFetch(`http://localhost:8080/api/tasks?${params.toString()}`);
    const data = await res.json();

    spinner.classList.add('hidden');

    if (!res.ok) {
        alert('Failed to load tasks');
        return;
    }

    renderTasks(data.data);
    document.getElementById('page-info').textContent =
        `Page ${data.page} / ${Math.ceil(data.total / data.limit)}`;
}

function renderTasks(tasks) {
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');

        li.innerHTML = `
            <div class="bg-white shadow rounded-xl p-4 mb-4 border-l-4 border-indigo-500">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-bold text-lg text-indigo-700">${task.title}</h3>
                        <p class="text-sm text-gray-500 italic mb-1">${task.project?.name || 'No Project'}</p>
                        <p class="text-sm text-gray-600 mb-2">${task.description || 'No description'}</p>
                    </div>
                    <div class="text-right space-y-1 text-sm text-gray-600">
                        <p>Status: <span class="capitalize">${task.status}</span></p>
                        <p>Priority: <span class="capitalize">${task.priority}</span></p>
                        <p>Due: ${task.dueDate || 'N/A'}</p>
                    </div>
                </div>

                <div class="flex justify-end space-x-2 pt-2 border-t pt-3">
                    <button onclick="editTask('${task.id}')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
                    <button onclick="deleteTask('${task.id}')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </div>
            </div>
        `;

        li.classList.add('transition-opacity', 'opacity-0');
        setTimeout(() => li.classList.remove('opacity-0'), 10);
        list.appendChild(li);
    });
}

export async function populateProjectFilter() {
    const res = await apiFetch('http://localhost:8080/api/projects');
    if (!res.ok) return;

    const projects = await res.json();
    const select = document.getElementById('project-filter');
    select.innerHTML = `<option value="">All</option>`; // reset with default

    projects.data.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        select.appendChild(option);
    });
}


export function nextPage() {
  currentPage++;
  loadTasks();
}

export function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadTasks();
    }
}