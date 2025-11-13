import {todoArray, projectsArray, saveStorage, loadStorage} from "./storage";

class Todo {
    constructor(
        text,
        dueDate = null,
        priority = null,
        labels = [],
        projectId = null,
    ) {
        this.id = crypto.randomUUID();
        this.text = text;
        this.dueDate = dueDate;
        this.priority = priority;
        this.labels = labels;
        this.projectId = projectId;
        this.completed = false;
    }

    getProjectName() {
        const project = projectsArray.find(project => project.id === this.projectId);
        return project ? project.name : 'No Project';
    }

    getProjectColour() {
        const project = projectsArray.find(project => project.id === this.projectId);
        return project ? project.colour : 'No Project';
    }

    toJSON() {
        return {
            id: this.id,
            text: this.text,
            dueDate: this.dueDate,
            priority: this.priority,
            labels: this.labels,
            projectId: this.projectId,
            completed: this.completed,
        };
    }

    static fromJSON(obj) {
        const n = new Todo(
            obj.text,
            obj.dueDate,
            obj.priority,
            obj.labels,
            obj.projectId,
        );
        n.id = obj.id;
        n.completed = obj.completed;
        return n;
    }
}

export {Todo};
