import { state } from './state.js';

const columns = {
  todo: document.querySelector('.column-div[data-status="todo"] .tasks-container'),
  doing: document.querySelector('.column-div[data-status="doing"] .tasks-container'),
  done: document.querySelector('.column-div[data-status="done"] .tasks-container'),
};

/**
 * Renders the entire task board from the current state, sorted by priority.
 */
export function renderBoard() {
  // Clear all columns
  Object.values(columns).forEach(col => col.innerHTML = '');

  if (state.tasks.length === 0) return;

  // Define priority order for sorting
  const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
  const sortedTasks = [...state.tasks].sort((a, b) => {
      return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
  });

  // Render sorted tasks
  sortedTasks.forEach(task => {
    const taskElement = createTaskElement(task);
    columns[task.status]?.appendChild(taskElement);
  });

  updateColumnHeaders();
}

/**
 * Creates an HTML element for a single task.
 * @param {object} task - The task object to create an element for.
 * @returns {HTMLElement} The created task element.
 */
function createTaskElement(task) {
  const element = document.createElement('div');
  element.classList.add('task-div');
  element.dataset.taskId = task.id;
  element.innerHTML = `
    ${task.title}
    <span class="priority-circle priority-${task.priority?.toLowerCase()}"></span>
  `;
  return element;
}

/**
 * Updates the counts in the column headers.
 */
function updateColumnHeaders() {
  const counts = state.tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, { todo: 0, doing: 0, done: 0 });

  document.getElementById('toDoText').textContent = `TODO (${counts.todo})`;
  document.getElementById('doingText').textContent = `DOING (${counts.doing})`;
  document.getElementById('doneText').textContent = `DONE (${counts.done})`;
}

/**
 * Shows or hides a loading message on the board.
 * @param {boolean} show - Whether to show or hide the message.
 */
export function showLoadingMessage(show) {
    const mainContainer = document.querySelector('.card-column-main');
    let messageEl = document.getElementById('loading-message');
    if (show) {
        if (!messageEl) {
            messageEl = document.createElement('p');
            messageEl.id = 'loading-message';
            messageEl.className = 'loading-message';
            messageEl.textContent = 'Loading tasks...';
            mainContainer.prepend(messageEl);
        }
    } else {
        messageEl?.remove();
    }
}

/**
 * Displays an error message on the board.
 * @param {string} message - The error message to display.
 */
export function showErrorMessage(message) {
    document.querySelector('.card-column-main').innerHTML = `<p class="error-message">Error: ${message}</p>`;
}

/**
 * Opens the edit modal and populates it with data for a specific task.
 * @param {string} taskId - The ID of the task to edit.
 */
export function openEditModal(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  state.currentlyEditingTaskId = taskId;
  
  const modal = document.getElementById('edit-task-modal');
  modal.querySelector('#edit-task-title-header').textContent = task.title;
  modal.querySelector('#edit-task-description-display').textContent = task.description || "No description provided.";
  modal.querySelector('#edit-task-status').value = task.status;
  modal.querySelector('#edit-task-priority').value = task.priority || 'Medium';
  modal.showModal();
}