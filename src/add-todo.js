import {saveStorage, todoArray, projectsArray} from "./storage";
import {Todo} from "./todo-note";

function buildForm(todoApp, preselectedProjectId = null, todoId = null) {
    const existingDialog = document.querySelector('.todo-dialog');
    if (existingDialog) {
        existingDialog.remove();
    }

    const container = document.querySelector('main');
    const dialog = document.createElement('dialog');
    dialog.className = 'todo-dialog';

    const formTitle = document.createElement('h3');
    formTitle.className = 'form-title';
    formTitle.textContent = 'Add a Todo';

    const formIntro = document.createElement('div');
    formIntro.className = 'form-intro';
    formIntro.textContent = 'Add a task here.';

    const form = document.createElement('form');
    form.className = 'add-todo-form';

    const textLabel = document.createElement('label');
    textLabel.setAttribute('for', 'todo-text');
    textLabel.textContent = 'Task';
    form.appendChild(textLabel);

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.name = 'todo-text';
    textInput.id = 'todo-text';
    textInput.placeholder = 'Task details...';
    form.appendChild(textInput);

    const dateLabel = document.createElement('label');
    dateLabel.setAttribute('for', 'todo-date');
    dateLabel.textContent = 'Due date';
    form.appendChild(dateLabel);

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.name = 'todo-date';
    dateInput.id = 'todo-date';
    form.appendChild(dateInput);

    const fieldset = document.createElement('fieldset');
    form.appendChild(fieldset);
    const legend = document.createElement('legend');
    legend.className = 'form-legend';
    legend.textContent = 'Priority';
    fieldset.appendChild(legend);

    const lowPriority = document.createElement('input');
    lowPriority.type = 'radio';
    lowPriority.id = 'low-priority';
    lowPriority.name = 'priority';
    lowPriority.value = 'low';
    fieldset.appendChild(lowPriority);
    const lowPriorityLabel = document.createElement('label');
    lowPriorityLabel.setAttribute('for', 'low-priority');
    lowPriorityLabel.textContent = 'Low';
    fieldset.appendChild(lowPriorityLabel);

    const medPriority = document.createElement('input');
    medPriority.type = 'radio';
    medPriority.id = 'med-priority';
    medPriority.name = 'priority';
    medPriority.value = 'med';
    fieldset.appendChild(medPriority);
    const medPriorityLabel = document.createElement('label');
    medPriorityLabel.setAttribute('for', 'med-priority');
    medPriorityLabel.textContent = 'Med';
    fieldset.appendChild(medPriorityLabel);

    const highPriority = document.createElement('input');
    highPriority.type = 'radio';
    highPriority.id = 'high-priority';
    highPriority.name = 'priority';
    highPriority.value = 'high';
    fieldset.appendChild(highPriority);
    const highPriorityLabel = document.createElement('label');
    highPriorityLabel.setAttribute('for', 'high-priority');
    highPriorityLabel.textContent = 'High';
    fieldset.appendChild(highPriorityLabel);

    const projectLabel = document.createElement('label');
    projectLabel.setAttribute('for', 'todo-project');
    projectLabel.textContent = 'Project';
    form.appendChild(projectLabel);

    const projectInput = document.createElement('select');
    projectInput.name = 'todo-project';
    projectInput.id = 'todo-project';
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Choose a project...';
    defaultOption.value = '';
    projectInput.appendChild(defaultOption);
    projectsArray.forEach(project => {
        const option = document.createElement('option');
        const span = document.createElement('div');
        span.className = 'project-colour';
        span.style.backgroundColor = project.color;
        option.appendChild(span);
        option.textContent = project.name;
        option.classList.add('project-colour-option');
        option.value = project.id;
        option.style.color = project.colour;
        if (project.id === preselectedProjectId) {
            option.selected = true;
        }
        projectInput.appendChild(option);
    })
    form.appendChild(projectInput);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('form-button-div');

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'add-todo-form-close btn-secondary';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        form.reset();
        form.closest('dialog').close();
    })
    buttonDiv.appendChild(closeBtn);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'add-todo-form-submit button-primary';
    submitBtn.textContent = 'Add task';
    submitBtn.addEventListener('click', (e) => {
        handleSubmit(e, todoApp);
    })
    buttonDiv.appendChild(submitBtn);

    form.appendChild(buttonDiv);

    dialog.appendChild(formTitle);
    dialog.appendChild(formIntro);
    dialog.appendChild(form);

    container.appendChild(dialog);

    if (todoId) {
        const todo = todoArray.find(todo => todo.id === todoId);
        textInput.value = todo.text;
        dateInput.value = todo.dueDate;
        if (todo.priority === 'low') {
            lowPriority.checked = true;
        } else if (todo.priority === 'med') {
            medPriority.checked = true;
        } else {
            highPriority.checked = true;
        }
        const options = document.querySelectorAll('.project-colour-option');
        options.forEach(option => {
            if (option.value === todo.projectId) {
                option.selected = true;
            }
        })
        const newSubmitBtn = submitBtn.cloneNode(true);
        newSubmitBtn.textContent = 'Update task';
        newSubmitBtn.dataset.id = todoId;
        newSubmitBtn.addEventListener('click', (e) => {
            handleEdit(e, todoApp);
        })
        submitBtn.replaceWith(newSubmitBtn);
    }

    return dialog;
}

function handleEdit(e, todoApp) {
    e.preventDefault();
    const task = todoArray.find(task => task.id === e.currentTarget.dataset.id);
    const form = e.target.closest('form');
    const formData = new FormData(form);

    task.text = formData.get('todo-text');
    task.dueDate = formData.get('todo-date');
    task.priority = formData.get('priority');
    task.projectId = formData.get('todo-project');

    saveStorage();

    todoApp.filterTodos(todoApp.currentFilter);
    todoApp.loadTodos(todoApp.currentFilterArray);

    form.reset();
    form.closest('dialog').close();
}

function handleSubmit(e, todoApp) {
    e.preventDefault();
    const form = e.target.closest('form');
    const formData = new FormData(form);

    const newTodo = new Todo(
        formData.get('todo-text'),
        formData.get('todo-date'),
        formData.get('priority'),
        [],
        formData.get('todo-project'),
    );
    todoArray.push(newTodo);
    saveStorage();

    todoApp.filterTodos(todoApp.currentFilter);
    todoApp.loadTodos(todoApp.currentFilterArray);

    form.reset();
    form.closest('dialog').close();
}

export { buildForm };