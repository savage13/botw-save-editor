
import { HidNpadButton } from '@nx.js/constants';

import { clamp } from './util'

export let FONT = "system-ui"
const FG_COLOR = "#d4edfc"
const BG_COLOR = "#000000"
const ACTIVE_COLOR = "#219e63"
const EDIT_COLOR = "#1d8755"
const CURRENT_ROW_COLOR = "#222222"

export let ON_SWITCH = true;
try {
  let _v = Switch;
} catch (e) {
  ON_SWITCH = false;
}

if (!ON_SWITCH) {
  FONT = "Helvetica";
}

const WIDTH = 1280
const HEIGHT = 720
export class Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  constructor(x: number, y: number, w: number, h: number) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
  static full() {
    return new Rect(0, 0, WIDTH, HEIGHT)
  }
  static percent(x: number, y: number, w: number, h: number) {
    return new Rect(x * WIDTH, y * HEIGHT, w * WIDTH, h * HEIGHT)
  }
}


export function is_up(v: any) { return v & HidNpadButton.Up }
export function is_down(v: any) { return v & HidNpadButton.Down }
export function is_left(v: any) { return v & HidNpadButton.Left }
export function is_right(v: any) { return v & HidNpadButton.Right }
export function is_any_up(v: any) { return v & HidNpadButton.AnyUp }
export function is_any_down(v: any) { return v & HidNpadButton.AnyDown }
export function is_any_left(v: any) { return v & HidNpadButton.AnyLeft }
export function is_any_right(v: any) { return v & HidNpadButton.AnyRight }

const ROW = 0
const COL = 1
export class View extends EventTarget {
  state: any;
  rows: number;
  cols: number;
  selected: [number, number];
  nlines: number;
  borderWidth: number;
  borderColor: string;
  font: string;
  font_size: number;
  line_height: number;
  fg_color: string;
  bg_color: string;
  widths: any;
  xoff: any;
  rect: Rect;
  data: any;
  edit_color: string;
  active_color: string;
  current_row_color: string;
  constructor(state: any, rect: Rect, data: any) {
    super()
    this.state = state
    this.rect = rect
    this.data = data
    this.rows = 1
    this.cols = 1
    this.font_size = 24
    this.borderWidth = 1
    this.borderColor = "#222222"
    this.line_height = this.font_size * 1.2
    this.selected = [0, 0]
    this.font = FONT
    this.bg_color = BG_COLOR
    this.fg_color = FG_COLOR
    this.edit_color = EDIT_COLOR
    this.active_color = ACTIVE_COLOR
    this.current_row_color = CURRENT_ROW_COLOR
    this.nlines = Math.floor(this.rect.h / this.line_height)
    this.set_widths([this.rect.w])
  }
  calc_nlines() {
    this.nlines = Math.floor(this.rect.h / this.line_height)
  }
  set_widths(widths: number[]) {
    this.widths = widths;
    this.xoff = [0]
    for (let i = 0; i < this.widths.length; i++) {
      this.xoff.push(this.xoff.at(-1) + this.widths[i])
    }
  }
  set_font(size: number) {
    this.get_ctx().font = `${size}px ${this.font}`
  }
  clear_all(): boolean {
    return true;
  }

  clear() {
    const ctx = this.get_ctx()
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = this.bg_color
    ctx.rect(this.rect.x, this.rect.y, this.rect.w, this.rect.h)
    ctx.fill()
    ctx.lineWidth = this.borderWidth
    ctx.strokeStyle = this.borderColor
    ctx.rect(this.rect.x, this.rect.y, this.rect.w, this.rect.h)
    ctx.stroke()
    ctx.restore()
  }
  get_ctx() {
    return this.state.ctx
  }
  key_l() { }
  key_r() { }
  key_a() { }
  key_b() { }
  key_y() { }
  key_x() { }
  key_zl_up() { }
  key_zl_down() { }
  key_zl_right() { }
  key_zl_left() { }
  key_zl_minus() { }
  key_zl_plus() { }

  key_dir(_detail: any): boolean {
    return false
  }

  key(detail: any): any {
    if (detail & HidNpadButton.ZL && detail & HidNpadButton.AnyUp)
      return this.key_zl_up()
    if (detail & HidNpadButton.ZL && detail & HidNpadButton.AnyDown)
      return this.key_zl_down()
    if (detail & HidNpadButton.ZL && detail & HidNpadButton.AnyLeft)
      return this.key_zl_left()
    if (detail & HidNpadButton.ZL && detail & HidNpadButton.AnyRight)
      return this.key_zl_right()
    if (detail & HidNpadButton.ZL && detail & HidNpadButton.Minus)
      return this.key_zl_minus()
    if (detail & HidNpadButton.ZL && detail & HidNpadButton.Plus)
      return this.key_zl_plus()
    if (detail & HidNpadButton.A)
      return this.key_a()
    if (detail & HidNpadButton.B)
      return this.key_b()
    if (detail & HidNpadButton.X)
      return this.key_x()
    if (detail & HidNpadButton.Y)
      return this.key_y()
    if (detail & HidNpadButton.L)
      return this.key_l()
    if (detail & HidNpadButton.R)
      return this.key_r()

    if (this.key_dir(detail))
      return
    this.key_dir_default(detail)
  }
  title() {
    return "Title"
  }
  commands() {
    return { "a": "Select", "b": "Back" }
  }
  key_dir_default(detail: any) {
    if (is_any_left(detail))
      this.selected[COL] -= 1
    else if (is_any_right(detail))
      this.selected[COL] += 1
    else if (is_up(detail))
      this.selected[ROW] -= this.nlines
    else if (is_down(detail))
      this.selected[ROW] += this.nlines
    else if (is_any_up(detail))
      this.selected[ROW] -= 1
    else if (is_any_down(detail))
      this.selected[ROW] += 1

    if (this.selected[COL] >= this.cols) {
      this.selected[ROW] += 1;
      this.selected[COL] = 0
    }
    if (this.selected[COL] < 0) {
      if (this.selected[ROW] > 0) {
        this.selected[ROW] -= 1;
        this.selected[COL] = this.cols - 1
      } else {
        this.selected = [0, 0]
      }
    }
    this.selected[ROW] = clamp(this.selected[ROW], 0, this.rows - 1)
  }
  selected_index() {
    return this.selected[COL] + this.selected[ROW] * this.cols
  }
  pos(i: number, offset: number): any {
    let x0 = this.rect.x
    let y0 = this.rect.y
    let row = Math.floor(i / this.cols)
    let col = i % this.cols
    let x = x0 + this.xoff[col]
    let y = y0 + row * this.line_height;
    let h = this.line_height;
    let w = this.widths[col];
    return { x, y, w, h, row: row + offset / this.cols, col }
  }
  item_offset(): number {
    let offset = 0
    if (this.rows < this.nlines)
      return 0
    if (this.selected[ROW] > Math.floor(this.nlines / 2))
      offset = (this.selected[ROW] - Math.floor(this.nlines / 2)) * this.cols
    return offset
  }
  async update() {
  }
}
