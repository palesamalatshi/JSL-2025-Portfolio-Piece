// ======================
// Global Selectors
// ======================
const overlay = document.createElement("div");
overlay.id = "overlay";
document.body.appendChild(overlay);

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Columns
const todoContainer = document.querySelector('[data-status="todo"] .tasks-container');
const doingContainer = document.querySelector('[data-status="doing"] .tasks-container');
const doneContainer = document.querySelector('[data-status="done"] .tasks-container');

// ======================
// Functions
// ======================

// Render tasks
function renderTasks() {
  todoContainer.innerHTML = "";
  doingContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.classList.add("task-div");
    div.dataset.index = index;

    // Priority circle
    const priorityCircle = document.createElement("span");
    priorityCircle.classList.add("task-priority");
    if (task.priority === "Low") priorityCircle.style.backgroundColor = "var(--low-priority)";
    if (task.priority === "Medium") priorityCircle.style.backgroundColor = "var(--medium-priority)";
    if (task.priority === "High") priorityCircle.style.backgroundColor = "var(--high-priority)";

    div.appendChild(priorityCircle);
    div.appendChild(document.createTextNode(task.title));
    div.addEventListener("click", () => openEditTask(index));
    
    if (task.status === "TODO") todoContainer.appendChild(div);
    if (task.status === "DOING") doingContainer.appendChild(div);
    if (task.status === "DONE") doneContainer.appendChild(div);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Open Add Task Modal
function openAddTask() {
  showModal({ type: "add" });
}

// Open Edit Task Modal
function openEditTask(index) {
  showModal({ type: "edit", index });
}

// Show Modal
function showModal({ type, index }) {
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${type === "add" ? "Add New Task" : "Edit Task"}</h3>
        <span class="modal-close">&times;</span>
      </div>
      <input type="text" id="task-title" placeholder="Task title" />
      <textarea id="task-desc" placeholder="Task description"></textarea>
      <select id="task-status">
        <option value="TODO">TODO</option>
        <option value="DOING">DOING</option>
        <option value="DONE">DONE</option>
      </select>
      <select id="task-priority">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <div style="display:flex; gap:10px; margin-top:10px;">
        <button id="save-task-btn">${type === "add" ? "Create Task" : "Save Changes"}</button>
        ${type === "edit" ? '<button id="delete-task-btn">Delete Task</button>' : ""}
      </div>
    </div>
  `;

  overlay.classList.add("show");

  // Prefill for edit
  if (type === "edit") {
    const task = tasks[index];
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.desc;
    document.getElementById("task-status").value = task.status;
    document.getElementById("task-priority").value = task.priority;
  }

  // Close modal
  overlay.querySelector(".modal-close").addEventListener("click", closeModal);

  // Save Task
  document.getElementById("save-task-btn").addEventListener("click", () => {
    const title = document.getElementById("task-title").value.trim();
    const desc = document.getElementById("task-desc").value.trim();
    const status = document.getElementById("task-status").value;
    const priority = document.getElementById("task-priority").value;

    if (!title) return alert("Title is required!");

    if (type === "add") tasks.push({ title, desc, status, priority });
    else tasks[index] = { title, desc, status, priority };

    renderTasks();
    closeModal();
  });

  // Delete Task
  if (type === "edit") {
    document.getElementById("delete-task-btn").addEventListener("click", () => {
      tasks.splice(index, 1);
      renderTasks();
      closeModal();
    });
  }
}

// Close Modal
function closeModal() {
  overlay.classList.remove("show");
  overlay.innerHTML = "";
}

// ======================
// Initialize
// ======================
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();

  // Add button for demo
  const addBtn = document.createElement("button");
  addBtn.textContent = "+ Add New Task";
  addBtn.style.margin = "20px";
  addBtn.addEventListener("click", openAddTask);
  document.body.appendChild(addBtn);
});
