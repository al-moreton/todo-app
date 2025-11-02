import {todoArray, projectsArray, saveStorage, loadStorage} from './storage';
import {Todo} from './todo-note';

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
            this.handleAddTodo(e);
            this.loadTodos();
        });

        container.appendChild(addTodoBtn);

        const todoList = document.createElement('div');
        todoList.classList.add('todo-list');
        container.appendChild(todoList);
    }

    // TODO add form
    handleAddTodo(e) {
        const newTodo = new Todo(
            'test',
            'date',
            'high',
            ['shopping', 'work'],
            null,
        );
        todoArray.push(newTodo);
        saveStorage();
    }

    loadTodos() {
        const todoList = document.querySelector(".todo-list");
        const todoCards = document.querySelectorAll(".todo-card");
        todoCards.forEach((card) => card.remove());

        todoArray.forEach((todo) => {
            todoList.appendChild(this.renderTodo(todo));
        });
    }

    renderTodo(todo) {
        const todoCard = document.createElement('div');
        todoCard.className = 'todo-card';

        const headingDiv = document.createElement('div');
        const heading = document.createElement('h2');
        headingDiv.appendChild(heading);
        heading.className = 'todo-title';
        heading.textContent = todo.text;

        const dueDateDiv = document.createElement('div');
        const dueDate = document.createElement('p');
        dueDate.className = 'todo-due-date';
        dueDate.textContent = todo.dueDate.toString();
        dueDateDiv.appendChild(dueDate);

        const priorityDiv = document.createElement('div');
        const priority = document.createElement('p');
        priority.className = 'todo-priority';
        priority.classList.add(todo.priority);
        priority.textContent = todo.priority;
        priorityDiv.appendChild(priority);

        const labelDiv = document.createElement('div');
        todo.labels.forEach(item => {
            const label = document.createElement('span');
            label.className = 'todo-label';
            label.textContent = String(item);
            labelDiv.appendChild(label);
        })

        todoCard.appendChild(headingDiv);
        todoCard.appendChild(dueDateDiv);
        todoCard.appendChild(priorityDiv);
        todoCard.appendChild(labelDiv);

        return todoCard;
    }
}

export {TodoApp};
