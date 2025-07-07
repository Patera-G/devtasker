let currentPage = 1;
const limit = 5;

async function loadTasks() {
    const res = await apiFetch(`http://localhost:8080/api/tasks?page=${currentPage}&limit=${limit}`);

    if (res.status === 401) {
        alert('Unauthorized. Please log in again.');
        window.location.href = 'index.html';
        return;
    }

    const data = await res.json();
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    data.data.forEach(task => {console.log('Appending task:', task.title);
        const li = document.createElement('li');
        li.textContent = `${task.title} - [${task.status}]`;
        list.appendChild(li);
    });

    document.getElementById('page-info').textContent = `Page ${data.page} / ${Math.ceil(data.total / data.limit)}`;
}

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