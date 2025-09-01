export function createProjectElement(project) {
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

export function createTaskElement(task) {
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

export function renderProjectTaskList(
  project,
  taskListUL,
  projectTitleDiv,
  showTaskFormBtn,
) {
  taskListUL.textContent = "";
  projectTitleDiv.textContent = project.getTitle();
  project.getTaskList().forEach((task) => {
    const taskElement = createTaskElement(task);
    taskListUL.appendChild(taskElement);
  });
  showTaskFormBtn.hidden = false;
}

export function renderProjects(projects, projectListUL) {
  projectListUL.textContent = "";
  projects.forEach((project) => {
    const projectElement = createProjectElement(project);
    projectListUL.appendChild(projectElement);
  });
}
