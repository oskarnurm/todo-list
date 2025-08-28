import "./style.css";

function Task(opts) {
  const id = crypto.randomUUID();
  const data = {
    title: opts.title,
    desc: opts.desc || "",
    date: opts.date || null,
    prio: opts.prio || "normal",
  };

  const getTitle = () => data.title;
  const getDesc = () => data.desc;
  const getDate = () => data.date;
  const getPrio = () => data.prio;
  const getId = () => id;

  return { getTitle, getDesc, getDate, getPrio, getId };
}

function Project(title) {
  const id = crypto.randomUUID();
  let _title = title;
  let taskList = [];

  const getTitle = () => _title;
  const getTaskList = () => taskList;
  const addTask = (task) => taskList.push(task);
  const updateTaskList = (newList) => (taskList = newList);
  const getId = () => id;

  return { getId, getTitle, getTaskList, addTask, updateTaskList };
}

function TodoController() {
  const projects = [];

  const createProject = (title) => {
    const newProject = Project(title);
    projects.push(newProject);
    return newProject;
  };

  const createTask = (project, taskData) => {
    const newTask = Task(taskData);
    project.addTask(newTask);
    return newTask;
  };

  const findProjectById = (id) => {
    return projects.find((project) => project.getId() === id);
  };

  const getProjects = () => projects;

  return { findProjectById, createProject, createTask, getProjects };
}

function ScreenController() {
  let SELECTED_PROJECT = null;
  const todo = TodoController();

  const taskListUL = document.querySelector(".task-list");
  const projectUL = document.querySelector(".project-list");
  const projectTitleDiv = document.querySelector(".project-title");
  const addProjectBtn = document.querySelector(".add-project");
  const addTaskBtn = document.querySelector(".add-task");
  const taskForm = document.querySelector(".task-form");
  const cancelBtn = document.querySelector(".cancel");

  // Dummy data
  const defaultProject = todo.createProject("Default");
  todo.createProject("inbox");
  todo.createProject("school");
  todo.createTask(defaultProject, { title: "clean room" });
  todo.createTask(defaultProject, { title: "Do homework" });
  todo.createTask(defaultProject, { title: "Walk the dog" });

  SELECTED_PROJECT = defaultProject;

  function removeTaskById(project, taskId) {
    project.updateTaskList(
      project.getTaskList().filter((task) => task.getId() !== taskId),
    );
  }

  function createProjectElement(project) {
    const li = document.createElement("li");
    li.textContent = project.getTitle();
    li.dataset.projectId = project.getId();
    li.className = "project";
    return li;
  }

  function createTaskElement(task) {
    const li = document.createElement("li");
    const titleDiv = document.createElement("div");
    const descDiv = document.createElement("div");
    const dateDiv = document.createElement("div");
    const removeDiv = document.createElement("input");

    titleDiv.textContent = task.getTitle();
    descDiv.textContent = task.getDesc();
    dateDiv.textContent = task.getDate();
    removeDiv.type = "radio";

    titleDiv.appendChild(removeDiv);
    li.appendChild(titleDiv);
    li.appendChild(descDiv);
    li.appendChild(dateDiv);
    li.dataset.taskId = task.getId();
    li.className = "task";
    return li;
  }

  function renderProjectTaskList(project) {
    taskListUL.textContent = "";
    projectTitleDiv.textContent = project.getTitle();
    project.getTaskList().forEach((task) => {
      const taskElement = createTaskElement(task);
      taskListUL.appendChild(taskElement);
    });
  }

  function renderProjects() {
    projectUL.textContent = "";
    todo.getProjects().forEach((project) => {
      const projectElement = createProjectElement(project);
      projectUL.appendChild(projectElement);
    });
  }

  // Event listeners
  addProjectBtn.addEventListener("click", () => {
    const title = prompt("Enter project name:");
    todo.createProject(title);
    renderProjects();
  });

  addTaskBtn.addEventListener("click", () => {
    taskForm.hidden = false;
    addTaskBtn.hidden = true;
  });

  cancelBtn.addEventListener("click", () => {
    taskForm.reset();
    taskForm.hidden = true;
    addTaskBtn.hidden = false;
  });

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const daskData = {
      title: document.getElementById("title").value,
      desc: document.getElementById("desc").value,
      date: document.getElementById("date").value,
      prio: document.getElementById("prio").value,
    };
    todo.createTask(SELECTED_PROJECT, daskData);

    // Does the rendering order matter here?
    taskForm.hidden = true;
    renderProjectTaskList(SELECTED_PROJECT);
    addTaskBtn.hidden = false;
    taskForm.reset();
  });

  taskListUL.addEventListener("change", (e) => {
    if (e.target.type === "radio") {
      const taskId = e.target.closest(".task").dataset.taskId;
      removeTaskById(SELECTED_PROJECT, taskId);
      renderProjectTaskList(SELECTED_PROJECT);
    }
  });

  projectUL.addEventListener("click", (e) => {
    if (e.target.classList.contains("project")) {
      const projectId = e.target.dataset.projectId;
      SELECTED_PROJECT = todo.findProjectById(projectId);
      renderProjectTaskList(SELECTED_PROJECT);
    }
  });

  renderProjects();
  renderProjectTaskList(defaultProject);
}

ScreenController();
