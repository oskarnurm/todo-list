import { TodoController } from "../controllers/TodoController.js";
import { renderProjectTaskList, renderProjects } from "../ui/DOMHelpers.js";

export function ScreenController() {
  let SELECTED_PROJECT = null;
  let SELECTED_TASK = null;
  const todo = TodoController();
  todo.loadFromStorage();

  // Make default project if non persisted in localStorage
  if (todo.getProjects().length === 0) {
    SELECTED_PROJECT = todo.createProject("Inbox");
  } else {
    SELECTED_PROJECT = todo.getProjects()[0];
  }

  // DOM element queries
  const taskListUL = document.querySelector(".task-list");
  const projectListUL = document.querySelector(".project-list");
  const projectTitleDiv = document.querySelector(".project-title");
  const addProjectBtn = document.querySelector(".project-add");
  const showTaskFormBtn = document.querySelector(".show-form");

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

  // Event handlers ===============================================

  // Get projects name
  addProjectBtn.addEventListener("click", () => {
    const title = prompt("Enter project name:");
    if (!title) return;
    todo.createProject(title);
    renderProjects(todo.getProjects(), projectListUL);
  });

  // Show task form
  showTaskFormBtn.addEventListener("click", () => {
    formDiv.hidden = false;
    showTaskFormBtn.hidden = true;
  });

  // Cancel task form
  formCancel.addEventListener("click", (e) => {
    e.preventDefault();
    formDiv.hidden = true;
    formDiv.reset();
    showTaskFormBtn.hidden = false;
  });

  // Submit task form
  formDiv.addEventListener("submit", (e) => {
    e.preventDefault();
    const daskData = {
      title: formTitle.value,
      desc: formDesc.value,
      date: formDate.value,
      prio: formPrio.value,
    };
    todo.createTask(SELECTED_PROJECT, daskData);

    formDiv.hidden = true;
    renderProjectTaskList(
      SELECTED_PROJECT,
      taskListUL,
      projectTitleDiv,
      showTaskFormBtn,
    );
    showTaskFormBtn.hidden = false;
    formDiv.reset();
  });

  // Remove task
  taskListUL.addEventListener("change", (e) => {
    if (e.target.type === "radio") {
      const taskId = e.target.closest(".task").dataset.taskId;
      todo.removeTask(SELECTED_PROJECT, taskId);
      renderProjectTaskList(
        SELECTED_PROJECT,
        taskListUL,
        projectTitleDiv,
        showTaskFormBtn,
      );
    }
  });

  // Switch project
  projectListUL.addEventListener("click", (e) => {
    const projectElement = e.target.closest("[data-project-id]");
    if (projectElement) {
      const projectId = projectElement.dataset.projectId;
      SELECTED_PROJECT = todo.findProjectById(projectId);
      renderProjectTaskList(
        SELECTED_PROJECT,
        taskListUL,
        projectTitleDiv,
        showTaskFormBtn,
      );
    }
  });

  // Remove project
  projectListUL.addEventListener("click", (e) => {
    if (e.target.matches("button.project-remove")) {
      const projectId = e.target.closest(".project").dataset.projectId;
      todo.removeProjectById(projectId);
      renderProjects(todo.getProjects(), projectListUL);
      taskListUL.textContent = "";
      projectTitleDiv.textContent = "";
      showTaskFormBtn.hidden = true;
    }
  });

  // Open task view/dialog/edit
  taskListUL.addEventListener("click", (e) => {
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
      renderProjectTaskList(
        SELECTED_PROJECT,
        taskListUL,
        projectTitleDiv,
        showTaskFormBtn,
      );
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

  // Initial render
  renderProjects(todo.getProjects(), projectListUL);
  renderProjectTaskList(
    SELECTED_PROJECT,
    taskListUL,
    projectTitleDiv,
    showTaskFormBtn,
  );
}
