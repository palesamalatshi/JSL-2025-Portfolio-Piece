import { getTaskById, saveTaskChanges, deleteTaskById, addNewTaskFromForm } from "../tasks/taskManager.js";
import { readTasksFromStorage, loadInitialIfMissing } from "../utils/localStorage.js";
import { clearExistingTasks, renderTasks, updateCounts } from "./render.js";

/* references */
const taskModal = document.getElementById("task-modal");
const taskForm = document.getElementById("task-form");
const taskTitleInput = () => document.getElementById("task-title");
const taskDescInput = () => document.getElementById("task-desc");
const taskStatusInput = () => document.getElementById("task-status");
let currentEditingId = null;

/* open existing task modal by id */
export function openTaskModal(taskId) {
  const task = getTaskById(Number(taskId));
  if (!task) return;
  currentEditingId = Number(taskId);

  taskTitleInput().value = task.title || "";
  taskDescInput().value = task.description || "";
  taskStatusInput().value = task.status || "todo";

  // show dialog (use dialog if available)
  if (typeof taskModal.showModal === "function") taskModal.showModal();
  else taskModal.style.display = "block";
}

/* set up close button */
export function setupModalCloseHandler() {
  const closeBtn = document.getElementById("close-modal-btn");
  closeBtn.addEventListener("click", () => {
    if (typeof taskModal.close === "function") taskModal.close();
    currentEditingId = null;
  });
}

/* hooking save and delete */
export function setupModalActions() {
  const saveBtn = document.getElementById("save-changes-btn");
  const deleteBtn = document.getElementById("delete-task-btn");

  saveBtn.addEventListener("click", () => {
    if (!currentEditingId) return;
    saveTaskChanges(currentEditingId);
    if (typeof taskModal.close === "function") taskModal.close();
    currentEditingId = null;
  });

  deleteBtn.addEventListener("click", () => {
    if (!currentEditingId) return;
    // simple confirmation
    const confirmed = confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;
    deleteTaskById(currentEditingId);
    if (typeof taskModal.close === "function") taskModal.close();
    currentEditingId = null;
  });
}

/* New task modal handlers */
export function setupNewTaskModalHandler() {
  const overlay = document.getElementById("new-task-overlay");
  const openBtn = document.getElementById("add-task-btn");
  const closeBtn = document.getElementById("new-close-modal-btn");
  const form = document.getElementById("new-task-form");
  const backdrop = document.getElementById("custom-backdrop");
  // open
  openBtn.addEventListener("click", () => {
    overlay.hidden = false;
    backdrop.hidden = false;
  });
  // close
  closeBtn.addEventListener("click", () => {
    overlay.hidden = true;
    backdrop.hidden = true;
  });
  backdrop.addEventListener("click", () => {
    overlay.hidden = true;
    backdrop.hidden = true;
  });
  // submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewTaskFromForm();
    overlay.hidden = true;
    backdrop.hidden = true;
  });
}

/* Sidebar - hide/show & mobile menu */
export function setupSidebarHandlers() {
  const hideBtn = document.getElementById("hide-sidebar-btn");
  const sideBar = document.getElementById("side-bar-div");
  const mobileBtn = document.getElementById("mobile-menu-btn");

  if (hideBtn) {
    hideBtn.addEventListener("click", () => {
      sideBar.style.display = "none";
    });
  }

  if (mobileBtn) {
    mobileBtn.addEventListener("click", () => {
      // toggle show
      if (sideBar.style.display === "flex") {
        sideBar.style.display = "none";
      } else {
        sideBar.style.display = "flex";
      }
    });
  }
}

/* helper for initial rendering */
export function renderFromStorageOrTasks(tasks) {
  clearExistingTasks();
  renderTasks(tasks);
  updateCounts(tasks);
}
