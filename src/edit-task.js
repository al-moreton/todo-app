import {todoArray, projectsArray, saveStorage} from "./storage";

function bindEditTaskEvents(todoEl) {
    todoEl.addEventListener('input', function (e) {
        if (e.target.className === 'task-title') {
            const task = todoArray.find(item => item.id === e.target.dataset.id);
            if (task) {
                task.text = e.target.value;
                saveStorage();
            }
        }
    })
    todoEl.addEventListener('change', function (e) {
        if (e.target.className === 'task-due-date') {
            const task = todoArray.find(item => item.id === e.target.dataset.id);
            if (task) {
                task.dueDate = e.target.value;
                saveStorage();
            }
        }
    })
    todoEl.addEventListener('click', function (e) {
        if (e.target.className === 'task-project') {
            const taskId = e.target.dataset.id;
            const el = e.target;
            const newProjectSelect = document.createElement("select");
            newProjectSelect.name = 'todo-project';
            newProjectSelect.id = 'todo-project';
            newProjectSelect.dataset.id = taskId;
            projectsArray.forEach(project => {
                const option = document.createElement('option');
                option.textContent = project.name;
                option.value = project.id;
                option.dataset.id = taskId;
                option.style.color = project.colour;
                if (project.id === option.value) {
                    option.selected = true;
                }
                newProjectSelect.appendChild(option);
            })
            el.replaceWith(newProjectSelect);

            // TODO not quite working - if changed twice in a row, clicking on a task without an existing project, etc
            newProjectSelect.addEventListener('change', function (e) {
                const task = todoArray.find(item => item.id === taskId);
                if (task) {
                    task.projectId = e.target.value;
                    saveStorage();
                }
            })
        }
    })
}

export {bindEditTaskEvents};