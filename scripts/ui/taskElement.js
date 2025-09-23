import { openTaskModal } from "./modalHandlers.js";

export function createTaskElement(task) {
  const container = document.createElement("div");
  container.className = "task-div";
  container.dataset.taskId = task.id;
  container.setAttribute("role", "button");
  container.setAttribute("tabindex", "0");

  const title = document.createElement("div");
  title.textContent = task.title;
  container.appendChild(title);

  // optional: show small description or priority later

  container.addEventListener("click", () => openTaskModal(task.id));
  container.addEventListener("keydown", (e) => {
    if (e.key === "Enter") openTaskModal(task.id);
  });

  return container;
}
