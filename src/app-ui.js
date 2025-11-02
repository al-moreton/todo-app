import {todoArray, projectsArray, saveStorage, loadStorage} from "./storage";
import {Todo} from "./todo-note";

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
        const container = document.querySelector(".todo-app");
        const addTodoBtn = document.createElement("button");
        addTodoBtn.textContent = "Add Todo";

        addTodoBtn.addEventListener("click", (e) => {
            this.handleAddTodo(e);
            this.loadTodos();
        });

        container.appendChild(addTodoBtn);

        const todoList = document.createElement("div");
        todoList.classList.add("todo-list");
        container.appendChild(todoList);
    }

    handleAddTodo(e) {
        const newTodo = new Todo(
            "test",
            "date",
            "high",
            ["shopping", "work"],
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
        const todoCard = document.createElement("div");
        todoCard.className = "todo-card";

        const heading = document.createElement("h2");
        heading.textContent = todo.text;

        todoCard.appendChild(heading);
        return todoCard;
    }
}

export {TodoApp};
