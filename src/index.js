import "./style.css";
import Project from "./Projects";
import Task from "./Task";

const p = new Project("school");
const t1 = new Task("Homework");

p.add(t1);
console.log(p.getLib());
