import { initTheme } from "./ui/theme.js";
import { readTasksFromStorage, saveTasksToStorage } from "./utils/localStorage.js";
import { initialTasks } from "./initialData.js";
import { clearExistingTasks, renderTasks, updateCounts } from "./ui/render.js";
import {
  setupModalCloseHandler,
  setupNewTaskModalHandler,
  setupSidebarHandlers,
  setupModalActions,
  renderFromStorageOrTasks,
} from "./ui/modalHandlers.js";

/* API endpoint from the brief */
const TASKS_API = "https://jsl-kanban-api.vercel.app/";

/* status area */
const statusArea = document.getElementById("status-area");

/* fetch tasks from API with simple fallback/retry of 1 attempt */
async function fetchInitialTasks() {
  statusArea.textContent = "Loading tasks…";
  try {
    const res = await fetch(`${TASKS_API}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Invalid data");
    // persist
    saveTasksToStorage(data);
    statusArea.textContent = "";
    return data;
  } catch (err) {
    console.warn("Fetch failed, using local storage or initial data:", err);
    statusArea.textContent = "Unable to fetch tasks from server. Loading saved tasks.";
    // fallback to localStorage or initialData saved by localStorage util
    const storedRaw = readTasksFromStorage();
    if (storedRaw && Array.isArray(storedRaw)) {
      statusArea.textContent = "Loaded saved tasks.";
      return storedRaw;
    }
    // as last resort, use bundled initialTasks
    statusArea.textContent = "Loaded default tasks.";
    saveTasksToStorage(initialTasks);
    return initialTasks;
  }
}

/* init app */
async function initTaskBoard() {
  // theme
  initTheme();

  // setup UI handlers
  setupModalCloseHandler();
  setupModalActions();
  setupNewTaskModalHandler();
  setupSidebarHandlers();

  // load tasks and render
  const tasks = await fetchInitialTasks();
  clearExistingTasks();
  renderTasks(tasks);
  updateCounts(tasks);
}

document.addEventListener("DOMContentLoaded", initTaskBoard);
