document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const taskCountSpan = document.getElementById('task-count');

    // Load tasks from LocalStorage
    let tasks = JSON.parse(localStorage.getItem('neonTasks')) || [];

    function saveTasks() {
        localStorage.setItem('neonTasks', JSON.stringify(tasks));
        updateCount();
    }

    function updateCount() {
        const activeTasks = tasks.filter(t => !t.completed).length;
        taskCountSpan.textContent = activeTasks;
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            createTaskElement(task);
        });
        updateCount();
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        if (task.completed) {
            li.classList.add('completed');
        }

        const span = document.createElement('span');
        span.classList.add('task-text');
        span.textContent = task.text;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('task-actions');

        const checkBtn = document.createElement('button');
        checkBtn.classList.add('action-btn', 'check-btn');
        checkBtn.innerHTML = '✔';
        checkBtn.title = 'Mark as Completed';
        checkBtn.addEventListener('click', () => toggleTask(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('action-btn', 'delete-btn');
        deleteBtn.innerHTML = '✖';
        deleteBtn.title = 'Delete Task';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        actionsDiv.appendChild(checkBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(actionsDiv);

        taskList.appendChild(li);
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text === '') return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks(); // Re-render whole list is easiest for simple apps, or optimization: prepend one element
        taskInput.value = '';
    }

    function toggleTask(id) {
        tasks = tasks.map(t => {
            if (t.id === id) {
                return { ...t, completed: !t.completed };
            }
            return t;
        });
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }

    addBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Initial Render
    renderTasks();
});
