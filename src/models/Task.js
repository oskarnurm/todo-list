export function Task(opts) {
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
