import "./style.css";
import Project from "./Projects";
import Task from "./Task";

const addTaskBtn = document.getElementById("add-task");
const form = document.getElementById("task-form");
const taskList = document.querySelector(".task-list");
const cancelBtn = document.querySelector(".cancel");

let currentList = [];

function addTaskToList(title, desc, date, prio) {
  const task = new Task(title, desc, date, prio);
  currentList.push(task);
}

function renderList() {
  taskList.textContent = "";
  currentList.forEach((task) => {
    const taskDiv = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    taskDiv.classList.add("task");
    checkbox.classList.add("checkbox");

    taskDiv.textContent = task.getTitle();
    taskDiv.appendChild(checkbox);
    taskList.appendChild(taskDiv);
  });
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

  addTaskToList(title, desc, date, prio);
  renderList();
  form.reset();
  form.hidden = true;
  addTaskBtn.hidden = false;
});

cancelBtn.addEventListener("click", () => {
  form.reset();
  form.hidden = true;
  addTaskBtn.hidden = false;
});
