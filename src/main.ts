/**
 * メイン
 */

import { KeyboardTable } from "./KeyboardTable";
import { TabSwitcher } from "./TabSwitcher";
import { defaultConfig, UsaConfig } from "./UsaConfig";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/api/path";

const usaConfig: UsaConfig = { ...defaultConfig };

const tabSwitcher = new TabSwitcher("tab");
const keyboardTable = new KeyboardTable();

const save = async () => {
  // １行１項目なのでreplacerでまとめたい
  const configText = JSON.stringify(usaConfig, null, 2);
  const text = await invoke("save", { configText });
  if (text === "failed") {
    // TODO: エラー処理
    // 画面を出したい
  } else {
    // アプリ終了 最後にコメントアウトを取る
    //await getCurrentWindow().close();
  }
};

const cancel = async () => {
  await getCurrentWindow().close();
};

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const result = await readTextFile("config.json", {
      baseDir: BaseDirectory.Resource,
    });
    const json = JSON.parse(result) as UsaConfig;
    if (json.keyboard) {
      usaConfig.keyboard = json.keyboard;
    }
    if (json.gamePad) {
      usaConfig.gamePad = json.gamePad;
    }
  } catch (e) {
    console.error(e);
  }
  tabSwitcher.setup();
  keyboardTable.setup(usaConfig.keyboard);
  keyboardTable.addKeyDownEvent();
  setKeyboardObserver();
  document.getElementById("save")?.addEventListener("click", () => {
    usaConfig.keyboard = [...keyboardTable.data];
    save();
  });
  document.getElementById("cancel")?.addEventListener("click", () => {
    cancel();
  });
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
