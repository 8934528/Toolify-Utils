let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    
    if (title === '') {
        alert('Please enter a task title');
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        description: description,
        completed: false,
        addedAt: new Date().toLocaleString(),
    };
 
    tasks.push(task);
    saveTasks();
    renderTasks();
    
    // Clear form
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    
    // Focus back on title
    document.getElementById('taskTitle').focus();
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
    }
}

function toggleComplete(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks();
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
        taskCountElement.textContent = 'No tasks';
    } else if (completedTasks === totalTasks) {
        taskCountElement.textContent = `All ${totalTasks} tasks completed!`;
    } else {
        taskCountElement.textContent = `${completedTasks} of ${totalTasks} tasks completed`;
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fi fi-rr-clipboard-list empty-icon"></i>
                <h3>No tasks yet</h3>
                <p>Add your first task using the form above</p>
            </div>
        `;
        updateTaskCount();
        return;
    }
    
    taskList.innerHTML = '';
    
    // Sort tasks: incomplete first, then by date added
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return new Date(b.addedAt) - new Date(a.addedAt);
    });
    
    sortedTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'task-completed' : ''}`;
        
        taskElement.innerHTML = `
            <div class="task-content">
                <div class="task-title">
                    ${task.completed ? '<i class="fi fi-sr-check-circle"></i>' : '<i class="fi fi-rr-circle"></i>'}
                    ${task.title}
                </div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                <div class="task-meta">
                    <span><i class="fi fi-rr-clock"></i> Added: ${task.addedAt}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn complete-btn" onclick="toggleComplete(${task.id})" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                    ${task.completed ? '<i class="fi fi-sr-check"></i>' : '<i class="fi fi-rr-check"></i>'}
                </button>
                <button class="task-btn delete-btn" onclick="deleteTask(${task.id})" title="Delete task">
                    <i class="fi fi-rr-trash"></i>
                </button>
            </div>
        `;
        
        taskList.appendChild(taskElement);
    });
    
    updateTaskCount();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    
    // Add event listener for Enter key in title field
    document.getElementById('taskTitle').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});