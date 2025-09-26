import { state } from './state.js';
import { renderBoard, showLoadingMessage, showErrorMessage } from './ui.js';
import { loadTasksFromStorage, saveTasksToStorage } from './localstorage.js';

const API_URL = 'https://jsl-kanban-api.vercel.app/api/tasks';

/**
 * Fetches tasks from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of tasks.
 */
async function fetchTasksFromAPI() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  return response.json();
}

/**
 * Loads tasks: tries local storage first, then falls back to API.
 * Manages loading and error UI states.
 */
export async function fetchAndRenderTasks() {
  showLoadingMessage(true);
  try {
    let tasks = loadTasksFromStorage();
    if (!tasks || tasks.length === 0) {
      console.log('No tasks in local storage, fetching from API...');
      tasks = await fetchTasksFromAPI();
      saveTasksToStorage(tasks);
    }
    state.tasks = tasks;
    renderBoard();
  } catch (error) {
    console.error('Failed to load tasks:', error);
    showErrorMessage(error.message);
  } finally {
    showLoadingMessage(false);
  }
}