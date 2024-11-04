/**
 * メイン
 */

import { KeyboardTable } from "./KeyboardTable";
import { TabSwitcher } from "./TabSwitcher";
import { defaultConfig, UsaConfig } from "./UsaConfig";

const usaConfig: UsaConfig = { ...defaultConfig };

const tabSwitcher = new TabSwitcher("tab");
const keyboardTable = new KeyboardTable(usaConfig.keyboard);

window.addEventListener("DOMContentLoaded", () => {
  tabSwitcher.setup();
  keyboardTable.setup();
  keyboardTable.addKeyDownEvent();
  setKeyboardObserver();
});

const setKeyboardObserver = () => {
  const content = tabSwitcher.getTabContent(0);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "class") {
          if (content.classList.contains("hidden")) {
            keyboardTable.removeKeyDownEvent();
          } else if (content.classList.contains("block")) {
            keyboardTable.addKeyDownEvent();
          }
        }
      }
    });
  });

  observer.observe(content, {
    attributes: true,
  });
};
