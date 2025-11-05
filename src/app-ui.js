import {todoArray, projectsArray, saveStorage, loadStorage} from './storage';
import {Todo} from './todo-note';
import {buildForm} from "./add-todo";

class TodoApp {
    constructor() {
        this.currentFilter = 'All';
        this.currentFilterArray = todoArray;
        this.currentProjectId = null;
    }

    init() {
        loadStorage();
        this.loadSidebar();
        this.loadTaskView();
    }

    loadSidebar() {
        const taskBtns = document.querySelectorAll('.task-nav-item');
        taskBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.currentProjectId = null;
                this.filterTodos(filter);
                this.loadTodos(this.currentFilterArray);
            })
        })

        const projectsSidebar = document.querySelector('.projects-sidebar');
        projectsArray.forEach(project => {
            const projectLink = document.createElement('div');
            projectLink.textContent = project.name;
            projectLink.classList.add('project-nav-item');
            projectLink.dataset.filter = project.id;
            projectsSidebar.appendChild(projectLink);
        })
        const projectBtns = document.querySelectorAll('.project-nav-item');
        projectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.currentProjectId = filter;
                this.filterTodos(filter);
                this.loadTodos(this.currentFilterArray);
            })
        })
    }

    loadTaskView() {
        const container = document.querySelector('.todo-app');
        const addTodoBtn = document.createElement('button');
        addTodoBtn.textContent = 'Add Todo';
        addTodoBtn.addEventListener('click', (e) => {
            // TODO passing the old array as a callback, which means the new todo is not in there
            this.modal = buildForm(this, this.currentProjectId);
            this.modal.showModal();
        });
        container.appendChild(addTodoBtn);

        this.loadTodos();
    }

    loadTodos(array = todoArray) {
        const title = document.querySelector('.todo-title');
        title.textContent = this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1);

        const todoList = document.querySelector(".todo-list");
        const todoCards = document.querySelectorAll(".todo-card");
        todoCards.forEach((card) => card.remove());

        // if (this.currentFilter !== 'Completed') {
        //     array = array.filter(task => task.completed === false);
        // }

        array.forEach((todo) => {
            todoList.appendChild(this.renderTodo(todo));
        });
    }

    updateCompletedCheckbox(e, todo) {
        todo.completed = e.target.checked;
        saveStorage();
        this.loadTodos(this.currentFilterArray);
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

        const project = document.createElement('div');
        project.className = 'todo-project';
        project.textContent = todo.getProjectName();

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
        todoCard.appendChild(project);
        todoCard.appendChild(labelDiv);

        return todoCard;
    }

    filterTodos(filter) {
        const today = new Date().toDateString();
        const tomorrow = new Date(Date.now() + 86400000).toDateString();

        switch(filter) {
            case 'today':
                this.currentFilter = 'today';
                this.currentFilterArray = todoArray.filter(todo =>
                    new Date(todo.dueDate).toDateString() === today
                );
                break;
            case 'tomorrow':
                this.currentFilter = 'tomorrow';
                this.currentFilterArray = todoArray.filter(todo =>
                    new Date(todo.dueDate).toDateString() === tomorrow
                );
                break;
            case 'completed':
                this.currentFilter = 'completed';
                this.currentFilterArray = todoArray.filter(todo => todo.completed);
                break;
            case 'all':
                this.currentFilter = 'all';
                this.currentFilterArray = todoArray;
                break;
            default:
                const project = projectsArray.find(project => project.id === filter);
                this.currentFilter = project.id;
                // Filter by project ID
                this.currentFilterArray = todoArray.filter(todo => todo.projectId === filter);
                break;
        }
        return this.currentFilterArray;
    }
}

export {TodoApp};
