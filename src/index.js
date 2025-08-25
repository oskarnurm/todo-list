import "./style.css";
import Project from "./Projects";
import Task from "./Task";

const addTaskBtn = document.getElementById("add-task");
const form = document.getElementById("task-form");
const taskList = document.querySelector(".task-list");
const cancelBtn = document.querySelector(".cancel");

const inbox = new Project("Inbox");

function addTaskToList(project, title, desc, date, prio) {
  const task = new Task(title, desc, date, prio);
  project.add(task);
}

function renderList(project) {
  taskList.textContent = "";
  project.getList().forEach((task) => {
    const taskDiv = document.createElement("div");
    const inputDiv = document.createElement("input");
    const titleSpan = document.createElement("span");

    titleSpan.classList.add("task-title");
    titleSpan.textContent = task.getTitle();

    inputDiv.type = "radio";
    inputDiv.classList.add("checked");
    inputDiv.addEventListener("change", () => {
      removeTaskById(project, task.getId());
    });

    taskDiv.classList.add("task");
    taskDiv.appendChild(inputDiv);
    taskDiv.appendChild(titleSpan);

    taskList.appendChild(taskDiv);
  });
}

function removeTaskById(project, id) {
  project.setList(project.getList().filter((task) => task.getId() !== id));
  renderList(project);
  saveToStorage(project);
}

function saveToStorage(project) {
  localStorage.setItem(project.getName(), JSON.stringify(project));
}

function loadFromStorage(project) {
  const data = localStorage.getItem(project.getName());
  if (!data) return;
  const parsed = JSON.parse(data);
  // Convert JSON data back to acceptable format
  //
  const tasks = parsed.list.map(
    (obj) => new Task(obj.title, obj.desc, obj.date, obj.prio, obj.id),
  );
  project.setList(tasks);
}

addTaskBtn.addEventListener("click", () => {
  form.hidden = false;
  addTaskBtn.hidden = true;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const date = document.getElementById("date").value;
  const prio = document.getElementById("prio").value;

  addTaskToList(inbox, title, desc, date, prio);
  saveToStorage(inbox);
  renderList(inbox);
  form.reset();
  form.hidden = true;
  addTaskBtn.hidden = false;
});

cancelBtn.addEventListener("click", () => {
  form.reset();
  form.hidden = true;
  addTaskBtn.hidden = false;
});

loadFromStorage(inbox);
renderList(inbox);
