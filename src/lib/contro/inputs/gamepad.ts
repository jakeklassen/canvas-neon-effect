import { IGamepad, INavigator, IWindow  } from '../apis'
import { Control, TriggerControl  } from '../core/control'
import { findButtonNumber, getButtonLabel } from '../maps/gamepad'
import store from '../store'
import { Vector2 } from '../utils/math'

export interface GamepadStick {
  label: string
  xAxis: number
  yAxis: number
}

const gamepadSticks: { [id: string]: GamepadStick } = {
  left: { label: 'Left stick', xAxis: 0, yAxis: 1 },
  right: { label: 'Right stick', xAxis: 2, yAxis: 3 },
}

export class Gamepad {

  private window: IWindow
  private navigator: INavigator

  private pressedButtons: Set<number> = new Set()
  private gamepadIndex: number | undefined
  private gamepadTimestamp = 0

  constructor(
    /* istanbul ignore next */
    { win = window, nav = navigator as any }: { win?: IWindow, nav?: INavigator } = {},
  ) {
    this.window = win
    this.navigator = nav

    this.window.addEventListener('gamepadconnected', ({ gamepad }) => {
      if (this.isConnected()) return

      if (gamepad.mapping === 'standard') {
        this.gamepadIndex = gamepad.index
        store.preferGamepad = true
      }
    })

    this.window.addEventListener('gamepaddisconnected', ({ gamepad }) => {
      if (this.gamepadIndex !== gamepad.index) return

      this.gamepadIndex = undefined
      store.preferGamepad = false
    })
  }

  public isConnected(): boolean {
    if (this.gamepadIndex === undefined) return false
    const gamepad = this.navigator.getGamepads()[this.gamepadIndex]
    return gamepad != null && gamepad.connected
  }

  private get gamepad(): IGamepad | null {
    if (this.gamepadIndex === undefined) return null
    const gamepad = this.navigator.getGamepads()[this.gamepadIndex]
    if (gamepad == null) return null

    if (gamepad.timestamp > this.gamepadTimestamp) {
      store.preferGamepad = true
      this.gamepadTimestamp = gamepad.timestamp
    }

    return gamepad
  }

  public button(button: number | string): TriggerControl<boolean> {
    const buttonNumber = findButtonNumber(button)
    const label = getButtonLabel(buttonNumber)

    return {
      label,
      query: () => {
        const gp = this.gamepad
        if (gp == null || !gp.connected) return false

        return gp.buttons[buttonNumber].pressed
      },
      fromGamepad: true,
      trigger: {
        label,
        query: () => {
          const gp = this.gamepad
          if (gp == null || !gp.connected) return false

          if (gp.buttons[buttonNumber].pressed) {
            if (this.pressedButtons.has(buttonNumber)) return false

            this.pressedButtons.add(buttonNumber)
            return true
          }

          this.pressedButtons.delete(buttonNumber)
          return false
        },
        fromGamepad: true,
      },
    }
  }

  public stick(stick: string | GamepadStick): Control<Vector2> {
    let gpStick: GamepadStick
    if (typeof stick === 'string') {
      if (stick in gamepadSticks) {
        gpStick = gamepadSticks[stick]
      } else {
        throw new Error(`Gamepad stick "${stick}" not found!`)
      }
    } else {
      gpStick = stick
    }

    return {
      label: gpStick.label,
      query: () => {
        const gp = this.gamepad
        if (gp == null || !gp.connected) return new Vector2(0, 0)

        return new Vector2(
          gp.axes[gpStick.xAxis],
          gp.axes[gpStick.yAxis],
        )
      },
    }
  }

  public async vibrate(
    duration: number,
    { weakMagnitude, strongMagnitude }: VibrationOptions = {},
  ): Promise<void> {
    const gp = this.gamepad
    if (gp == null || !gp.connected) return

    const actuator = gp.vibrationActuator
    if (!actuator || actuator.type !== 'dual-rumble') return

    await actuator.playEffect('dual-rumble', {
      duration, strongMagnitude, weakMagnitude,
    })
  }

}

interface VibrationOptions {
  strongMagnitude?: number
  weakMagnitude?: number
}
