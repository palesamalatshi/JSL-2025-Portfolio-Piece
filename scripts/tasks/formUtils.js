export function resetNewTaskForm() {
  const title = document.getElementById("new-task-title");
  const desc = document.getElementById("new-task-desc");
  const status = document.getElementById("new-task-status");
  if (title) title.value = "";
  if (desc) desc.value = "";
  if (status) status.value = "todo";
}
