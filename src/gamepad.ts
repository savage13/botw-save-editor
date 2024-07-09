
import { Button, HidNpadButton } from '@nx.js/constants';

export class GamePadState {
  button: HidNpadButton;
  time: number;
  delta: number;
  last: number;
  hold_interval: number
  event_interval: number
  constructor() {
    this.button = 0
    this.time = 0
    this.delta = 0
    this.last = 0
    this.hold_interval = 150 // First repeat is 150 ms, guessed at these numbers
    this.event_interval = 32 // Repeated events are 30 ms 
    window.requestAnimationFrame(() => { this.input_loop() });
  }

  input_loop() {
    const pads = navigator.getGamepads();
    if (!pads[0])
      return
    window.requestAnimationFrame(() => { this.input_loop() });
    const button = gamepad_to_HidNpadButton(pads[0])
    this.press(button, pads[0].axes)
  }

  event(event_name: string, change: HidNpadButton, repeat: boolean, axes: readonly number[]) {
    window.dispatchEvent(new CustomEvent(event_name, {
      detail: {
        time: this.time, repeat, change, button: this.button,
        lx: axes[0], ly: axes[1], rx: axes[2], ry: axes[3]
      }
    }))
  }

  change(button: HidNpadButton) {
    return this.button ^ button // Bits of changed buttons
  }

  handle_change(button: HidNpadButton, change: HidNpadButton, axes: readonly number[]) {
    const down = (change & button) != 0
    this.time = new Date().valueOf()
    this.delta = 0
    this.last = this.time
    this.button = button

    if (this.button == 0)
      this.reset()
    const event_name = (down) ? "gamepad_down" : "gamepad_up"
    this.event(event_name, change, false, axes)
  }

  handle_hold(change: HidNpadButton, axes: readonly number[]) {
    const t = new Date().valueOf()
    this.delta = t - this.time
    const count = Math.floor(this.delta / this.hold_interval)
    const since_last_event = t - this.last
    if (count <= 0 || since_last_event < this.event_interval)
      return
    this.last = t
    this.event("gamepad_down", change, true, axes)
  }

  press(button: HidNpadButton, axes: readonly number[]) {
    const change = this.change(button)
    if (change)
      this.handle_change(button, change, axes) // Changes to pressed buttons
    else if (this.time && this.button)
      this.handle_hold(button, axes) // Buttons held, emits events
    // Otherwise, no changes and no buttons held
  }

  reset() {
    this.button = 0
    this.time = 0
    this.delta = 0
    this.last = 0
  }
}

function isIntString(n: string) { return isFinite(Number(n)) }
export const KeyNames = Object.keys(HidNpadButton).filter(v => !isIntString(v))
  .filter(v => !v.startsWith("Lagon"))
  .filter(v => !v.startsWith("Any"))

export function get_description(key_down: HidNpadButton): string[] {
  // @ts-ignore
  return KeyNames.filter(key => key_down & HidNpadButton[key])
}

function gamepad_to_HidNpadButton(pad: any) {
  let button = 0
  for (let i = 0; i < pad.buttons.length; i++) {
    if (pad.buttons[i].pressed) {
      // @ts-ignore
      button = button | HidNpadButton[Button[i]]//Order[i]
    }
  }
  const AnalogTrigger = 0.5
  // Order of axes is important, then -1 to +1
  const Axes: any = [
    [HidNpadButton.StickLLeft, HidNpadButton.StickLRight],
    [HidNpadButton.StickLUp, HidNpadButton.StickLDown],
    [HidNpadButton.StickRLeft, HidNpadButton.StickRRight],
    [HidNpadButton.StickRUp, HidNpadButton.StickRDown],
  ]
  const n = pad.axes.length
  for (let j = 0; j < n; j++) {
    if (Math.abs(pad.axes[j]) > AnalogTrigger) {
      let k = (pad.axes[j] < 0) ? 0 : 1
      button = button | Axes[j][k]
    }
  }
  return button
}

