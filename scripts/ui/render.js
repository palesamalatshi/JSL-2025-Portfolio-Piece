import { createTaskElement } from "./taskElement.js";

/** find container by status */
function getTaskContainer(status) {
  if (status === "todo") return document.getElementById("todo-container");
  if (status === "doing") return document.getElementById("doing-container");
  if (status === "done") return document.getElementById("done-container");
  return null;
}

export function clearExistingTasks() {
  document.querySelectorAll(".tasks-container").forEach((c) => (c.innerHTML = ""));
}

/** render all tasks */
export function renderTasks(tasks) {
  // sort by id ascending for stable ordering
  const sorted = (tasks || []).slice().sort((a, b) => a.id - b.id);
  sorted.forEach((task) => {
    const container = getTaskContainer(task.status);
    if (!container) return;
    const el = createTaskElement(task);
    container.appendChild(el);
  });
  updateCounts(tasks);
}

/** update column counts */
export function updateCounts(tasks) {
  const todo = (tasks || []).filter((t) => t.status === "todo").length;
  const doing = (tasks || []).filter((t) => t.status === "doing").length;
  const done = (tasks || []).filter((t) => t.status === "done").length;

  const todoCount = document.getElementById("todo-count");
  const doingCount = document.getElementById("doing-count");
  const doneCount = document.getElementById("done-count");
  if (todoCount) todoCount.textContent = todo;
  if (doingCount) doingCount.textContent = doing;
  if (doneCount) doneCount.textContent = done;
}
