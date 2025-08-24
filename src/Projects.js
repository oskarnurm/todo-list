export default class Project {
  constructor(name) {
    this.name = name;
    this.lib = [];
  }

  getLib() {
    return this.lib;
  }

  getName() {
    return this.name;
  }

  addName(name) {
    this.name = name;
  }

  add(task) {
    this.lib.push(task);
  }
}
