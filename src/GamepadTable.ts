/**
 * ゲームパッドテーブルのクラス
 */

import { TableSelector } from "./TableSelector";
import { KeyMap } from "./UsaConfig";

// アナログキーの方向
const enum EDirection {
  Center = 0,
  Up = 1,
  Down = 2,
  Left = 3,
  Right = 4,
}

export class GamepadTable extends TableSelector {
  /**
   * 監視タイマーId
   */
  private _monitoringTimerId = 0;
  /**
   * ボタンが押されている状態
   */
  private _pressedButton: boolean[] = [];
  /**
   * アナログキーが押されている方向
   */
  private _pressedDirection: EDirection = EDirection.Center;
  /**
   * アナログキーの行
   */
  private _axesKeyRows!: HTMLElement;
  /**
   * アナログキー方向の名前
   */
  private static _DirectionName: string[] = ["未入力", "上", "下", "左", "右"];

  /**
   * コンストラクタ
   */
  constructor() {
    super("gamepad", {
      bg: "bg-blue-300",
      hover: "hover:bg-blue-100",
      activeHover: "hover:bg-blue-300",
    });
  }

  /**
   * @inheritdoc
   * @override
   * @param data ゲームパッドの設定
   */
  override setup(data: Readonly<KeyMap>) {
    super.setup(data);
    this._axesKeyRows = document.getElementById("gamepad-axes-row")!;
  }

  /**
   * ゲームパッド監視を開始
   */
  startGamepadMonitoring() {
    if (this._monitoringTimerId) {
      return;
    }
    this._monitoringTimerId = window.setInterval(() => {
      this._updatePressedState();
      this._pushData();
    }, 100);
  }

  /**
   * ゲームパッド監視を終了
   */
  endGamepadMonitoring() {
    clearInterval(this._monitoringTimerId);
    this._monitoringTimerId = 0;
  }

  /**
   * ゲームパッドの状態を監視して、ボタンやアナログキーの状態を
   * 内部状態に反映する
   * @private
   */
  private _updatePressedState() {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (!gamepad) {
        continue;
      }
      this._updatePressedButton(gamepad.buttons);
      this._pushData();
      if (this._updatePressedAxes(gamepad.axes)) {
        this._viewAxes();
      }
    }
  }

  /**
   * ボタンの状態を監視して、現在押されているボタンの状態を
   * 内部状態に反映する
   * @param buttons ボタン状態
   * @private
   */
  private _updatePressedButton(buttons: ReadonlyArray<GamepadButton>) {
    // チェックごとにfalseにする
    this._pressedButton.fill(false);
    const maxButton = buttons.length;
    for (let i = 0; i < maxButton; i++) {
      const button = buttons[i];
      // ボタンがないもしくは押されていない
      if (!button || !button.pressed) {
        continue;
      }
      this._pressedButton[i] = true;
    }
  }

  /**
   * ゲームパッドのアナログキーの状態を監視して、現在押されている
   * 方向を内部状態に反映する
   * @param axes ゲームパッドのアナログキーの状態
   * @returns 内部状態が変更されたか
   * @private
   */
  private _updatePressedAxes(axes: ReadonlyArray<number>) {
    const lastPressedDirection = this._pressedDirection;
    // チェックごとに0にする
    this._pressedDirection = EDirection.Center;
    if (axes[0] < -0.5) {
      // 左
      this._pressedDirection = EDirection.Left;
    } else if (axes[1] < -0.5) {
      // 上
      this._pressedDirection = EDirection.Up;
    } else if (axes[0] > 0.5) {
      // 右
      this._pressedDirection = EDirection.Right;
    } else if (axes[1] > 0.5) {
      // 下
      this._pressedDirection = EDirection.Down;
    }
    return lastPressedDirection !== this._pressedDirection;
  }

  /**
   * 現在押されているボタンを入力データとして設定する
   * @override
   */
  protected override _pushData() {
    // 最初のtrueを入力データとする
    const index = this._pressedButton.indexOf(true);
    if (index === -1) {
      return;
    }
    super._pushData((index + 1).toString());
  }

  /**
   * ゲームパッドのアナログキーの方向をHTML上に反映する
   * @private
   */
  private _viewAxes() {
    this._axesKeyRows.children[1].textContent =
      GamepadTable._DirectionName[this._pressedDirection];
  }
}
