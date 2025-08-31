import "./style.css";

function Task(opts) {
  const id = crypto.randomUUID();
  const data = {
    title: opts.title,
    desc: opts.desc || "",
    date: opts.date || null,
    prio: opts.prio || "low",
  };

  const getTitle = () => data.title;
  const getDesc = () => data.desc;
  const getDate = () => data.date;
  const getPrio = () => data.prio;
  const getId = () => id;
  const updateTask = (taskData) => Object.assign(data, taskData);

  return { getTitle, getDesc, getDate, getPrio, getId, updateTask };
}

function Project(title) {
  const id = crypto.randomUUID();
  let _title = title;
  let tasks = [];

  const getTitle = () => _title;
  const setTitle = (newTitle) => (_title = newTitle);
  const getTaskList = () => tasks;
  const addTask = (task) => tasks.push(task);
  const updateTaskList = (newList) => (tasks = newList);
  const getId = () => id;
  const removeTaskById = (id) =>
    (tasks = tasks.filter((task) => task.getId() !== id));
  const findTaskById = (id) => tasks.find((task) => task.getId() === id);

  return {
    getId,
    getTitle,
    setTitle,
    getTaskList,
    addTask,
    updateTaskList,
    findTaskById,
    removeTaskById,
  };
}

function TodoController() {
  let projects = [];

  const saveToStorage = () => {
    const projectsData = projects.map((project) => ({
      id: project.getId(),
      title: project.getTitle(),
      tasks: project.getTaskList().map((task) => ({
        id: task.getId(),
        title: task.getTitle(),
        desc: task.getDesc(),
        date: task.getDate(),
        prio: task.getPrio(),
      })),
    }));
    localStorage.setItem("Todo", JSON.stringify(projectsData));
  };

  const loadFromStorage = () => {
    const savedData = localStorage.getItem("Todo");
    if (savedData) {
      const projectsData = JSON.parse(savedData);

      projectsData.forEach((projectData) => {
        const project = Project(projectData.title); // Recreate with methods
        projectData.tasks.forEach((taskData) => {
          const task = Task(taskData); // Recreate with methods
          project.addTask(task);
        });
        projects.push(project);
      });
    }
  };

  const createProject = (title) => {
    const newProject = Project(title);
    projects.push(newProject);
    saveToStorage();
    return newProject;
  };

  const createTask = (project, taskData) => {
    const newTask = Task(taskData);
    project.addTask(newTask);
    saveToStorage();
    return newTask;
  };

  const updateTask = (task, taskData) => {
    task.updateTask(taskData);
    saveToStorage();
  };

  const removeTask = (project, id) => {
    project.removeTaskById(id);
    saveToStorage();
  };

  const findProjectById = (id) =>
    projects.find((project) => project.getId() === id);

  const updateProject = (project, newTitle) => {
    project.setTitle(newTitle);
    saveToStorage();
  };

  const removeProjectById = (id) => {
    projects = projects.filter((project) => project.getId() !== id);
    saveToStorage();
  };

  const getProjects = () => projects;

  return {
    findProjectById,
    createProject,
    createTask,
    getProjects,
    removeProjectById,
    saveToStorage,
    updateTask,
    removeTask,
    updateProject,
    loadFromStorage,
  };
}

function ScreenController() {
  let SELECTED_PROJECT = null;
  let SELECTED_TASK = null;
  const todo = TodoController();
  todo.loadFromStorage();

  // Make default project if non persisted
  if (todo.getProjects().length === 0) {
    SELECTED_PROJECT = todo.createProject("Inbox");
  } else {
    SELECTED_PROJECT = todo.getProjects()[0];
  }

  const taskListUL = document.querySelector(".task-list");
  const projectListUL = document.querySelector(".project-list");
  const projectTitleDiv = document.querySelector(".project-title");
  const addProjectBtn = document.querySelector(".project-add");
  const showTaskForm = document.querySelector(".show-form");

  const formDiv = document.querySelector(".form");
  const formTitle = document.getElementById("form-title");
  const formDesc = document.getElementById("form-desc");
  const formDate = document.getElementById("form-date");
  const formPrio = document.getElementById("form-prio");
  const formCancel = document.querySelector(".cancel");

  const popupDiv = document.querySelector(".popup");
  const popupClose = document.querySelector(".popup-close");
  const popupTaskTitle = document.getElementById("popup-title");
  const popupTaskDesc = document.getElementById("popup-desc");
  const popupTaskDate = document.getElementById("popup-date");
  const popupTaskPrio = document.getElementById("popup-prio");

  function createProjectElement(project) {
    const li = document.createElement("li");
    const removeBtn = document.createElement("button");
    const projectH = document.createElement("h3");

    removeBtn.textContent = "-";
    projectH.textContent = `# ${project.getTitle()}`;

    removeBtn.className = "project-remove";
    li.className = "project";
    li.dataset.projectId = project.getId();

    li.appendChild(projectH);
    li.appendChild(removeBtn);
    return li;
  }

  function createTaskElement(task) {
    const li = document.createElement("li");
    const titleContainer = document.createElement("div");
    const titleH = document.createElement("h4");
    const descSpan = document.createElement("span");
    const dateDiv = document.createElement("div");
    const removeDiv = document.createElement("input");

    titleContainer.className = "task-title";
    descSpan.className = "task-desc";
    dateDiv.className = "task-date";
    removeDiv.className = `prio-${task.getPrio()}`;
    removeDiv.type = "radio";

    titleH.textContent = task.getTitle();
    descSpan.textContent = task.getDesc();
    dateDiv.textContent = task.getDate();

    titleContainer.appendChild(removeDiv);
    titleContainer.appendChild(titleH);
    li.appendChild(titleContainer);
    li.appendChild(descSpan);
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
    showTaskForm.hidden = false;
  }

  function renderProjects(projects) {
    projectListUL.textContent = "";
    projects.forEach((project) => {
      const projectElement = createProjectElement(project);
      projectListUL.appendChild(projectElement);
    });
  }

  // Get projects name
  addProjectBtn.addEventListener("click", () => {
    // TODO: use dialog to get project name in the future
    const title = prompt("Enter project name:");
    if (!title) return;
    todo.createProject(title);
    renderProjects(todo.getProjects());
  });

  // Show task form
  showTaskForm.addEventListener("click", () => {
    formDiv.hidden = false;
    showTaskForm.hidden = true;
  });

  // Cancel task form
  formCancel.addEventListener("click", () => {
    formDiv.reset();
    formDiv.hidden = true;
    showTaskForm.hidden = false;
  });

  // Submit the task form
  formDiv.addEventListener("submit", (e) => {
    e.preventDefault();
    const daskData = {
      title: formTitle.value,
      desc: formDesc.value,
      date: formDate.value,
      prio: formPrio.value,
    };
    todo.createTask(SELECTED_PROJECT, daskData);

    // Does the rendering order matter here?
    formDiv.hidden = true;
    renderProjectTaskList(SELECTED_PROJECT);
    showTaskForm.hidden = false;
    formDiv.reset();
  });

  // Remove task
  taskListUL.addEventListener("change", (e) => {
    if (e.target.type === "radio") {
      const taskId = e.target.closest(".task").dataset.taskId;
      todo.removeTask(SELECTED_PROJECT, taskId);
      renderProjectTaskList(SELECTED_PROJECT);
    }
  });

  // Switch projects
  projectListUL.addEventListener("click", (e) => {
    const projectElement = e.target.closest("[data-project-id]");
    if (projectElement) {
      const projectId = projectElement.dataset.projectId;
      SELECTED_PROJECT = todo.findProjectById(projectId);
      renderProjectTaskList(SELECTED_PROJECT);
    }
  });

  // Remove projects
  projectListUL.addEventListener("click", (e) => {
    if (e.target.matches("button.project-remove")) {
      const projectId = e.target.closest(".project").dataset.projectId;
      todo.removeProjectById(projectId);
      renderProjects(todo.getProjects());
      // TODO: figure out a prettier way to do this?
      taskListUL.textContent = "";
      projectTitleDiv.textContent = "";
      showTaskForm.hidden = true;
    }
  });

  // Open task view/dialog/edit
  taskListUL.addEventListener("click", (e) => {
    // Don't open pop-up when clicking on radio button because that should only remove the task
    if (e.target.type === "radio") {
      return;
    }
    const taskElement = e.target.closest(".task");
    if (taskElement) {
      const taskId = taskElement.dataset.taskId;
      SELECTED_TASK = SELECTED_PROJECT.findTaskById(taskId);

      popupTaskTitle.value = SELECTED_TASK.getTitle();
      popupTaskDesc.value = SELECTED_TASK.getDesc();
      popupTaskDate.value = SELECTED_TASK.getDate();
      popupTaskPrio.value = SELECTED_TASK.getPrio();
      popupDiv.showModal();
    }
  });

  // Submit edits from view/popup
  popupDiv.addEventListener("submit", (e) => {
    e.preventDefault();
    const daskData = {
      title: popupTaskTitle.value,
      desc: popupTaskDesc.value,
      date: popupTaskDate.value,
      prio: popupTaskPrio.value,
    };
    if (SELECTED_TASK) {
      todo.updateTask(SELECTED_TASK, daskData);
      renderProjectTaskList(SELECTED_PROJECT);
      popupDiv.close();
    }
  });

  // Close popup
  popupClose.addEventListener("click", () => popupDiv.close());

  // When the user clicks anywhere outside of the dialog, close it
  window.onclick = function (e) {
    if (e.target == popupDiv) {
      popupDiv.close();
    }
  };

  renderProjects(todo.getProjects());
  renderProjectTaskList(SELECTED_PROJECT);
}

ScreenController();
