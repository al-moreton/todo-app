class Project {
  constructor(name, colour = '#000000', todo = []) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.colour = colour;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      colour: this.colour,
    };
  }

  static fromJSON(obj) {
    const n = new Project(obj.name, obj.colour);
    n.id = obj.id;
    return n;
  }
}

export { Project };
