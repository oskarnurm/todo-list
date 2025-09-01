import { Task } from "../models/Task.js";
import { Project } from "../models/Project.js";

export function TodoController() {
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
        const project = Project(projectData.title);
        projectData.tasks.forEach((taskData) => {
          const task = Task(taskData);
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
