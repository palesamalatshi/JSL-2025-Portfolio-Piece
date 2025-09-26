// scripts/tasks/taskManager.js

import {
  loadTasksFromStorage,
  saveTasksToStorage,
} from "../utils/localStorage.js";
import { clearExistingTasks, renderTasks } from "../ui/render.js";
import { resetForm } from "./formUtils.js";

/**
 * Creates a new task object, saves it to storage, and updates the UI (P2.12).
 * @param {HTMLElement} modal - The new task modal element to close.
 */
export function addNewTask(modal) {
  const title = document.getElementById("new-task-title").value.trim();
  const description = document.getElementById("new-task-desc").value.trim();
  const status = document.getElementById("new-task-status").value;
  const priority = document.getElementById("new-task-priority").value; // Stretch Goal

  if (!title) return;

  const tasks = loadTasksFromStorage();
  const newId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  
  const newTask = {
    id: newId,
    title,
    description,
    status,
    priority, // Stretch Goal included
    board: "Launch Career", 
  };

  const updatedTasks = [...tasks, newTask];
  saveTasksToStorage(updatedTasks);

  clearExistingTasks();
  renderTasks(updatedTasks);
  
  resetForm();
  modal.classList.remove("show"); 
  document.getElementById("custom-backdrop").classList.remove("show");
}

/**
 * Updates an existing task's details and persists changes to local storage (P2.15, P2.16).
 * @param {number} taskId - The ID of the task to update.
 * @param {Object} updatedData - The form data containing new title, description, status, and priority.
 */
export function updateTask(taskId, updatedData) {
    const tasks = loadTasksFromStorage();
    const taskIndex = tasks.findIndex(t => t.id == taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
        saveTasksToStorage(tasks); 

        // P2.17: Re-render the board to move the task card if status changed
        clearExistingTasks();
        renderTasks(tasks);
    }
}

/**
 * Deletes a task by ID from storage and the UI (P2.20).
 * @param {number} taskId - The ID of the task to delete.
 */
export function deleteTask(taskId) {
    let tasks = loadTasksFromStorage();
    
    const updatedTasks = tasks.filter(t => t.id != taskId);

    saveTasksToStorage(updatedTasks);

    // P2.20: Re-render the entire board to remove the task
    clearExistingTasks();
    renderTasks(updatedTasks);
}