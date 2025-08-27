import "./style.css";

function Task(title) {
  const id = crypto.randomUUID();
  let _title = title;

  const getTitle = () => _title;
  const getId = () => id;

  return { getTitle, getId };
}

function Project(title) {
  const id = crypto.randomUUID();
  let _title = title;
  const taskList = [];

  const getTitle = () => _title;
  const getTaskList = () => taskList;
  const addTask = (task) => taskList.push(task);
  const getId = () => id;

  return { getId, getTitle, getTaskList, addTask };
}

function TodoController() {
  const projects = [];

  const createProject = (title) => {
    const newProject = Project(title);
    projects.push(newProject);
    return newProject;
  };

  const createTask = (project, title) => {
    const newTask = Task(title);
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
  let currentSelectedProject = null;
  const todo = TodoController();

  // query once to save cost
  const taskListUL = document.querySelector(".task-list");
  const projectUL = document.querySelector(".project-list");
  const projectTitleDiv = document.querySelector(".project-title");

  // Create dummy data
  const defaultProject = todo.createProject("Default");
  todo.createProject("inbox");
  todo.createProject("school");
  todo.createTask(defaultProject, "Clean your room");
  todo.createTask(defaultProject, "Do homework");
  todo.createTask(defaultProject, "Walk the dog");
  currentSelectedProject = defaultProject;

  function createProjectElement(project) {
    const li = document.createElement("li");
    li.textContent = project.getTitle();
    li.dataset.projectId = project.getId();
    li.className = "project";
    return li;
  }

  function createTaskElement(task) {
    const li = document.createElement("li");
    li.textContent = task.getTitle();
    li.dataset.projectId = task.getId();
    li.className = "task";
    return li;
  }

  function renderProjectTaskList(project) {
    const taskListUL = document.querySelector(".task-list");
    taskListUL.textContent = "";
    project.getTaskList().forEach((task) => {
      const taskElement = createTaskElement(task);
      taskListUL.appendChild(taskElement);
    });
  }

  function renderProjects() {
    const projectUL = document.querySelector(".project-list");
    const projectTitleDiv = document.querySelector(".project-title");
    projectUL.textContent = "";

    todo.getProjects().forEach((project) => {
      const projectElement = createProjectElement(project);
      projectUL.appendChild(projectElement);
    });

    projectUL.addEventListener("click", (e) => {
      const projectId = e.target.dataset.projectId;
      currentSelectedProject = todo.findProjectById(projectId);
      projectTitleDiv.textContent = currentSelectedProject.getTitle();
      renderProjectTaskList(currentSelectedProject);
    });
  }

  renderProjects();
}

ScreenController();
