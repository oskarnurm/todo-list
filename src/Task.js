export default class Task {
  constructor(title, desc, date, prio, id = crypto.randomUUID()) {
    this.id = id;
    this.title = title || ""; // Title is required but safeguard incase
    this.desc = desc || "";
    this.date = date || "";
    this.prio = prio || 1;
  }

  getTitle() {
    return this.title;
  }

  getDesc() {
    return this.desc;
  }

  getDate() {
    return this.date;
  }

  getPrio() {
    return this.prio;
  }

  setTitle(title) {
    this.title = title;
  }

  setDesc(desc) {
    this.desc = desc;
  }

  setDate(date) {
    this.date = date;
  }

  setPrio(prio) {
    this.prio = prio;
  }
}
