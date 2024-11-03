import { TabSwitcher } from "./TabSwitcher";

const tabSwitcher = new TabSwitcher("tab");

window.addEventListener("DOMContentLoaded", () => {
  tabSwitcher.setup();
});
