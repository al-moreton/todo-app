import {todoArray, projectsArray, saveStorage, loadStorage} from './storage';
import {buildForm} from "./add-todo";
import {loadEditTask} from './edit-task';
import {Project} from "./project";
import {editProject} from './edit-project';

// TODO populate date if adding task from today/tomorrow
// TODO add sorting function
// TODO when ticking off tasks, move out of view, but with a delay
// TODO add transition effects to things
// TODO edit tasks inline
// TODO edit project name/colour
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

    updateHeader() {
        const todoTitle = document.querySelector('.todo-title')
        if (this.currentFilter !== 'all' && this.currentFilter !== 'today' && this.currentFilter !== 'tomorrow' && this.currentFilter !== 'completed') {
            const project = projectsArray.find(project => project.id === this.currentFilter);
            todoTitle.textContent = 'Project: ' + project.name;
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-pen-to-square fa-2xs';
            icon.style.color = '#6b7280';
            icon.dataset.id = this.currentFilter;
            todoTitle.appendChild(icon);
            icon.addEventListener('click', (e) => {
                this.modal = editProject(e.target.dataset.id, this);
                this.modal.showModal();
            })
        } else {
            todoTitle.textContent = this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1);
        }
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
        document.querySelector('.sidebar').addEventListener('mouseover', e => {
            document.querySelector('.add-project-sidebar-btn').style.visibility = 'visible';
        })
        document.querySelector('.sidebar').addEventListener('mouseout', e => {
            document.querySelector('.add-project-sidebar-btn').style.visibility = 'hidden';
        })
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
        this.updateHeader();
    }

    updateCompletedCheckbox(e, todo) {
        todo.completed = e.target.checked;
        saveStorage();
        this.loadTodos(this.currentFilterArray);
    }

    isTaskOverDue(dueDate) {
        const date = new Date(dueDate.textContent).setHours(0, 0, 0, 0);
        const todayDate = new Date().setHours(0, 0, 0, 0);
        const tomorrowDate = new Date(Date.now() + 86400000).setHours(0, 0, 0, 0);
        const sevenDays = new Date(Date.now() + (86400000 * 7)).setHours(0, 0, 0, 0);

        if (!date) {
            return;
        }

        if (date === todayDate) {
            dueDate.style.color = 'green';
        } else if (date === tomorrowDate) {
            dueDate.style.color = 'brown';
        } else if (date < todayDate) {
            dueDate.style.color = 'red';
        } else if (date > tomorrowDate && date < sevenDays) {
            dueDate.style.color = 'purple';
        }
    }

    renderTodo(todo) {
        const todoCard = document.createElement('div');
        todoCard.classList.add('todo-card');
        todoCard.dataset.id = todo.id;
        todoCard.addEventListener('click', (e) => {
            if (e.target.classList.contains('todo-completed') || e.target.closest('.delete-button')) {
                return;
            }
            this.modal = buildForm(this, null, todoCard.dataset.id);
            this.modal.showModal();
        })

        if (todo.completed) {
            todoCard.classList.add('completed');
        }

        const completedDiv = document.createElement('div');
        completedDiv.classList.add('todo-completed-div');

        const completed = document.createElement('input');
        completed.setAttribute('type', 'checkbox');
        completed.classList.add('todo-completed');
        completed.classList.add(todo.completed);
        completed.checked = todo.completed;
        completed.addEventListener('change', (e) => {
            this.updateCompletedCheckbox(e, todo);
        })
        completedDiv.appendChild(completed);

        const idDiv = document.createElement('div');
        idDiv.classList.add('todo-id');
        idDiv.textContent = todo.id;

        const mainDiv = document.createElement('div');
        mainDiv.classList.add('task-card-main-div');
        mainDiv.dataset.id = todo.id;
        mainDiv.addEventListener('click', (e) => {
            // loadEditTask(e.target.dataset.id);
        })

        const heading = document.createElement('div');
        heading.className = 'task-title';
        heading.dataset.id = todo.id;
        heading.textContent = todo.text;

        const projectColourText = document.createElement('div');
        projectColourText.classList.add('project-colour-text-div');

        const slash = document.createElement('div');
        slash.classList.add('task-slash');
        slash.textContent = '/';

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

        if (todo.getProjectColour() !== 'No Project') {
            projectColourText.appendChild(project);
            // projectColourText.appendChild(slash);
        }

        mainDiv.appendChild(heading);
        mainDiv.appendChild(projectColourText);

        const dueDate = document.createElement('div');
        dueDate.className = 'task-due-date';
        dueDate.textContent = todo.dueDate;

        this.isTaskOverDue(dueDate);

        const priority = document.createElement('div');
        priority.className = 'todo-priority';
        priority.classList.add(todo.priority);
        priority.dataset.id = todo.id;
        priority.textContent = todo.priority;

        if (todo.priority) {
            // projectColourText.appendChild(slash.cloneNode(true));
            projectColourText.appendChild(priority);
        }
        if (todo.dueDate) {
            // projectColourText.appendChild(slash.cloneNode(true));
            projectColourText.appendChild(dueDate);
        }

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
        if (todo.labels.length > 0) {
            projectColourText.appendChild(labelDiv);
        }

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('type', 'button');
        deleteButton.classList.add('delete-button');
        deleteButton.dataset.id = todo.id;
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-trash fa-xl';
        icon.dataset.id = todo.id;
        deleteButton.appendChild(icon);
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const taskId = deleteButton.dataset.id;
            const index = todoArray.findIndex(task => task.id === taskId);
            if (index !== -1) {
                todoArray.splice(index, 1);
                saveStorage();
                this.loadTodos(this.currentFilterArray);
            }
        })

        todoCard.appendChild(completedDiv);
        todoCard.appendChild(mainDiv);
        todoCard.appendChild(deleteButton);

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
