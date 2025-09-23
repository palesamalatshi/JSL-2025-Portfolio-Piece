import {
  readTasksFromStorage,
  saveTasksToStorage,
  loadInitialIfMissing,
} from "../utils/localStorage.js";
import { clearExistingTasks, renderTasks, updateCounts } from "../ui/render.js";
import { resetNewTaskForm } from "./formUtils.js";

/**
 * Add new task from new-task form inputs
 */
export function addNewTaskFromForm() {
  const title = document.getElementById("new-task-title").value.trim();
  const description = document.getElementById("new-task-desc").value.trim();
  const status = document.getElementById("new-task-status").value;

  if (!title) return;

  const tasks = readTasksFromStorage() ?? loadInitialIfMissing();
  const newId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  const newTask = { id: newId, title, description, status, board: "Launch Career" };

  const updated = [...tasks, newTask];
  saveTasksToStorage(updated);

  // re-render
  clearExistingTasks();
  renderTasks(updated);
  updateCounts(updated);

  // reset & close
  resetNewTaskForm();
}

/**
 * Save changes to an existing task (edit modal)
 */
export function saveTaskChanges(taskId) {
  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-desc").value.trim();
  const status = document.getElementById("task-status").value;

  const tasks = readTasksFromStorage() ?? loadInitialIfMissing();
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx === -1) return;

  tasks[idx].title = title;
  tasks[idx].description = description;
  tasks[idx].status = status;

  saveTasksToStorage(tasks);
  clearExistingTasks();
  renderTasks(tasks);
  updateCounts(tasks);
}

/**
 * Delete a task by id
 */
export function deleteTaskById(taskId) {
  const tasks = readTasksFromStorage() ?? loadInitialIfMissing();
  const filtered = tasks.filter((t) => t.id !== taskId);
  saveTasksToStorage(filtered);
  clearExistingTasks();
  renderTasks(filtered);
  updateCounts(filtered);
}

/**
 * Utility to get a task by id (returns copy)
 */
export function getTaskById(id) {
  const tasks = readTasksFromStorage() ?? loadInitialIfMissing();
  return tasks.find((t) => t.id === id) ?? null;
}
