const tasksKey = "kanbanTasks";

const todoContainer = document.querySelector('.column-div[data-status="todo"] .tasks-container');
const doingContainer = document.querySelector('.column-div[data-status="doing"] .tasks-container');
const doneContainer = document.querySelector('.column-div[data-status="done"] .tasks-container');

const toDoCount = document.querySelector('#toDoText');
const doingCount = document.querySelector('#doingText');
const doneCount = document.querySelector('#doneText');

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

let tasks = [];
let currentEditTaskId = null;

function saveTasks() {
  localStorage.setItem(tasksKey, JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem(tasksKey);
  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    tasks = [
      { id: generateId(), title: "Launch Epic Career 🚀", description: "", status: "todo", priority: "medium" },
      { id: generateId(), title: "Conquer React⚛️", description: "", status: "todo", priority: "medium" },
      { id: generateId(), title: "Understand Databases⚙️", description: "", status: "todo", priority: "medium" },
      { id: generateId(), title: "Crush Frameworks🖼️", description: "", status: "todo", priority: "medium" },
      { id: generateId(), title: "Master JavaScript 💛", description: "", status: "doing", priority: "medium" },
      { id: generateId(), title: "Never Give Up 🏆", description: "", status: "doing", priority: "medium" },
      { id: generateId(), title: "Explore ES6 Features 🚀", description: "", status: "done", priority: "medium" },
      { id: generateId(), title: "Have fun 🥳", description: "", status: "done", priority: "medium" }
    ];
    saveTasks();
  }
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function renderTasks() {
  todoContainer.innerHTML = "";
  doingContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  ["todo", "doing", "done"].forEach(status => {
    const container = getContainerByStatus(status);
    const filteredTasks = tasks
      .filter(t => t.status === status)
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    filteredTasks.forEach(task => {
      const div = document.createElement("div");
      div.className = "task-div";
      div.dataset.id = task.id;

      let titleSpan = document.createElement("span");
      titleSpan.className = "task-title";
      titleSpan.textContent = task.title;
      div.appendChild(titleSpan);

      let priorityCircle = document.createElement("span");
      priorityCircle.className = `priority-circle priority-${task.priority}`;
      div.appendChild(priorityCircle);

      div.addEventListener("click", () => openEditModal(task.id));

      container.appendChild(div);
    });
    updateCount(status, filteredTasks.length);
  });
}

function getContainerByStatus(status) {
  if (status === "todo") return todoContainer;
  if (status === "doing") return doingContainer;
  if (status === "done") return doneContainer;
}

function updateCount(status, count) {
  if (status === "todo") toDoCount.textContent = `TODO (${count})`;
  if (status === "doing") doingCount.textContent = `DOING (${count})`;
  if (status === "done") doneCount.textContent = `DONE (${count})`;
}

addNewTaskBtn.addEventListener("click", () => {
  newTaskForm.reset();
  newTaskModal.showModal();
  disablePageInteraction(true);
});

closeNewTaskBtn.addEventListener("click", () => {
  newTaskModal.close();
  disablePageInteraction(false);
});

newTaskForm.addEventListener("submit", e => {
  e.preventDefault();
  const newTask = {
    id: generateId(),
    title: newTaskForm["new-task-title"].value.trim(),
    description: newTaskForm["new-task-desc"].value.trim(),
    status: newTaskForm["new-task-status"].value,
    priority: newTaskForm["new-task-priority"].value
  };
  if (!newTask.title) return alert("Title is required.");
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  newTaskModal.close();
  disablePageInteraction(false);
});

function openEditModal(taskId) {
  currentEditTaskId = taskId;
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  editTaskForm["edit-task-title"].value = task.title;
  editTaskForm["edit-task-desc"].value = task.description;
  editTaskForm["edit-task-status"].value = task.status;
  editTaskForm["edit-task-priority"].value = task.priority;
  editTaskModal.showModal();
  disablePageInteraction(true);
}

closeEditTaskBtn.addEventListener("click", () => {
  editTaskModal.close();
  disablePageInteraction(false);
});

editTaskForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!currentEditTaskId) return;
  const task = tasks.find(t => t.id === currentEditTaskId);
  if (!task) return;
  task.title = editTaskForm["edit-task-title"].value.trim();
  task.description = editTaskForm["edit-task-desc"].value.trim();
  task.status = editTaskForm["edit-task-status"].value;
  task.priority = editTaskForm["edit-task-priority"].value;
  if (!task.title) return alert("Title is required.");
  saveTasks();
  renderTasks();
  editTaskModal.close();
  disablePageInteraction(false);
});

deleteTaskBtn.addEventListener("click", () => {
  if (!currentEditTaskId) return;
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(t => t.id !== currentEditTaskId);
    saveTasks();
    renderTasks();
    editTaskModal.close();
    disablePageInteraction(false);
  }
});

hideSidebarBtn.addEventListener("click", () => {
  sidebar.style.display = "none";
  showSidebarEye();
});

function showSidebarEye() {
  if (document.getElementById("sidebar-eye")) return;
  const eyeBtn = document.createElement("button");
  eyeBtn.id = "sidebar-eye";
  eyeBtn.textContent = "👀";
  eyeBtn.style.position = "fixed";
  eyeBtn.style.bottom = "30px";
  eyeBtn.style.left = "10px";
  eyeBtn.style.width = "56px";
  eyeBtn.style.height = "48px";
  eyeBtn.style.backgroundColor = "#a8a4ff";
  eyeBtn.style.borderRadius = "0 100px 100px 0";
  eyeBtn.style.fontSize = "24px";
  eyeBtn.style.cursor = "pointer";
  eyeBtn.style.border = "none";
  eyeBtn.style.zIndex = "100";
  document.body.appendChild(eyeBtn);

  eyeBtn.addEventListener("click", () => {
    sidebar.style.display = "flex";
    eyeBtn.remove();
  });
}

function disablePageInteraction(disable) {
  document.body.style.overflow = disable ? "hidden" : "auto";
}

themeToggle.addEventListener("change", e => {
  if (e.target.checked) {
    document.documentElement.style.setProperty("--primary-color", "#20212c");
    document.documentElement.style.setProperty("--secondary-color", "#2c2e3e");
    document.documentElement.style.setProperty("--primary-font-color", "#ffffff");
    document.documentElement.style.setProperty("--secondary-font-color", "#a8a8c6");
  } else {
    document.documentElement.style.setProperty("--primary-color", "#ffffff");
    document.documentElement.style.setProperty("--secondary-color", "#f4f7fd");
    document.documentElement.style.setProperty("--primary-font-color", "#000000");
    document.documentElement.style.setProperty("--secondary-font-color", "#828fa3");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks();
});
