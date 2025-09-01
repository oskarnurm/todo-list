export function Project(title) {
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
