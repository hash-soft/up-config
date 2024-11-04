import { UsaConfig } from "./UsaConfig";
export class UsaConfigManager {
  // ログレベルは編集不可のため初期状態から変更しない
  private _data: UsaConfig = {
    logLevel: 0,
    keyboard: [],
    gamePad: [],
  };

  get keyboard() {
    return this._data.keyboard;
  }

  get gamePad() {
    return this._data.gamePad;
  }

  constructor(data?: UsaConfig) {
    if (data) {
      this._data.logLevel = data.logLevel;
      this._data.keyboard = [...data.keyboard];
      this._data.gamePad = [...data.gamePad];
    } else {
      this.resetDefault();
    }
  }

  resetDefault() {
    this._data.keyboard = [];
    this._data.gamePad = [];
  }
}
