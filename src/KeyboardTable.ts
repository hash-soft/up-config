/**
 * キーボートテーブルのクラス
 */

import { TableSelector } from "./TableSelector";
import { KeyMap } from "./UsaConfig";

export class KeyboardTable extends TableSelector {
  /**
   * イベント削除のためのAbortController
   */
  private _controller!: AbortController;

  /**
   * コンストラクタ
   * @param data
   */
  constructor(data: KeyMap) {
    super("keyboard", data);
  }

  /**
   * キーダウンイベントを登録
   */
  addKeyDownEvent() {
    this._controller = new AbortController();
    document.addEventListener("keydown", this._onKeyDown.bind(this), {
      signal: this._controller.signal,
    });
  }

  /**
   * キーダウンイベントを削除
   */
  removeKeyDownEvent() {
    this._controller.abort();
  }

  /**
   * キーダウン時の処理
   * @param e
   */
  private _onKeyDown(e: KeyboardEvent) {
    // 割り当て不可なキーを無効化
    if (["Backspace", "Tab"].includes(e.code)) {
      e.preventDefault();
    }
    this._pushData(e.code);
  }
}
