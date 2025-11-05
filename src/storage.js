import {Todo} from "./todo-note";
import {Project} from "./project";

let todoArray = [];
let projectsArray = [];

function saveStorage() {
    localStorage.setItem("myTodos", JSON.stringify(todoArray));
    localStorage.setItem("myProjects", JSON.stringify(projectsArray));
}

function loadStorage() {
    const todoData = JSON.parse(localStorage.getItem("myTodos")) || [];
    todoArray = todoData.map(Todo.fromJSON);

    const projectData = JSON.parse(localStorage.getItem("myProjects")) || [];
    projectsArray = projectData.map(Project.fromJSON);

    if (projectsArray.length === 0) {
            projectsArray = [
                new Project('Default', '#247e9c'),
                new Project('Default 2', '#94249c'),
            ];
            saveStorage();
        }
}

export {todoArray, projectsArray, saveStorage, loadStorage};
