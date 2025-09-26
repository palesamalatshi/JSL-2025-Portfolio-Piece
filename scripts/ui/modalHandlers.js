// scripts/ui/modalHandlers.js

import { addNewTask, updateTask, deleteTask } from "../tasks/taskManager.js";
import { resetForm } from "../tasks/formUtils.js";
import { toggleTheme } from "../utils/localStorage.js";

// --- Backdrop Utility ---
function toggleBackdrop(show) {
    const backdrop = document.getElementById("custom-backdrop");
    if (show) {
        backdrop.classList.add("show");
    } else {
        backdrop.classList.remove("show");
    }
}

// --- New Task Modal Handlers ---
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

export function setupNewTaskModalHandler(triggerButtonId) {
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

// --- Edit & Delete Task Modal Handlers (P2.14 - P2.21) ---

function handleEditTaskSubmit() {
    const saveButton = document.getElementById("save-changes-btn");
    const taskId = saveButton.dataset.taskId;

    if (!taskId) return;
    
    const form = document.getElementById('task-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Collect updated data, including priority
    const updatedData = {
        title: document.getElementById("task-title").value.trim(),
        description: document.getElementById("task-desc").value.trim(),
        status: document.getElementById("task-status").value,
        priority: document.getElementById("task-priority").value, // Stretch Goal
    };

    updateTask(parseInt(taskId), updatedData);
    document.getElementById("task-modal").close();
}

function showDeleteConfirmation(taskId) {
    const isConfirmed = confirm("Are you sure you want to delete this task? This action cannot be undone.");

    if (isConfirmed) {
        deleteTask(taskId); // P2.20
        document.getElementById("task-modal").close();
    } 
    // P2.21: If cancelled, the Edit modal remains open.
}

export function setupEditModalHandlers() {
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

export function openTaskModal(task) {
    const modal = document.getElementById("task-modal");
    
    // Set the modal header (P2.14)
    modal.querySelector('.modal-header h3').textContent = task.title;

    // Populate form fields (P2.15)
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.description;
    document.getElementById("task-status").value = task.status;
    document.getElementById("task-priority").value = task.priority || 'medium'; // Populate priority
    
    // Store the task ID on the buttons for persistence
    document.getElementById("save-changes-btn").dataset.taskId = task.id;
    document.getElementById("delete-task-btn").dataset.taskId = task.id;

    modal.showModal();
}

// --- Sidebar, Theme, and Mobile Menu Handlers (P2.23, P2.28, P2.25) ---
export function setupUiHandlers() {
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
            toggleBackdrop(true); // Re-use the backdrop for the mobile menu
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
    }
}