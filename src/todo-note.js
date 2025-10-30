class Todo {
    constructor(text, dueDate = null, location = null, priority = null, labels = [], projectId = null) {
        this.id = crypto.randomUUID();
        this.text = text;
        this.dueDate = dueDate;
        this.location = location;
        this.priority = priority;
        this.labels = labels;
        this.projectId = projectId;
        this.completed = false;
    }

    toJSON() {
        return {
            id: this.id,
            text: this.text,
            dueDate: this.dueDate,
            location: this.location,
            priority: this.priority,
            labels: this.labels,
            projectId: this.projectId,
            completed: this.completed,
        }
    }

    static fromJSON(obj) {
        const n = new Todo(obj.text, obj.dueDate, obj.location, obj.priority, obj.labels, obj.projectId, obj.completed);
        n.id = obj.id;
        return n;
    }
}

export { Todo };