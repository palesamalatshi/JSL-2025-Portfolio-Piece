// --- DOM ELEMENT REFERENCES ---
const tasksContainer = document.querySelector(".card-column-main");
const todoContainer = document.querySelector(
  '.column-div[data-status="todo"] .tasks-container'
);
const doingContainer = document.querySelector(
  '.column-div[data-status="doing"] .tasks-container'
);
const doneContainer = document.querySelector(
  '.column-div[data-status="done"] .tasks-container'
);
const toDoCountEl = document.querySelector("#toDoText");
const doingCountEl = document.querySelector("#doingText");
const doneCountEl = document.querySelector("#doneText");
const addNewTaskBtn = document.getElementById("add-new-task-btn");
const newTaskModal = document.getElementById("new-task-modal");
const newTaskForm = document.getElementById("new-task-form");
const closeNewTaskBtn = document.getElementById("close-new-task-btn");
const editTaskModal = document.getElementById("edit-task-modal");
const editTaskForm = document.getElementById("edit-task-form");
const closeEditTaskBtn = document.getElementById("close-edit-task-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");
const themeToggle = document.getElementById("theme-toggle");
const sidebar = document.getElementById("side-bar-div");
const hideSidebarBtn = document.getElementById("hide-sidebar-btn");
const showSidebarBtn = document.getElementById("show-sidebar-btn");

// --- STATE MANAGEMENT ---
let tasks = [];
let currentEditTaskId = null;

/**
 * Saves the current tasks array to local storage.
 */
function saveTasks() {
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

/**
 * Generates a simple unique ID.
 * @returns {string} A unique ID string.
 */
function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

/**
 * Renders all tasks to the correct columns on the board.
 */
function renderTasks() {
  todoContainer.innerHTML = "";
  doingContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  ["todo", "doing", "done"].forEach((status) => {
    const container =
      status === "todo"
        ? todoContainer
        : status === "doing"
        ? doingContainer
        : doneContainer;

    const filteredAndSorted = tasks
      .filter((t) => t.status === status)
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    filteredAndSorted.forEach((task) => {
      const div = document.createElement("div");
      div.className = "task-div";
      div.dataset.id = task.id;

      const titleSpan = document.createElement("span");
      titleSpan.className = "task-title";
      titleSpan.textContent = task.title;
      div.appendChild(titleSpan);

      const priorityCircle = document.createElement("span");
      priorityCircle.className = `priority-circle priority-${task.priority}`;
      div.appendChild(priorityCircle);

      div.addEventListener("click", () => openEditModal(task.id));
      container.appendChild(div);
    });

    updateCounts();
  });
}

/**
 * Updates the task counts in the column headers.
 */
function updateCounts() {
  toDoCountEl.textContent = `TODO (${
    tasks.filter((t) => t.status === "todo").length
  })`;
  doingCountEl.textContent = `DOING (${
    tasks.filter((t) => t.status === "doing").length
  })`;
  doneCountEl.textContent = `DONE (${
    tasks.filter((t) => t.status === "done").length
  })`;
}

/**
 * Fetches initial tasks from an API.
 * @returns {Promise<Array>} A promise that resolves with the tasks array.
 */
async function fetchInitialTasks() {
  try {
    const response = await fetch(
      "https://jsl-kanban-api.vercel.app/api/tasks"
    );
    if (!response.ok) throw new Error("Network response was not ok.");
    const apiTasks = await response.json();
    // API tasks might not have IDs, so we add them
    return apiTasks.map((task) => ({ ...task, id: generateId() }));
  } catch (error) {
    console.error("Failed to fetch tasks from API:", error);
    // Return a default set of tasks if the API fails
    return [
      {
        id: generateId(),
        title: "API fetch failed - default task",
        description: "Check the console for errors.",
        status: "todo",
        priority: "high",
      },
    ];
  }
}

/**
 * Opens the edit modal and populates it with task data.
 * @param {string} taskId - The ID of the task to edit.
 */
function openEditModal(taskId) {
  currentEditTaskId = taskId;
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;
  editTaskForm["edit-task-title"].value = task.title;
  editTaskForm["edit-task-desc"].value = task.description;
  editTaskForm["edit-task-status"].value = task.status;
  editTaskForm["edit-task-priority"].value = task.priority;
  editTaskModal.showModal();
}

// --- EVENT LISTENERS ---

// Modal Event Listeners
addNewTaskBtn.addEventListener("click", () => {
  newTaskForm.reset();
  newTaskModal.showModal();
});
closeNewTaskBtn.addEventListener("click", () => newTaskModal.close());
closeEditTaskBtn.addEventListener("click", () => editTaskModal.close());

// Form Submission Event Listeners
newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTask = {
    id: generateId(),
    title: newTaskForm["new-task-title"].value.trim(),
    description: newTaskForm["new-task-desc"].value.trim(),
    status: newTaskForm["new-task-status"].value,
    priority: newTaskForm["new-task-priority"].value,
  };
  if (!newTask.title) return alert("Title is required.");
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  newTaskModal.close();
});

editTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = tasks.find((t) => t.id === currentEditTaskId);
  if (!task) return;
  task.title = editTaskForm["edit-task-title"].value.trim();
  task.description = editTaskForm["edit-task-desc"].value.trim();
  task.status = editTaskForm["edit-task-status"].value;
  task.priority = editTaskForm["edit-task-priority"].value;
  if (!task.title) return alert("Title is required.");
  saveTasks();
  renderTasks();
  editTaskModal.close();
});

deleteTaskBtn.addEventListener("click", () => {
  if (!currentEditTaskId) return;
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((t) => t.id !== currentEditTaskId);
    saveTasks();
    renderTasks();
    editTaskModal.close();
  }
});

// UI Feature Event Listeners
hideSidebarBtn.addEventListener("click", () => {
  sidebar.style.display = "none";
  showSidebarBtn.style.display = "block";
});
showSidebarBtn.addEventListener("click", () => {
  sidebar.style.display = "flex";
  showSidebarBtn.style.display = "none";
});

themeToggle.addEventListener("change", (e) => {
  if (e.target.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
});

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", async () => {
  // Load theme first
  if (localStorage.getItem("theme") === "dark") {
    themeToggle.checked = true;
    document.body.classList.add("dark-mode");
  }

  // Load tasks
  const savedTasks = localStorage.getItem("kanbanTasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  } else {
    tasksContainer.innerHTML = "<p>Loading tasks from API...</p>";
    tasks = await fetchInitialTasks();
    saveTasks();
  }

  renderTasks();
});