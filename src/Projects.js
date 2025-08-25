export default class Project {
  constructor(name) {
    this.name = name;
    this.list = [];
  }

  getList() {
    return this.list;
  }

  setList(list) {
    this.list = list;
  }

  getName() {
    return this.name;
  }

  addName(name) {
    this.name = name;
  }

  add(task) {
    this.list.push(task);
  }
}
