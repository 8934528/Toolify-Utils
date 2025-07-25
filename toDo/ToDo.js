// ================= SESSION VALIDATION =================
function validateSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    const storedSession = sessionStorage.getItem('currentSession');

    if (!sessionId || !storedSession) {
        window.location.href = '../index.html';
        return false;
    }

    const { id, expiry } = JSON.parse(storedSession);

    if (sessionId !== id || new Date().getTime() > expiry) {
        sessionStorage.removeItem('currentSession');
        window.location.href = '../index.html';
        return false;
    }

    return true;
}

function modifyInternalLinks() {
    const storedSession = sessionStorage.getItem('currentSession');
    if (!storedSession) return;

    const { id } = JSON.parse(storedSession);

    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');

        // Skip if external link, mailto, tel, or already has session
        if (!href || href.startsWith('http') || href.startsWith('mailto') ||
            href.startsWith('tel') || href.startsWith('#') || href.includes('session=')) {
            return;
        }

        // Add session parameter
        const separator = href.includes('?') ? '&' : '?';
        link.setAttribute('href', `${href}${separator}session=${id}`);
    });
}

// Validate session on page load
document.addEventListener('DOMContentLoaded', function () {
    if (!validateSession()) return;
    modifyInternalLinks();

    // Initialize Toast
    const toastEl = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastEl);
    let currentTaskId = null;

    // Task Management
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    function showToast(title, message, type = 'info') {
        const toastTitle = document.getElementById('toast-title');
        const toastMessage = document.getElementById('toast-message');

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        // Remove previous color classes
        toastEl.querySelector('.toast-header').classList.remove(
            'bg-primary', 'bg-success', 'bg-danger', 'bg-warning'
        );

        // Add appropriate color class
        switch (type) {
            case 'success':
                toastEl.querySelector('.toast-header').classList.add('bg-success', 'text-white');
                break;
            case 'error':
                toastEl.querySelector('.toast-header').classList.add('bg-danger', 'text-white');
                break;
            case 'warning':
                toastEl.querySelector('.toast-header').classList.add('bg-warning', 'text-dark');
                break;
            default:
                toastEl.querySelector('.toast-header').classList.add('bg-primary', 'text-white');
        }

        toast.show();
    }

    function addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();

        if (!title) {
            showToast('Validation Error', 'Please enter a task title', 'error');
            document.getElementById('taskTitle').focus();
            return;
        }

        const task = {
            id: Date.now(),
            title,
            description,
            completed: false,
            addedAt: new Date().toLocaleString(),
        };

        tasks.push(task);
        saveTasks();
        renderTasks();

        // Clear form
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskTitle').focus();

        showToast('Task Added', 'New task has been added successfully', 'success');
    }

    function promptDelete(taskId) {
        currentTaskId = taskId;
        deleteModal.show();
    }

    function deleteTask() {
        tasks = tasks.filter(t => t.id !== currentTaskId);
        saveTasks();
        renderTasks();
        deleteModal.hide();
        showToast('Task Deleted', 'The task has been removed', 'warning');
    }

    function toggleComplete(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();

            const message = task.completed ?
                'Task marked as complete' : 'Task marked as incomplete';
            showToast('Task Updated', message, 'success');
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskCount();
    }

    function updateTaskCount() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const taskCountElement = document.getElementById('taskCount');

        if (totalTasks === 0) {
            taskCountElement.textContent = '0 tasks';
            taskCountElement.className = 'badge bg-secondary rounded-pill';
        } else if (completedTasks === totalTasks) {
            taskCountElement.textContent = `All ${totalTasks} completed`;
            taskCountElement.className = 'badge bg-success rounded-pill';
        } else {
            taskCountElement.textContent = `${completedTasks}/${totalTasks} completed`;
            taskCountElement.className = 'badge bg-primary rounded-pill';
        }
    }

    function renderTasks() {
        const taskList = document.getElementById('taskList');

        if (tasks.length === 0) {
            taskList.innerHTML = `
            <div class="text-center p-5 text-muted">
                <i class="fi fi-rr-clipboard-list fs-1 mb-3"></i>
                <h4>No tasks yet</h4>
                <p>Add your first task using the form</p>
            </div>
        `;
            updateTaskCount();
            return;
        }

        taskList.innerHTML = '';

        // Sort tasks: incomplete first, then by date added (newest first)
        const sortedTasks = [...tasks].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(b.addedAt) - new Date(a.addedAt);
        });

        sortedTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'task-completed' : ''}`;

            taskElement.innerHTML = `
            <div class="d-flex justify-content-between">
                <div>
                    <div class="task-title">
                        <i class="fi ${task.completed ? 'fi-sr-check-circle' : 'fi-rr-circle'} me-2"></i>
                        ${task.title}
                    </div>
                    ${task.description ? `<div class="task-description mt-2">${task.description}</div>` : ''}
                    <div class="task-meta mt-2">
                        <small><i class="fi fi-rr-clock me-1"></i>${task.addedAt}</small>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn complete-btn" onclick="toggleComplete(${task.id})" 
                        title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                        <i class="fi ${task.completed ? 'fi-sr-check' : 'fi-rr-check'}"></i>
                    </button>
                    <button class="task-btn delete-btn" onclick="promptDelete(${task.id})" title="Delete task">
                        <i class="fi fi-rr-trash"></i>
                    </button>
                </div>
            </div>
        `;

            taskList.appendChild(taskElement);
        });

        updateTaskCount();
    }

    // Initialize the app
    document.addEventListener('DOMContentLoaded', () => {
        // Validate session
        if (!validateSession()) return;
        modifyInternalLinks();

        // Initialize event listeners
        document.getElementById('confirmDelete').addEventListener('click', deleteTask);
        document.getElementById('taskTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });

        // Load tasks
        renderTasks();
    });
});

// ================= END SESSION VALIDATION =================

