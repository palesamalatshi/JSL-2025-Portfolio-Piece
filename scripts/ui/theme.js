import { getSavedTheme, saveTheme } from "../utils/localStorage.js";

/**
 * Initialize theme on load and wire toggle
 */
export function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const saved = getSavedTheme() || "light";
  root.setAttribute("data-theme", saved);

  if (toggle) {
    toggle.checked = saved === "dark";
    toggle.addEventListener("change", () => {
      const t = toggle.checked ? "dark" : "light";
      root.setAttribute("data-theme", t);
      saveTheme(t);
    });
  }
}

/**
 * Expose a setter so other code can change theme programmatically
 */
export function setTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  saveTheme(t);
}
