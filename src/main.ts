/**
 * メイン
 */

import { KeyboardTable } from "./KeyboardTable";
import { GamepadTable } from "./GamepadTable";
import { TabSwitcher } from "./TabSwitcher";
import { defaultConfig, UsaConfig } from "./UsaConfig";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { BaseDirectory } from "@tauri-apps/api/path";

const usaConfig: UsaConfig = { ...defaultConfig };

const tabSwitcher = new TabSwitcher("tab");
const keyboardTable = new KeyboardTable();
const gamepadTable = new GamepadTable();

window.addEventListener("DOMContentLoaded", async () => {
  await onDomContentLoaded();
});

/**
 * DOMContentLoadedイベントが発生した時に実行される処理
 *
 * 設定ファイルを読み込み、キーボード/ゲームパッドの設定を反映する
 * キーボード/ゲームパッドの監視を開始
 * 保存ボタン/キャンセルボタンにイベントリスナーを設定
 * フォーカス/ブルーイベントにイベントリスナーを設定
 */
const onDomContentLoaded = async () => {
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
  gamepadTable.setup(usaConfig.gamePad);
  setGamepadObserver();
  document.getElementById("save")?.addEventListener("click", () => {
    usaConfig.keyboard = [...keyboardTable.data];
    usaConfig.gamePad = [...gamepadTable.data];
    save();
  });
  document.getElementById("cancel")?.addEventListener("click", () => {
    cancel();
  });
  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", onBlur);
};

/**
 * キーボード設定タブのclass属性に変更があった場合にイベントを
 * 追加/削除する
 * @return {void}
 */
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

/**
 * ゲームパッド設定タブのclass属性に変更があった場合にゲームパッド監視を
 * 開始/停止する
 * @return {void}
 */
const setGamepadObserver = () => {
  const content = tabSwitcher.getTabContent(1);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "class") {
          if (content.classList.contains("hidden")) {
            gamepadTable.endGamepadMonitoring();
          } else if (content.classList.contains("block")) {
            gamepadTable.startGamepadMonitoring();
          }
        }
      }
    });
  });

  observer.observe(content, {
    attributes: true,
  });
};

/**
 * Windowがフォーカスされた時、現在のタブがゲームパッド設定タブの
 * 場合にはゲームパッド監視を開始する
 */
const onFocus = () => {
  if (tabSwitcher.currentIndex !== 1) {
    return;
  }
  gamepadTable.startGamepadMonitoring();
};

/**
 * Windowがフォーカスを失った時、現在のタブがゲームパッド設定タブの
 * 場合にはゲームパッド監視を停止する
 */
const onBlur = () => {
  if (tabSwitcher.currentIndex !== 1) {
    return;
  }
  gamepadTable.endGamepadMonitoring();
};

/**
 * 設定を保存する
 * @async
 * @returns 保存結果 "success" or "failed"
 */
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

/**
 * アプリケーションを閉じる
 * @async
 */
const cancel = async () => {
  await getCurrentWindow().close();
};
