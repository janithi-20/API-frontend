let allTasks = [];
let currentFilter = 'all';
let editingTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
    APIService.checkAuth();

    const username = localStorage.getItem('username') || 'User';
    document.getElementById('userDisplay').textContent = `Welcome, ${username}`;

    document.getElementById('addTaskBtn').addEventListener('click', handleAddTask);
    document.getElementById('taskInput').addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            handleAddTask();
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });

    document.getElementById('saveEditBtn').addEventListener('click', saveEditTask);

    loadTasks();
});

async function loadTasks() {
    showLoadingSpinner(true);
    allTasks = await APIService.getTasks();
    renderTasks();
    showLoadingSpinner(false);
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    let filteredTasks = allTasks;

    if (currentFilter === 'completed') {
        filteredTasks = allTasks.filter(task => Number(task.completed) === 1);
    } else if (currentFilter === 'pending') {
        filteredTasks = allTasks.filter(task => Number(task.completed) === 0);
    }

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state">No tasks found.</div>';
        return;
    }

    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${Number(task.completed) === 1 ? 'completed' : ''}">
            <input class="task-checkbox" type="checkbox" ${Number(task.completed) === 1 ? 'checked' : ''} onchange="toggleTaskComplete(${task.id})">
            <div class="task-content">
                <div class="task-text">${escapeHtml(task.task)}</div>
                <div class="task-date">${task.created_at ? new Date(task.created_at).toLocaleString() : ''}</div>
            </div>
            <div class="task-actions">
                <button class="btn-edit" type="button" onclick="openEditModal(${task.id}, ${JSON.stringify(task.task)})">Edit</button>
                <button class="btn-danger" type="button" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function handleAddTask() {
    const input = document.getElementById('taskInput');
    const task = input.value.trim();

    if (!task) {
        showTaskMessage('Enter a task first', false);
        return;
    }

    const button = document.getElementById('addTaskBtn');
    const originalText = button.textContent;
    button.textContent = 'Adding...';
    button.disabled = true;

    const result = await APIService.addTask(task);

    button.textContent = originalText;
    button.disabled = false;

    if (result.status) {
        input.value = '';
        showTaskMessage('Task added successfully', true);
        loadTasks();
    } else {
        showTaskMessage('Failed to add task', false);
    }
}

function openEditModal(taskId, taskText) {
    editingTaskId = taskId;
    document.getElementById('editTaskInput').value = taskText;
    document.getElementById('editModal').classList.remove('hidden');
}

function closeEditModal() {
    editingTaskId = null;
    document.getElementById('editModal').classList.add('hidden');
}

async function saveEditTask() {
    closeEditModal();
    showTaskMessage('Edit UI is ready, but backend update endpoint is not available yet.', true);
}

async function toggleTaskComplete(taskId) {
    const task = allTasks.find(item => Number(item.id) === Number(taskId));
    if (!task) return;
    task.completed = Number(task.completed) === 1 ? 0 : 1;
    renderTasks();
}

async function deleteTask(taskId) {
    if (!confirm('Delete this task?')) return;
    allTasks = allTasks.filter(task => Number(task.id) !== Number(taskId));
    renderTasks();
    showTaskMessage('Task removed from view. Add a delete endpoint to persist this.', true);
}

async function handleLogout() {
    await APIService.logout();
    window.location.href = 'index.html';
}

function showTaskMessage(message, isSuccess) {
    const element = document.getElementById('taskMessage');
    element.textContent = message;
    element.className = `form-message ${isSuccess ? 'success' : 'error'}`;
}

function showLoadingSpinner(show) {
    document.getElementById('loadingSpinner').classList.toggle('hidden', !show);
}

function escapeHtml(text) {
    return String(text)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
