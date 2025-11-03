import {todoArray, projectsArray, saveStorage, loadStorage} from './storage';
import {Todo} from './todo-note';
import {buildForm} from "./add-todo";

class TodoApp {
    constructor() {
        this.todos = todoArray;
        this.projects = projectsArray;
    }

    init() {
        loadStorage();
        this.loadUI();
        this.loadTodos();
    }

    loadUI() {
        const container = document.querySelector('.todo-app');
        const addTodoBtn = document.createElement('button');
        addTodoBtn.textContent = 'Add Todo';

        addTodoBtn.addEventListener('click', (e) => {
            this.modal = buildForm(() => this.loadTodos());
            this.modal.showModal();
        });

        container.appendChild(addTodoBtn);

        const todoList = document.createElement('div');
        todoList.classList.add('todo-list');
        container.appendChild(todoList);
    }

    loadTodos() {
        const todoList = document.querySelector(".todo-list");
        const todoCards = document.querySelectorAll(".todo-card");
        todoCards.forEach((card) => card.remove());

        todoArray.forEach((todo) => {
            todoList.appendChild(this.renderTodo(todo));
        });
    }

    updateCompletedCheckbox(e, todo) {
        todo.completed = e.target.checked;
        saveStorage();
        this.loadTodos();
    }

    renderTodo(todo) {
        const todoCard = document.createElement('div');
        todoCard.classList.add('todo-card');

        if (todo.completed) {
            todoCard.classList.add('completed');  // Add class during render
        }

        const completed = document.createElement('input');
        completed.setAttribute('type', 'checkbox');
        completed.classList.add('todo-completed');
        completed.classList.add(todo.completed);
        completed.checked = todo.completed;
        completed.addEventListener('change', (e) => {
            this.updateCompletedCheckbox(e, todo);
        })

        const idDiv = document.createElement('div');
        idDiv.classList.add('todo-id');
        idDiv.textContent = todo.id;

        const heading = document.createElement('div');
        heading.className = 'todo-title';
        heading.textContent = todo.text;

        const dueDate = document.createElement('div');
        dueDate.className = 'todo-due-date';
        dueDate.textContent = todo.dueDate.toString();

        const priority = document.createElement('div');
        priority.className = 'todo-priority';
        priority.classList.add(todo.priority);
        priority.textContent = todo.priority;

        const labelDiv = document.createElement('div');
        labelDiv.classList.add('todo-labels');
        todo.labels.forEach(item => {
            const label = document.createElement('span');
            label.className = 'todo-label';
            label.textContent = String(item);
            labelDiv.appendChild(label);
        })

        todoCard.appendChild(completed);
        todoCard.appendChild(idDiv);
        todoCard.appendChild(heading);
        todoCard.appendChild(dueDate);
        todoCard.appendChild(priority);
        todoCard.appendChild(labelDiv);

        return todoCard;
    }
}

export {TodoApp};
