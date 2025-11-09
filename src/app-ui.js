import {todoArray, projectsArray, saveStorage, loadStorage} from './storage';
import {buildForm} from "./add-todo";
import {bindEditTaskEvents} from './edit-task';
import {Project} from "./project";

class TodoApp {
    constructor() {
        this.currentFilter = 'all';
        this.currentFilterArray = todoArray;
        this.currentProjectId = null;
    }

    init() {
        loadStorage();
        this.filterTodos('all');
        this.loadSidebar();
        this.loadTaskView();
    }

    loadSidebar() {
        this.renderProjectNav();
        this.bindSidebarLinks();
        this.bindAddProjectBtn();
    }

    bindSidebarLinks() {
        const taskBtns = document.querySelectorAll('.task-nav-item');
        const projectBtns = document.querySelectorAll('.project-nav-item');
        taskBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.currentProjectId = null;
                this.filterTodos(filter);
                this.loadTodos(this.currentFilterArray);
                taskBtns.forEach(btn => btn.classList.remove('active'));
                projectBtns.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            })
        })

        projectBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.currentProjectId = filter;
                this.filterTodos(filter);
                this.loadTodos(this.currentFilterArray);
                taskBtns.forEach(btn => btn.classList.remove('active'));
                projectBtns.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                const projectName = projectsArray.find(project => project.id === this.currentProjectId);
                document.querySelector('.todo-title').textContent = 'Project: ' + projectName.name;
            })
        })
    }

    bindAddProjectBtn() {
        const addProjectButton = document.querySelector('.add-project-sidebar-btn');
        addProjectButton.addEventListener('click', e => {
            if (document.querySelector('.add-project-div')) {
                return;
            }
            document.querySelector('.sidebar-group-heading').insertAdjacentElement('afterend', this.buildProjectForm());
            document.querySelector('.add-project-name-input').focus();
        })
    }

    renderProjectNav() {
        const projectsSidebar = document.querySelector('.projects-sidebar');
        const projectBtns = document.querySelectorAll('.project-nav-item');
        projectBtns.forEach(btn => {
            btn.remove();
        })

        projectsArray.forEach(project => {
            const projectLink = document.createElement('div');
            projectLink.classList.add('project-nav-item');
            projectLink.dataset.filter = project.id;
            const projectColourText = document.createElement('div');
            projectColourText.classList.add('project-colour-text-div');
            const projectColour = document.createElement('span');
            projectColour.classList.add('project-colour');
            projectColour.style.backgroundColor = project.colour;
            projectColourText.appendChild(projectColour);
            const projectText = document.createElement('span');
            projectText.textContent = project.name;
            projectColourText.appendChild(projectText);
            const projectCount = document.createElement('span');
            projectCount.textContent = '0';
            projectCount.classList.add('project-nav-count');
            projectLink.appendChild(projectColourText);
            projectLink.appendChild(projectCount);
            projectsSidebar.appendChild(projectLink);
        })
    }

    buildProjectForm() {
        const addProjectDiv = document.createElement('div');
        addProjectDiv.classList.add('add-project-div');
        const addProjectColourInput = document.createElement('div');
        addProjectColourInput.classList.add('add-project-colour-input-div');
        const addProjectColour = document.createElement('input');
        addProjectColour.setAttribute('type', 'color');
        addProjectColour.classList.add('add-project-colour-input');
        addProjectColour.setAttribute('value', '#000000');
        addProjectColourInput.appendChild(addProjectColour);
        const addProjectInput = document.createElement('input');
        addProjectInput.setAttribute('type', 'text');
        addProjectInput.placeholder = 'Project name...';
        addProjectInput.classList.add('add-project-name-input');
        addProjectColourInput.appendChild(addProjectInput);
        addProjectDiv.prepend(addProjectColourInput);
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('add-project-button-div');
        const saveProjectBtn = document.createElement('button');
        saveProjectBtn.classList.add('add-project-save-btn');
        saveProjectBtn.textContent = 'Save';
        saveProjectBtn.addEventListener('click', () => {
            const newProject = new Project(addProjectInput.value, addProjectColour.value);
            projectsArray.push(newProject);
            saveStorage();
            addProjectDiv.remove();
            this.renderProjectNav();
            this.bindSidebarLinks();
            this.updateTaskCounts();
        })
        buttonDiv.appendChild(saveProjectBtn);
        const cancelProjectBtn = document.createElement('button');
        cancelProjectBtn.classList.add('add-project-cancel-btn');
        cancelProjectBtn.textContent = 'Cancel';
        cancelProjectBtn.addEventListener('click', () => {
            addProjectDiv.remove();
        })
        buttonDiv.appendChild(cancelProjectBtn);
        addProjectDiv.appendChild(buttonDiv);

        return addProjectDiv;
    }

    loadTaskView() {
        const addTodoBtn = document.querySelector('.task-add-button')
        addTodoBtn.addEventListener('click', (e) => {
            // TODO passing the old array as a callback, which means the new todo is not in there
            this.modal = buildForm(this, this.currentProjectId);
            this.modal.showModal();
        });

        this.loadTodos();
    }

    updateProjectDeleteBtn() {
        const buttonDiv = document.querySelector('.task-add-div');
        const existingBtn = buttonDiv.querySelector('.delete-project-btn');

        if (existingBtn) {
            existingBtn.remove();
        }

        if (this.currentFilter !== 'all' && this.currentFilter !== 'today' && this.currentFilter !== 'tomorrow' && this.currentFilter !== 'completed') {
            const deleteProjectBtn = document.createElement('button');
            deleteProjectBtn.classList.add('delete-project-btn');
            deleteProjectBtn.classList.add('btn-secondary');
            deleteProjectBtn.textContent = 'Delete project';
            deleteProjectBtn.dataset.id = this.currentFilter;
            deleteProjectBtn.addEventListener('click', (e) => {
                const project = projectsArray.findIndex(project => project.id === e.target.dataset.id);
                const tasks = todoArray.filter(task => task.projectId === e.target.dataset.id);
                tasks.forEach(task => {
                    task.projectId = null;
                })
                projectsArray.splice(project, 1);
                saveStorage();
                this.currentFilter = 'all';
                this.filterTodos('all');
                this.renderProjectNav();
                this.bindSidebarLinks();
                this.loadTodos(this.currentFilterArray);
                document.querySelector('.task-nav-item').classList.add('active');
            });
            buttonDiv.appendChild(deleteProjectBtn);
        }
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

        if (array.length === 0) {
            todoList.innerHTML = '';
            const message = document.createElement('div');
            message.textContent = `You're all caught up!`;
            message.classList.add('task-message');
            todoList.appendChild(message);
        } else {
            todoList.innerHTML = '';  // Clear once before the loop
            array.forEach((todo) => {
                todoList.appendChild(this.renderTodo(todo));
            });
        }

        this.updateTaskCounts();
        this.updateProjectDeleteBtn();
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
            todoCard.classList.add('completed');
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

        const mainDiv = document.createElement('div');
        mainDiv.classList.add('task-card-main-div');

        const heading = document.createElement('input');
        heading.setAttribute('type', 'text');
        heading.setAttribute('name', 'task-text');
        heading.className = 'task-title';
        heading.dataset.id = todo.id;
        heading.value = todo.text;

        const projectColourText = document.createElement('div');
        projectColourText.classList.add('project-colour-text-div');

        if (todo.getProjectColour() !== 'No Project') {
            const projectColour = document.createElement('div');
            projectColour.classList.add('project-colour');
            projectColour.style.backgroundColor = todo.getProjectColour();
            projectColourText.appendChild(projectColour);
        }

        const project = document.createElement('div');
        project.className = 'task-project';
        project.dataset.id = todo.id;
        project.textContent = todo.getProjectName();
        projectColourText.appendChild(project);

        mainDiv.appendChild(heading);
        mainDiv.appendChild(projectColourText);

        const dueDate = document.createElement('div');
        dueDate.className = 'task-due-date';
        dueDate.textContent = todo.dueDate;

        const priority = document.createElement('div');
        priority.className = 'todo-priority';
        priority.classList.add(todo.priority);
        priority.dataset.id = todo.id;
        priority.textContent = todo.priority;

        projectColourText.appendChild(priority);

        projectColourText.appendChild(dueDate);

        const labelDiv = document.createElement('div');
        labelDiv.classList.add('todo-labels');
        labelDiv.dataset.id = todo.id;
        todo.labels.forEach(item => {
            const label = document.createElement('span');
            label.className = 'todo-label';
            label.dataset.id = todo.id;
            label.textContent = String(item);
            labelDiv.appendChild(label);
        })
        projectColourText.appendChild(labelDiv);

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('type', 'button');
        deleteButton.classList.add('delete-button');
        deleteButton.dataset.id = todo.id;
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-trash fa-xl';
        deleteButton.appendChild(icon);
        deleteButton.addEventListener('click', (e) => {
            const index = todoArray.find(task => e.target.dataset.id === task.id)
            if (index !== -1) {
                todoArray.splice(index, 1);
                saveStorage();
                this.loadTodos(this.currentFilterArray);
            }
        })

        todoCard.appendChild(completed);
        todoCard.appendChild(mainDiv);
        todoCard.appendChild(deleteButton);

        bindEditTaskEvents(todoCard);

        return todoCard;
    }

    filterTodos(filter) {
        const today = new Date().toDateString();
        const tomorrow = new Date(Date.now() + 86400000).toDateString();

        switch (filter) {
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
        this.updateTaskCounts();
        return this.currentFilterArray;
    }

    updateTaskCounts() {
        projectsArray.forEach(project => {
            const tasksArray = todoArray.filter(todo => project.id === todo.projectId);
            const projectNavItem = document.querySelector(`.project-nav-item[data-filter="${project.id}"]`);
            if (projectNavItem) {
                const countSpan = projectNavItem.querySelector('.project-nav-count');
                if (countSpan) {
                    countSpan.textContent = tasksArray.length;
                }
            }
        });

        const today = new Date().toDateString();
        const tomorrow = new Date(Date.now() + 86400000).toDateString();
        const taskNavItems = document.querySelectorAll('.task-nav-item');
        if (taskNavItems) {
            taskNavItems.forEach(taskNavItem => {
                const countEl = taskNavItem.querySelector('.task-nav-count');
                switch (taskNavItem.dataset.filter) {
                    case 'today':
                        const taskArrayToday = todoArray.filter(todo => new Date(todo.dueDate).toDateString() === today);
                        countEl.textContent = taskArrayToday.length;
                        break;
                    case 'tomorrow':
                        const taskArrayTomorrow = todoArray.filter(todo => new Date(todo.dueDate).toDateString() === tomorrow);
                        countEl.textContent = taskArrayTomorrow.length;
                        break;
                    case 'completed':
                        const taskArrayCompleted = todoArray.filter(todo => todo.completed);
                        countEl.textContent = taskArrayCompleted.length;
                        break;
                    case 'all':
                        countEl.textContent = todoArray.length;
                        break;
                }
            })
        }

    }
}

export {TodoApp};
