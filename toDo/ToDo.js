let tasks = [];

function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    if (title === '' || description === '') return;

    const task = {
        id: Date.now(),
        title: title,
        description: description,
        completed: false,
        addedAt: new Date().toLocaleString(),
    };
 
    tasks.push(task);
    renderTasks();
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'flex-row p-2 border-b border-border';

        taskElement.innerHTML = `
            <div><span class="font-medium">${task.title}</span> - <span class="text-muted">${task.description}</span></div>
            <button class="bg-destructive text-destructive-foreground hover:bg-destructive/80 p-1 rounded-full" onclick="deleteTask(${task.id})">X</button>
        `;

        taskList.appendChild(taskElement);
    });
}
