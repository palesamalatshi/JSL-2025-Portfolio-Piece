// --- JAVASCRIPT CODE ---

// ----------------------------------------------------
// 1. initialData.js (JSL01 Tasks + Priority Stretch Goal)
// ----------------------------------------------------
const initialTasks = [
  {
    id: 1,
    title: "Launch Epic Career 🚀",
    description: "Create a killer Resume",
    status: "todo",
    priority: "high", 
    board: "Launch Career",
  },
  {
    id: 2,
    title: "Conquer React⚛️",
    description: "Practice hooks and state management.",
    status: "todo",
    priority: "medium",
    board: "Launch Career",
  },
  {
    id: 3,
    title: "Understand Databases⚙️",
    description: "Learn SQL and NoSQL basics.",
    status: "todo",
    priority: "medium",
    board: "Launch Career",
  },
  {
    id: 4,
    title: "Crush Frameworks🖼️",
    description: "Experiment with Next.js or Vue.js.",
    status: "todo",
    priority: "low",
    board: "Launch Career",
  },
  {
    id: 5,
    title: "Master JavaScript 💛",
    description: "Get comfortable with the fundamentals",
    status: "doing",
    priority: "high",
    board: "Launch Career",
  },
  {
    id: 6,
    title: "Never Give Up 🏆",
    description: "Keep pushing through coding challenges.",
    status: "doing",
    priority: "medium",
    board: "Launch Career",
  },
  {
    id: 7,
    title: "Explore ES6 Features 🚀",
    description: "Implemented spread, rest, and destructuring.",
    status: "done",
    priority: "low",
    board: "Launch Career",
  },
  {
    id: 8,
    title: "Have fun 🥳",
    description: "Remember to take breaks and enjoy the process.",
    status: "done",
    priority: "medium",
    board: "Launch Career",
  },
];

// ----------------------------------------------------
// 2. utils/localStorage.js (P2.12, P2.28)
// ----------------------------------------------------
const STORAGE_KEY = "kanbanTasks";
const THEME_KEY = "kanbanTheme";

function loadTasksFromStorage() {
  const json = localStorage.getItem(STORAGE_KEY);
  const tasks = json ? JSON.parse(json) : initialTasks;
  // Initialize storage with initial tasks if it was empty
  if (!json) {
    saveTasksToStorage(initialTasks);
  }
  return tasks;
}

function saveTasksToStorage(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const isDark = savedTheme === "dark";
  document.body.classList.toggle("theme-dark", isDark);
  // Ensure the slider is positioned correctly on load
  const slider = document.querySelector("#theme-toggle-switch .toggle-slider");
  if (slider) {
    slider.style.transform = isDark ? "translateX(20px)" : "translateX(3px)";
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("theme-dark");
  const theme = isDark ? "dark" : "light";
  localStorage.setItem(THEME_KEY, theme);
  // Update slider position
  document.querySelector("#theme-toggle-switch .toggle-slider").style.transform = isDark ? "translateX(20px)" : "translateX(3px)";
  // Also update the mobile menu slider if it exists and is open
  const mobileSlider = document.querySelector("#mobile-theme-toggle-switch .toggle-slider");
  if(mobileSlider) {
    mobileSlider.style.transform = isDark ? "translateX(20px)" : "translateX(3px)";
  }
}


// ----------------------------------------------------
// 3. tasks/taskElement.js 
// ----------------------------------------------------
function openTaskModal(task) { /* Defined in modalHandlers */ } 

function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-div";
  taskDiv.dataset.taskId = task.id; 

  // 1. Task Title Element
  const titleSpan = document.createElement('span');
  titleSpan.className = 'task-title';
  titleSpan.textContent = task.title;
  taskDiv.appendChild(titleSpan);

  // 2. Priority Circle (Stretch Goal)
  const priorityCircle = document.createElement('span');
  // Ensure priority is set to a default if missing
  const priority = task.priority || 'medium'; 
  priorityCircle.className = `priority-circle priority-${priority}`;
  taskDiv.appendChild(priorityCircle);
    
  // Event listener to open the Edit Task modal (P2.14)
  taskDiv.addEventListener("click", () => {
    // Find the full task object from the loaded tasks using the ID
    const allTasks = loadTasksFromStorage();
    const fullTask = allTasks.find(t => t.id === task.id);
    if (fullTask) {
        openTaskModal(fullTask);
    }
  });

  return taskDiv;
}


// ----------------------------------------------------
// 4. ui/render.js 
// ----------------------------------------------------
function clearExistingTasks() {
  document.querySelectorAll(".tasks-container").forEach((container) => {
    container.innerHTML = "";
  });
}

function renderTasks(tasks) {
  clearExistingTasks();

  const columns = {
    todo: document.querySelector('.column-div[data-status="todo"] .tasks-container'),
    doing: document.querySelector('.column-div[data-status="doing"] .tasks-container'),
    done: document.querySelector('.column-div[data-status="done"] .tasks-container'),
  };

  const counts = { todo: 0, doing: 0, done: 0 };

  tasks.forEach((task) => {
    const container = columns[task.status];
    if (container) {
      container.appendChild(createTaskElement(task));
      counts[task.status]++;
    }
  });

  // Update column headers with counts
  document.getElementById("toDoText").textContent = `TODO (${counts.todo})`;
  document.getElementById("doingText").textContent = `DOING (${counts.doing})`;
  document.getElementById("doneText").textContent = `DONE (${counts.done})`;
}

// ----------------------------------------------------
// 5. tasks/formUtils.js 
// ----------------------------------------------------
function resetForm() {
    const form = document.getElementById("new-task-form");
    if (form) {
        form.reset();
        // Set the default selection for status and priority on form reset
        document.getElementById("new-task-status").value = 'todo';
        document.getElementById("new-task-priority").value = 'medium';
    }
}


// ----------------------------------------------------
// 6. tasks/taskManager.js (P2.1, P2.16, P2.20)
// ----------------------------------------------------
function addNewTask(modal) {
  const title = document.getElementById("new-task-title").value.trim();
  const description = document.getElementById("new-task-desc").value.trim();
  const status = document.getElementById("new-task-status").value;
  const priority = document.getElementById("new-task-priority").value; 

  if (!title) return;

  const tasks = loadTasksFromStorage();
  const newId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  
  const newTask = {
    id: newId,
    title,
    description,
    status,
    priority, 
    board: "Launch Career", 
  };

  const updatedTasks = [...tasks, newTask];
  saveTasksToStorage(updatedTasks);

  renderTasks(updatedTasks);
  
  resetForm();
  modal.classList.remove("show"); 
  document.getElementById("custom-backdrop").classList.remove("show");
}

function updateTask(taskId, updatedData) {
    const tasks = loadTasksFromStorage();
    const taskIndex = tasks.findIndex(t => t.id == taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
        saveTasksToStorage(tasks); 

        // P2.17: Re-render the board to move the task card if status changed
        renderTasks(tasks);
    }
}

function deleteTask(taskId) {
    let tasks = loadTasksFromStorage();
    
    const updatedTasks = tasks.filter(t => t.id != taskId);

    saveTasksToStorage(updatedTasks);

    // P2.20: Re-render the entire board to remove the task
    renderTasks(updatedTasks);
}


// ----------------------------------------------------
// 7. ui/modalHandlers.js (P2.1, P2.14, P2.23, P2.25)
// ----------------------------------------------------

function toggleBackdrop(show) {
    const backdrop = document.getElementById("custom-backdrop");
    if (show) {
        backdrop.classList.add("show");
    } else {
        backdrop.classList.remove("show");
    }
}

function setupNewTaskCloseLogic(modal) {
    const closeBtn = document.getElementById("new-close-modal-btn");
    const backdrop = document.getElementById("custom-backdrop");
    
    const closeModal = () => {
        modal.classList.remove("show");
        toggleBackdrop(false);
        resetForm();
    };

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
            closeModal();
        }
    });
}

function setupNewTaskModalHandler(triggerButtonId) {
    const modal = document.getElementById("new-task-modal");
    const newTaskBtn = document.getElementById(triggerButtonId);
    const form = document.getElementById("new-task-form");
    
    if (!modal || !newTaskBtn) return;

    newTaskBtn.addEventListener("click", () => {
        modal.classList.add("show");
        toggleBackdrop(true);
        resetForm(); 
    });

    setupNewTaskCloseLogic(modal);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (form.checkValidity()) {
            addNewTask(modal); 
        } else {
            form.reportValidity();
        }
    });
}

function handleEditTaskSubmit() {
    const saveButton = document.getElementById("save-changes-btn");
    const taskId = saveButton.dataset.taskId;

    if (!taskId) return;
    
    const form = document.getElementById('task-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const updatedData = {
        title: document.getElementById("task-title").value.trim(),
        description: document.getElementById("task-desc").value.trim(),
        status: document.getElementById("task-status").value,
        priority: document.getElementById("task-priority").value,
    };

    updateTask(parseInt(taskId), updatedData);
    document.getElementById("task-modal").close();
}

function showDeleteConfirmation(taskId) {
    // P2.19: Using the native confirm dialog
    const isConfirmed = confirm("Are you sure you want to delete this task? This action cannot be undone.");

    if (isConfirmed) {
        deleteTask(taskId); 
        document.getElementById("task-modal").close();
    } 
}

function setupEditModalHandlers() {
    const deleteBtn = document.getElementById("delete-task-btn");
    const saveBtn = document.getElementById("save-changes-btn");

    if (saveBtn) {
        saveBtn.addEventListener('click', handleEditTaskSubmit);
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const taskId = deleteBtn.dataset.taskId;
            if (taskId) {
                showDeleteConfirmation(parseInt(taskId));
            }
        });
    }
}

function openTaskModal(task) {
    const modal = document.getElementById("task-modal");
    
    modal.querySelector('.modal-header h3').textContent = task.title;

    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.description;
    document.getElementById("task-status").value = task.status;
    document.getElementById("task-priority").value = task.priority || 'medium'; 
    
    document.getElementById("save-changes-btn").dataset.taskId = task.id;
    document.getElementById("delete-task-btn").dataset.taskId = task.id;

    modal.showModal();
}

function setupUiHandlers() {
    const hideBtn = document.getElementById('hide-sidebar-btn');
    const showBtn = document.getElementById('show-sidebar-btn');
    const themeToggle = document.getElementById('theme-toggle-switch');
    const mobileToggleBtn = document.getElementById('mobile-menu-toggle-btn');
    const mobileMenuModal = document.getElementById('mobile-menu-modal');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const body = document.body;

    // Sidebar Hide/Show (P2.23, P2.24)
    if (hideBtn && showBtn) {
        hideBtn.addEventListener('click', () => {
            body.classList.add('sidebar-hidden');
        });
        showBtn.addEventListener('click', () => {
            body.classList.remove('sidebar-hidden');
        });
    }

    // Theme Toggle (P2.28, P2.29)
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile Menu Toggle (P2.25)
    if (mobileToggleBtn && mobileMenuModal) {
        mobileToggleBtn.addEventListener('click', () => {
            mobileMenuModal.showModal();
            toggleBackdrop(true); 
            // Re-sync mobile theme toggle on open
            loadTheme(); 
        });
        
        const closeModal = () => {
            mobileMenuModal.close();
            toggleBackdrop(false);
        };
        
        mobileCloseBtn.addEventListener('click', closeModal);
        document.getElementById("custom-backdrop").addEventListener("click", (e) => {
            if (e.target === document.getElementById("custom-backdrop") && mobileMenuModal.open) {
                closeModal();
            }
        });
        
        // Theme toggle inside the mobile menu
        document.getElementById('mobile-theme-toggle-switch').addEventListener('click', toggleTheme);
    }
}

// ----------------------------------------------------
// 8. main.js (Entry Point)
// ----------------------------------------------------

/**
 * Initializes the Kanban board application.
 */
function initTaskBoard() {
  // P2.28: Load and apply theme preference first
  loadTheme();

  // P2.13: Load tasks from storage (including JSL01 tasks on first run) and render them 
  const tasks = loadTasksFromStorage();
  renderTasks(tasks);
  
  // Setup UI and Modal event handlers
  setupEditModalHandlers(); // P2.16, P2.18: Setup handlers for saving and deleting
  setupNewTaskModalHandler("add-task-btn"); // P2.1: Setup handler for new task creation
  setupUiHandlers(); // P2.23, P2.28, P2.25: Setup sidebar, theme, and mobile menu handlers
}

// Initializing the application once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initTaskBoard);

// --- END OF JAVASCRIPT CODE ---