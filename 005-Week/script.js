const addBtn = document.querySelector('.add-btn');
const allBtn = document.querySelector('[data-filter="all"]');
const activeBtn = document.querySelector('[data-filter="active"]');
const completedBtn = document.querySelector('[data-filter="completed"]');
const clearCompletedBtn = document.querySelector('.clear-btn');
const todoInput = document.getElementById('todo-input');
let currentFilter = 'all';

function init() {
    setupEventListeners();
    populateToDoList();
    updateRemainingCount();
    displaytoDoItems(getStoredToDoItems());
    console.log("App initialized successfully!");
}

init();

function populateToDoList() {
    const todoList = localStorage.getItem('todoItems');
    if (todoList) {
        document.getElementById('todo-list').innerHTML = JSON.parse(todoList);
        console.log("To-Do list populated from local storage.");
    } else {
        console.log("No to-do items found in local storage.");
    }
}

let errorTimeout;

function addToDoItem() {
    const item = document.getElementById('todo-input').value;
    if (!item) {
        let errorMessage = document.getElementById('error-message');
        errorMessage.textContent = "Please enter a to-do item.";
        errorMessage.style.display = "block";
        errorMessage.style.opacity = 1;
        if (errorTimeout) {
            clearTimeout(errorTimeout);
        }
        errorTimeout = setTimeout(() => {
            errorMessage.style.opacity = 0;
        }, 3000);
        return;
    }

    let uniqueID = Date.now();
    toDoItem = document.querySelector('#todo-input').value;

    addToDoItemToStorage(uniqueID, toDoItem, false);
    displaytoDoItems(getStoredToDoItems());
    updateRemainingCount();
    document.getElementById('todo-input').value = '';
    document.getElementById('todo-input').focus();
}

function toggleToDoItemCompletion(uniqueID, completed) {
    const todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
    const itemIndex = todoItems.findIndex(item => item.uniqueID === uniqueID);
    if (itemIndex !== -1) {
        todoItems[itemIndex].completed = completed;
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        console.log(`To-Do item ${uniqueID} marked as ${completed ? 'completed' : 'active'}.`);
    } else {
        console.log(`To-Do item with ID ${uniqueID} not found in storage.`);
    }
}

function saveEditedToDoItem(uniqueID, newTask) {
    const todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
    const itemIndex = todoItems.findIndex(item => item.uniqueID === uniqueID);
    if (itemIndex !== -1) {
        todoItems[itemIndex].task = newTask;
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        console.log(`To-Do item ${uniqueID} updated to: ${newTask}`);
        displaytoDoItems(getStoredToDoItems());
    } else {
        console.log(`To-Do item with ID ${uniqueID} not found in storage.`);
    }
}

function deleteToDoItem(uniqueID) {
    const todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
    const updatedItems = todoItems.filter(item => item.uniqueID !== uniqueID);
    localStorage.setItem('todoItems', JSON.stringify(updatedItems));
    console.log(`To-Do item ${uniqueID} deleted from storage.`);
}

function addToDoItemToStorage(uniqueID, task, completed = false) {
    const item = { uniqueID, task, completed };
    const todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
    todoItems.push(item);
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

function getStoredToDoItems() {
    const todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
    return todoItems;
}

function filterToDoItems(item, filter) {
    if (filter === 'all') {
        return true;
    } else if (filter === 'active') {
        return !item.completed;
    } else if (filter === 'completed') {
        return item.completed;
    }
    return false;
}

function displaytoDoItems(items) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    items.forEach(item => {
        if (filterToDoItems(item, currentFilter)) {
            const toDoItem = document.createElement('li');
            toDoItem.classList.add('todo-item');
            if (item.completed) {
                toDoItem.classList.add('completed');
            }
            toDoItem.setAttribute('data-id', item.uniqueID);
            toDoItem.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${item.completed ? 'checked' : ''}/>
            <span class="todo-text">${item.task}</span>
            <button class="edit-btn" aria-label="Edit todo item">Edit</button>
            <button class="delete-btn" aria-label="Delete todo item">Delete</button>
        `;
            toDoItem.querySelector('.todo-checkbox').addEventListener('change', (e) => {
                toggleToDoItemCompletion(item.uniqueID, e.target.checked);
                toDoItem.classList.toggle('completed', e.target.checked);
                updateRemainingCount();
            });

            toDoItem.querySelector('.delete-btn').addEventListener('click', () => {
                deleteToDoItem(item.uniqueID);
                toDoItem.remove();
                updateRemainingCount();
            });

            toDoItem.querySelector('.edit-btn').addEventListener('click', () => {
                editToDoItem(toDoItem);
            });
            todoList.appendChild(toDoItem);
        }
    });
    updateRemainingCount();
    console.log("Displayed to-do items:", items);
}

function editToDoItem(toDoItem) {
    const todoText = toDoItem.querySelector('.todo-text');
    const currentText = todoText.textContent;
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = currentText;
    editInput.classList.add('edit-input');
    editInput.classList.add('todo-text');
    todoText.replaceWith(editInput);
    editInput.focus();

    const editButton = toDoItem.querySelector('.edit-btn');
    editButton.style.display = 'none';
    const deleteButton = toDoItem.querySelector('.delete-btn');
    deleteButton.style.display = 'none';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.classList.add('save-btn');
    toDoItem.appendChild(saveButton);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.classList.add('cancel-btn');
    cancelButton.addEventListener('click', () => { });
    toDoItem.appendChild(cancelButton);

    cancelButton.addEventListener('click', () => {
        const originalTodoText = document.createElement('span');
        originalTodoText.classList.add('todo-text');
        originalTodoText.textContent = currentText;
        editInput.replaceWith(originalTodoText);
        editButton.style.display = 'inline';
        deleteButton.style.display = 'inline';
        saveButton.remove();
        cancelButton.remove();
    });

    saveButton.addEventListener('click', () => {
        const newTask = editInput.value.trim();
        if (newTask) {
            const uniqueID = parseInt(toDoItem.getAttribute('data-id'));
            saveEditedToDoItem(uniqueID, newTask);
            const newTodoText = document.createElement('span');
            newTodoText.classList.add('todo-text');
            newTodoText.textContent = newTask;
            editInput.replaceWith(newTodoText);
            editButton.style.display = 'inline';
            deleteButton.style.display = 'inline';
            saveButton.remove();
            cancelButton.remove();
        }
    });

    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const newTask = editInput.value.trim();
            if (newTask) {
                const uniqueID = parseInt(toDoItem.getAttribute('data-id'));
                saveEditedToDoItem(uniqueID, newTask);
                const newTodoText = document.createElement('span');
                newTodoText.classList.add('todo-text');
                newTodoText.textContent = newTask;
                editInput.replaceWith(newTodoText);
                editButton.disabled = false;
            }
        } else if (e.key === 'Escape') {
            const originalTodoText = document.createElement('span');
            originalTodoText.classList.add('todo-text');
            originalTodoText.textContent = currentText;
            editInput.replaceWith(originalTodoText);
            editButton.disabled = false;
        }
    });
}

function updateRemainingCount() {
    const todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
    const remainingCount = todoItems.filter(item => !item.completed).length;
    const itemText = remainingCount === 1 ? 'item' : 'items';
    document.getElementById('todo-count').textContent = `${remainingCount} ${itemText} remaining`;
}

function clearCompletedItems() {
    const todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];
    const activeItems = todoItems.filter(item => !item.completed);
    localStorage.setItem('todoItems', JSON.stringify(activeItems));
    displaytoDoItems(activeItems);
    console.log("Clear Completed button clicked!");
}

function applyFilter(filter) {
    currentFilter = filter;
    const todoItems = getStoredToDoItems();
    displaytoDoItems(todoItems);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });
}

function setupEventListeners() {
    addBtn.addEventListener('click', addToDoItem);
    allBtn.addEventListener('click', () => applyFilter('all'));
    activeBtn.addEventListener('click', () => applyFilter('active'));
    completedBtn.addEventListener('click', () => applyFilter('completed'));
    clearCompletedBtn.addEventListener('click', clearCompletedItems);
    todoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addToDoItem();
        }
    });
    console.log("Event listeners set up successfully!");
}