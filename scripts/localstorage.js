/**
 * Loads tasks from localStorage.
 * @returns {Array|null} The array of tasks or null if not found.
 */
export function loadTasksFromStorage() {
  const storedTasks = localStorage.getItem('tasks');
  return storedTasks ? JSON.parse(storedTasks) : null;
}

/**
 * Saves the given task array to localStorage.
 * @param {Array} tasks - The array of tasks to save.
 */
export function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}