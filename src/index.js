import "./style.css";
import Project from "./Projects";
import Task from "./Task";

function addTaskToList(project, title, desc, date, prio) {
  const task = new Task(title, desc, date, prio);
  project.add(task);
}

function renderList(project) {
  const taskList = document.querySelector(".task-list");
  const mainTitle = document.querySelector(".main-title");

  mainTitle.textContent = project.getName();
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

function addProject(projectsUl, name) {
  const listItem = document.createElement("li");
  const linkItem = document.createElement("a");
  linkItem.textContent = name;
  linkItem.href = "#";
  listItem.appendChild(linkItem);
  projectsUl.appendChild(listItem);
}

function todoController(project) {
  const addTaskBtn = document.getElementById("add-task");
  const form = document.getElementById("task-form");
  const cancelBtn = document.querySelector(".cancel");
  const navList = document.querySelector(".projects ul");
  const navListLink = document.querySelectorAll(".projects li a");
  const addProjBtn = document.querySelector(".add-project");

  // Show form to add task
  addTaskBtn.addEventListener("click", () => {
    form.hidden = false;
    addTaskBtn.hidden = true;
  });

  // Submit task
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    const date = document.getElementById("date").value;
    const prio = document.getElementById("prio").value;

    addTaskToList(inbox, title, desc, date, prio);
    saveToStorage(project);
    renderList(project);
    form.reset();
    form.hidden = true;
    addTaskBtn.hidden = false;
  });

  // Cancel submit
  cancelBtn.addEventListener("click", () => {
    form.reset();
    form.hidden = true;
    addTaskBtn.hidden = false;
  });

  // Add project
  addProjBtn.addEventListener("click", () => {
    const name = prompt("Enter project name:");
    addProject(navList, name);
  });

  // Switch projects
  navListLink.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const projectName = link.textContent.trim();
      loadFromStorage(projectName);
      // TODO: figure out how to add projects
      console.log(projectName);
    });
  });

  loadFromStorage(project);
  renderList(project);
}

const inbox = new Project("Inbox");
const today = new Project("Today");
// TODO: create a list of projects to store them?

todoController(inbox);
