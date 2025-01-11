/**
 * 設定の定義
 */

export const enum EKeyType {
  Menu = 0,
  Close = 1,
  Multi = 2,
  AllClose = 3,
  Up = 4,
  Right = 5,
  Down = 6,
  Left = 7,
}

export type KeyMap = string[][];

export interface UsaConfig {
  logLevel: number;
  keyboard: KeyMap;
  gamePad: KeyMap;
}

export const defaultConfig: UsaConfig = {
  logLevel: 0,
  keyboard: [
    ["KeyC", "Enter"],
    ["KeyX", "Escape"],
    ["KeyD", "Space"],
    ["KeyA"],
    ["ArrowUp"],
    ["ArrowDown"],
    ["ArrowLeft"],
    ["ArrowRight"],
  ],
  gamePad: [["2"], ["3"], ["1"], ["4"], ["13"], ["14"], ["15"], ["16"]],
};

export const usaConfigName = "config.json";
