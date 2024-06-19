
import { View, Rect } from './View'
import { is_any_left, is_any_right, is_any_up, is_any_down } from './View'
import { clamp } from './util'
import { strokeRect, checkbox } from './draw'
import { name_ui } from './formatters'

export class ItemDisplay2View extends View {
  col: number;
  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)

    this.selected = [0, 0]
    this.borderWidth = 3;
    this.borderColor = this.fg_color
    this.col = 0;
    const items = this.data.get_items1()
    this.selected[0] = items.findIndex((v: any) => v == this.data.selected[0])
    const items2 = this.data.get_items2(this.data.selected[0])
    let id = items2.findIndex((v: any) => v == this.data.selected[1])
    id = (id === undefined || id < 0) ? 0 : id
    this.selected[1] = id
  }
  clear_all(): boolean {
    return false
  }

  key_b() {
    this.dispatchEvent(new CustomEvent("cancel"))
  }
  key_a() {
    this.dispatchEvent(new CustomEvent("cancel"))
  }
  key_dir(detail: any) {
    if (is_any_left(detail) || is_any_right(detail)) {
      this.col = is_any_left(detail) ? 0 : 1
      return true
    }

    let step = 0
    if (is_any_up(detail))
      step = -1
    if (is_any_down(detail))
      step = 1

    if (this.col == 0) {
      let items = this.data.get_items1()
      let key = items[this.selected[0]]
      let value = this.selected[0]
      this.selected[0] = clamp(value + step, 0, items.length - 1)
      key = items[this.selected[0]]

      value = this.selected[1]
      let n = this.data.get_items2(key).length
      if (n == 0)
        this.selected[1] = 0
      else
        this.selected[1] = clamp(value, 0, n - 1)

    } else {
      let item1 = this.data.get_items1()[this.selected[0]]
      let value = this.selected[1]
      let n = this.data.get_items2(item1).length
      this.selected[1] = clamp(value + step, 0, n - 1)
    }
    let item1 = this.data.get_items1()[this.selected[0]]
    let v0 = item1
    let items2 = this.data.get_items2(item1)
    let v1 = 0
    if (this.selected[1] >= 0 && this.selected[1] < items2.length)
      v1 = items2[this.selected[1]]

    this.data.set_value([v0, v1])

    return true
  }

  commands(): any { return { a: "Ok", dir: "Select" } }

  async update() {
    const x0 = this.rect.x
    const y0 = this.rect.y
    const w0 = this.rect.w
    const h0 = this.rect.h
    const ctx = this.get_ctx()
    this.clear()
    ctx.save()
    ctx.fillColor = this.fg_color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${this.font_size}px ${this.font}`

    let items = this.data.get_items1()
    let fmt = this.data.fmt_items1()
    for (let i = this.selected[0] - 3; i <= this.selected[0] + 3; i++) {
      if (i < 0 || i >= items.length)
        continue
      let x = x0 + w0 / 4
      let y = y0 + h0 / 2 + this.line_height * (i - this.selected[0])
      let dk = 1 - (Math.abs(i - this.selected[0]) / 3) * 0.4
      ctx.fillStyle = this.fg_color + (Math.floor(255 * dk)).toString(16)
      ctx.fillText(fmt(items[i]), x, y)
    }
    const item1 = items[this.selected[0]]
    fmt = this.data.fmt_items2(item1)
    items = this.data.get_items2(item1)
    const n = items.length

    for (let i = this.selected[1] - 3; i <= this.selected[1] + 3; i++) {
      if (i < 0 || i >= n)
        continue
      let x = x0 + 3 * w0 / 4
      let y = y0 + h0 / 2 + this.line_height * (i - this.selected[1])
      let dk = 1 - (Math.abs(i - this.selected[1]) / 3) * 0.4
      ctx.fillStyle = this.fg_color + (Math.floor(255 * dk)).toString(16)
      ctx.fillText(fmt(items[i]), x, y)
    }
    let lh = this.line_height
    let lw = (this.col == 0) ? 2 : 1
    strokeRect(ctx, x0, y0 + h0 / 2 - lh / 2, w0 / 2, lh, this.fg_color, lw)

    lw = (this.col == 1) ? 2 : 1
    strokeRect(ctx, x0 + w0 / 2, y0 + h0 / 2 - lh / 2, w0 / 2, lh, this.fg_color, lw)
    ctx.restore()
  }
}


export class ItemDialogView extends View {
  active: number;
  multi_select: boolean;
  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)
    this.active = 0
    this.borderWidth = 3;
    this.borderColor = "#888888"

    this.multi_select = this.data.multi_select
    if (this.multi_select === undefined)
      this.multi_select = false
    if (!this.multi_select)
      this.active = this.data.items.findIndex((v: any) => v == this.data.selected)
  }
  title(): string { return "" }
  clear_all(): boolean {
    return false
  }
  key_b() {
    this.dispatchEvent(new CustomEvent("cancel"))
  }
  key_a() {
    if (!this.multi_select)
      return this.dispatchEvent(new CustomEvent("cancel"))
    this.data.set_value(this.data.items[this.active])
  }
  commands(): any {
    if (this.multi_select)
      return { Dir: "Move", A: "Toggle", B: "Ok" }
    return { Dir: "Move", B: "Ok", A: "Ok" }
  }

  key_dir(detail: any) {
    if (is_any_up(detail))
      this.active -= 1
    else if (is_any_down(detail))
      this.active += 1
    this.active = clamp(this.active, 0, this.data.items.length - 1)
    if (!this.multi_select)
      this.data.set_value(this.data.items[this.active])
    return true
  }
  is_checked(key: string) {
    return this.data.is_checked(key)
  }
  async update() {
    const x0 = this.rect.x
    const y0 = this.rect.y
    const w0 = this.rect.w
    const h0 = this.rect.h
    const ctx = this.get_ctx()
    this.clear()
    ctx.save()
    ctx.fillColor = this.fg_color;
    ctx.textAlign = "center";
    if (this.multi_select)
      ctx.textAlign = 'left'
    ctx.textBaseline = "middle";
    ctx.font = `${this.font_size}px ${this.font}`
    for (let i = this.active - 3; i <= this.active + 3; i++) {
      if (i < 0 || i >= this.data.items.length)
        continue
      let x = x0 + w0 / 2
      let y = y0 + h0 / 2 + this.line_height * (i - this.active)
      if (this.multi_select)
        x = x0 + 20
      let dk = 1 - (Math.abs(i - this.active) / 3) * 0.4
      ctx.fillStyle = this.fg_color + (Math.floor(255 * dk)).toString(16)
      if (this.multi_select) {
        checkbox(ctx, x, y - this.line_height / 2, this.is_checked(this.data.items[i]))
        x += 100
      }
      if (this.data.draw) {
        this.data.draw(this.data.items[i])(ctx, x, y)
      } else {
        ctx.fillText(name_ui(this.data.items[i]), x, y)
      }
    }
    ctx.strokeStyle = this.fg_color
    strokeRect(ctx, x0, y0 + h0 / 2 - this.line_height / 2, w0, this.line_height, this.fg_color)
    ctx.restore()
  }
}
