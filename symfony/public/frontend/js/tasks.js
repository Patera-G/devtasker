let currentPage = 1;
const limit = 5;

async function loadTasks() {
    const status = document.getElementById('status-filter').value;
    const priority = document.getElementById('priority-filter').value;
    const sortBy = document.getElementById('sort-by').value;

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

    data.data.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
            <h3 class="font-semibold text-lg">${task.title}</h3>
            <p class="text-sm text-gray-600">Status: <span class="capitalize">${task.status}</span></p>
            <p class="text-sm text-gray-600">Priority: <span class="capitalize">${task.priority}</span></p>
            <p class="text-sm text-gray-600">Due: ${task.dueDate || 'N/A'}</p>
            </div>
        `;
        list.appendChild(li);
    });

    document.getElementById('page-info').textContent = `Page ${data.page} / ${Math.ceil(data.total / data.limit)}`;
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