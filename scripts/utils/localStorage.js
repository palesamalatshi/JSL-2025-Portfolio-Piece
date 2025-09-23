import { initialTasks } from "../initialData.js";

const TASKS_KEY = "kanban_tasks_v1";
const THEME_KEY = "kanban_theme_v1";

/**
 * Load tasks from localStorage. If none, return null so caller can fetch initial data.
 */
export function readTasksFromStorage() {
  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse tasks from localStorage:", err);
    return null;
  }
}

/**
 * Save tasks array into localStorage
 * @param {Array} tasks
 */
export function saveTasksToStorage(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

/**
 * Initialize storage with provided tasks (e.g., fetched API or initialData)
 */
export function initTasks(tasks) {
  saveTasksToStorage(tasks);
}

/* Theme helpers */
export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || null;
}
export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/* Convenience: return either stored tasks or default initial tasks */
export function loadInitialIfMissing() {
  const stored = readTasksFromStorage();
  if (stored && Array.isArray(stored)) return stored;
  // if missing, bootstrap with initialTasks
  saveTasksToStorage(initialTasks);
  return initialTasks;
}
