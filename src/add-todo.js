import {saveStorage, todoArray} from "./storage";
import {Todo} from "./todo-note";

function buildForm(onSubmitCallback) {
    if (document.querySelector('.todo-dialog')) {
        return document.querySelector('.todo-dialog');
    }

    const container = document.querySelector('main');
    const dialog = document.createElement('dialog');
    dialog.className = 'todo-dialog';

    const formTitle = document.createElement('h3');
    formTitle.className = 'form-title';
    formTitle.textContent = 'Add a Todo';

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
    dateInput.valueAsDate = new Date();
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

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'add-todo-form-submit button-primary';
    submitBtn.textContent = 'Add task';
    submitBtn.addEventListener('click', (e) => {
        handleSubmit(e, onSubmitCallback);
    })
    form.appendChild(submitBtn);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'add-todo-form-close';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        form.reset();
        form.closest('dialog').close();
    })
    form.appendChild(closeBtn);

    dialog.appendChild(formTitle);
    dialog.appendChild(form);

    container.appendChild(dialog);

    return dialog;
}

// TODO labels and project fields in form
function handleSubmit(e, onSubmitCallback) {
    e.preventDefault();
    const form = e.target.closest('form');
    const formData = new FormData(form);

    const newTodo = new Todo(
        formData.get('todo-text'),
        formData.get('todo-date'),
        formData.get('priority'),
        [],
        null,
    );
    todoArray.push(newTodo);
    saveStorage();

    form.reset();
    form.closest('dialog').close();

    if (onSubmitCallback) {
        onSubmitCallback();
    }
}

export { buildForm };