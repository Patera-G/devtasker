let currentPage = 1;
const limit = 5;
const modal = document.getElementById('task-modal');
const modalTitle = document.getElementById('modal-title');
const form = document.getElementById('task-form');
const cancelBtn = document.getElementById('modal-cancel');

async function loadTasks() {
    const status = document.getElementById('status-filter').value;
    const priority = document.getElementById('priority-filter').value;
    const sortBy = document.getElementById('sort-by').value;
    const spinner = document.getElementById('loading-spinner');

    spinner.classList.remove('hidden');

    const params = new URLSearchParams({
        page: currentPage,
        limit: limit,
    });

    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    if (sortBy) {
    const [field, dir] = sortBy.split('_');
        params.append('sort', field);
        params.append('direction', dir);
    }

    const res = await apiFetch(`http://localhost:8080/api/tasks?${params.toString()}`);

    const data = await res.json();
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    if (!res.ok) {
        alert('Failed to load tasks');
        spinner.classList.add('hidden');
        return;
    }

    spinner.classList.add('hidden');
    data.data.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
        <div>
            <h3 class="font-semibold text-lg">${task.title}</h3>
            <p class="text-sm text-gray-600">Status: <span class="capitalize">${task.status}</span></p>
            <p class="text-sm text-gray-600">Priority: <span class="capitalize">${task.priority}</span></p>
            <p class="text-sm text-gray-600">Due: ${task.dueDate || 'N/A'}</p>
        </div>

        <div class="space-x-2">
            <button onclick="editTask('${task.id}')"
                    class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
            <button onclick="deleteTask('${task.id}')"
                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
        </div>
        `;
        li.classList.add('transition-opacity', 'opacity-0');
        setTimeout(() => li.classList.remove('opacity-0'), 10);
        list.appendChild(li);
    });

    document.getElementById('page-info').textContent = `Page ${data.page} / ${Math.ceil(data.total / data.limit)}`;
}

async function openTaskModal(task = null) {
    
    modal.classList.remove('hidden');

    if (task) {
        modalTitle.innerText = 'Edit Task';
        form['task-id'].value = task.id;
        form['task-title'].value = task.title;
        form['task-priority'].value = task.priority;
        form['task-status'].value = task.status;
        form['task-due'].value = task.dueDate || '';
        form['task-due'].value = task.project.id || '';
        form['task-project'].value = task.project?.id || '';
    } else {
        modalTitle.innerText = 'Create Task';
        form.reset();
        form['task-id'].value = '';
    }
}

function closeTaskModal() {
    modal.classList.add('hidden');
}

cancelBtn.addEventListener('click', closeTaskModal);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = form['task-id'].value;
    const task = {
        title: form['task-title'].value,
        priority: form['task-priority'].value,
        status: form['task-status'].value,
        deadline: form['task-due'].value || null,
        project: `/api/projects/${form['task-project'].value}`
    };
    const spinner = document.getElementById('loading-spinner-modal');

    spinner.classList.remove('hidden');

    const url = id
        ? `http://localhost:8080/api/tasks/${id}`
        : `http://localhost:8080/api/tasks`;

    const method = id ? 'PUT' : 'POST';console.log(task);

    const res = await apiFetch(url, {
        method,
        body: JSON.stringify(task)
    });

    if (res.ok) {
        closeTaskModal();
        loadTasks();
    } else {
        alert('Failed to save task');
    }
    spinner.classList.add('hidden');
});

async function editTask(id) {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('hidden');
    const res = await apiFetch(`http://localhost:8080/api/tasks/${id}`);
    const task = await res.json();
    spinner.classList.add('hidden');
    openTaskModal(task);
}

async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.remove('hidden');

    await apiFetch(`http://localhost:8080/api/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}

async function loadProjects() {
  const select = document.getElementById('task-project');
  const res = await apiFetch('http://localhost:8080/api/projects');
  const projects = await res.json();

  select.innerHTML = projects.map(p => `
    <option value="${p.id}">${p.name}</option>
  `).join('');
}


document.getElementById('filter-btn').addEventListener('click', () => {
    currentPage = 1;
    loadTasks();
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('jwt_token');
    window.location.href = 'index.html';
});

function nextPage() {
    currentPage++;
    loadTasks();    
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadTasks();
    }
}

window.addEventListener('DOMContentLoaded', loadTasks);