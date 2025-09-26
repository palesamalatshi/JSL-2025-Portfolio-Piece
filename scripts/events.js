import { state } from './state.js';
import { renderBoard, openEditModal } from './ui.js';
import { saveTasksToStorage } from './localstorage.js';

const addTaskModal = document.getElementById('add-new-task-modal');
const editTaskModal = document.getElementById('edit-task-modal');
const addTaskForm = document.getElementById('add-task-form');
const editTaskForm = document.getElementById('edit-task-form');

/**
 * Initializes all event listeners for the application.
 */
export function initializeEventListeners() {
  // Open "Add Task" modal
  document.getElementById('add-task-btn').addEventListener('click', () => {
    addTaskForm.reset(); // Clear form before showing
    addTaskModal.showModal();
  });

  // Close "Add Task" modal
  document.getElementById('cancel-add-task-btn').addEventListener('click', () => {
    addTaskModal.close();
  });
  
  // Close "Edit Task" modal
  document.getElementById('close-edit-modal-btn').addEventListener('click', () => {
    editTaskModal.close();
  });
  
  // Handle clicking on a task to open the edit modal
  document.querySelector('.card-column-main').addEventListener('click', (event) => {
    const taskElement = event.target.closest('.task-div');
    if (taskElement) {
      const taskId = taskElement.dataset.taskId;
      openEditModal(taskId);
    }
  });

  // Handle "Add New Task" form submission
  addTaskForm.addEventListener('submit', handleAddTask);

  // Handle "Edit Task" form submission
  editTaskForm.addEventListener('submit', handleSaveChanges);

  // Handle "Delete Task" button click
  document.getElementById('delete-task-btn').addEventListener('click', handleDeleteTask);
}

/**
 * Handles the creation of a new task from the form.
 */
function handleAddTask(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const newTask = {
    id: `task-${Date.now()}`,
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status'),
    priority: formData.get('priority'),
  };
  state.tasks.push(newTask);
  saveTasksToStorage(state.tasks);
  renderBoard();
  addTaskModal.close();
}

/**
 * Handles saving changes to an existing task.
 */
function handleSaveChanges(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const updatedStatus = formData.get('status');
  const updatedPriority = formData.get('priority');

  state.tasks = state.tasks.map(task => {
    if (task.id === state.currentlyEditingTaskId) {
      return { ...task, status: updatedStatus, priority: updatedPriority };
    }
    return task;
  });

  saveTasksToStorage(state.tasks);
  renderBoard();
  editTaskModal.close();
  state.currentlyEditingTaskId = null;
}

/**
 * Handles the deletion of the currently edited task.
 */
function handleDeleteTask() {
  const taskToDelete = state.tasks.find(t => t.id === state.currentlyEditingTaskId);
  if (!taskToDelete) return;

  const isConfirmed = confirm(`Are you sure you want to delete the task "${taskToDelete.title}"?`);
  if (isConfirmed) {
    state.tasks = state.tasks.filter(task => task.id !== state.currentlyEditingTaskId);
    saveTasksToStorage(state.tasks);
    renderBoard();
    editTaskModal.close();
    state.currentlyEditingTaskId = null;
  }
}