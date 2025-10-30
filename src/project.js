class Project {
    constructor(name, colour, todo = []) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.colour = colour;
        this.todo = todo;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            colour: this.colour,
            todo: this.todo,
        }
    }

    static fromJSON(obj) {
        const n = new Project(obj.name, obj.colour, obj.todo);
        n.id = obj.id;
        return n;
    }
}

export { Project };