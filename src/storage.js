import { Todo } from './todo-note';
import { Project } from './project';

let todoArray = [];
let projectsArray = []

function saveStorage() {
    localStorage.setItem('myTodos', JSON.stringify(todoArray));
    localStorage.setItem('myProjects', JSON.stringify(projectsArray));
}

function loadStorage() {
    const todoData = JSON.parse(localStorage.getItem('myTodos')) || [];
    todoArray = todoData.map(Todo.fromJSON);

    if (todoArray.length === 0) {
        todoArray = [new Todo('Example todo', 'date', 'high', ['shopping', 'work'], null)];
        saveStorage();
    }

    const projectData = JSON.parse(localStorage.getItem('myProjects')) || [];
    projectsArray = projectData.map(Project.fromJSON);
}

export { todoArray, projectsArray, saveStorage, loadStorage };