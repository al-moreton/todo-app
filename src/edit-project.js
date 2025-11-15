import {projectsArray, saveStorage} from "./storage";

function editProject(id, todoApp) {
    const project = projectsArray.find(project => project.id === id);
    const dialog = document.createElement('dialog');

    const title = document.createElement('div');
    title.className = 'form-title';
    title.textContent = 'Edit project';
    dialog.appendChild(title);

    const intro = document.createElement('div');
    intro.className = 'form-intro';
    intro.textContent = 'Edit project here.';
    dialog.appendChild(intro);

    const form = document.createElement('form');
    form.className = 'edit-project-form';

    const input = document.createElement('input');
    input.setAttribute('type', 'project-name');
    input.setAttribute('name', 'project-name');
    input.setAttribute('id', 'project-name');
    input.value = project.name;

    const colour = document.createElement('input');
    colour.setAttribute('type', 'color');
    colour.setAttribute('name', 'project-colour');
    colour.setAttribute('id', 'project-colour');
    colour.setAttribute('value', project.colour);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('form-button-div');

    const cancel = document.createElement('button');
    cancel.setAttribute('type', 'button');
    cancel.textContent = 'Cancel';
    cancel.classList.add('btn-secondary');
    cancel.addEventListener('click', (e) => {
        dialog.close();
    })
    buttonDiv.appendChild(cancel);

    const submit = document.createElement('button');
    submit.setAttribute('type', 'submit');
    submit.textContent = 'Save';
    submit.classList.add('btn-primary');
    submit.classList.add('edit-project-submit');
    submit.dataset.id = id;
    submit.addEventListener('click', (e) => {
        handleSubmit(e, todoApp);
    })
    buttonDiv.appendChild(submit);

    form.appendChild(input);
    form.appendChild(colour);
    form.appendChild(buttonDiv);

    dialog.appendChild(form);

    if (document.querySelectorAll('dialog')) {
        document.querySelectorAll('dialog').forEach(dialog => {dialog.remove()});
    }

    document.body.appendChild(dialog);

    return dialog;
}

function handleSubmit(e, todoApp) {
    e.preventDefault();
    const form = e.target.closest('form');
    const formData = new FormData(form);

    const project = projectsArray.find(project => project.id === e.target.dataset.id);

    project.name = formData.get('project-name');
    project.colour = formData.get('project-colour');

    saveStorage();

    todoApp.loadSidebar();
    todoApp.filterTodos(todoApp.currentFilter);
    todoApp.loadTodos(todoApp.currentFilterArray);
    const todoTitle = document.querySelector('.todo-title')
    todoTitle.textContent = 'Project: ' + project.name;
    const navItem = document.querySelector(`.project-nav-item[data-filter="${project.id}"]`);
    navItem.classList.add('active');

    form.reset();
    form.closest('dialog').close();
}

export {editProject};