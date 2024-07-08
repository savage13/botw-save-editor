
import { View, Rect } from './View'

import { strokeRect, fillRect, checkbox } from './draw'

const ROW = 0
const COL = 1

export class QuestView extends View {
  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)
    const padding = 20
    this.rect.x += padding
    this.rect.y += padding
    this.rect.w -= 2 * padding
    this.rect.h -= 2 * padding
    this.rows = this.data.items.length;
    this.calc_nlines()
    this.set_widths([this.rect.w * 0.50])

  }

  key_a() {
    let index = this.selected_index()
    let item = this.data.items[index]
    if (item.header)
      return
    let value = this.value(item.key)
    this.state.active_edits[item.key] = !value
    if (this.state.active_edits[item.key] == this.data.save.data.get(item.key))
      delete this.state.active_edits[item.key]
  }
  key_b() {
    this.dispatchEvent(new CustomEvent("cancel"))
  }
  key_x() {
    this.dispatchEvent(new CustomEvent("write"))
  }
  key_y() {
    //this.dispatchEvent(new CustomEvent("write"))
  }

  commands(): any { return { B: 'Back', A: 'Select', X: 'Write' } }

  title(): string { return "Quests" }

  value(key: string): any {
    if (key in this.state.active_edits)
      return this.state.active_edits[key]
    return this.data.save.data.get(key)
  }
  is_modified(key: string): boolean {
    return key in this.state.active_edits
  }

  async update() {
    const ctx = this.get_ctx();
    this.clear()
    ctx.save()

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = this.fg_color;
    this.set_font(24)

    const items = this.data.items;

    let x0 = this.rect.x + this.widths[0] + 20
    let y0 = this.rect.y

    const start = this.item_offset()
    let i = 0;
    for (const item of items.slice(start)) {
      if (i >= this.nlines * this.cols)
        break
      let p = this.pos(i, start)

      if (this.is_modified(item.key))
        fillRect(ctx, p.x, p.y, p.w, p.h, this.edit_color)

      if (p.row == this.selected[ROW] && p.col == this.selected[COL]) {
        strokeRect(ctx, p.x, p.y, p.w, p.h, this.fg_color, 2)
        ctx.fillText(item.name, x0, y0)
        ctx.fillText(item.key, x0, y0 + this.line_height)
        if (item.txt) {
          item.txt.split("\n").forEach((line: string, k: number) => {
            ctx.fillText(line, x0, y0 + (k + 3) * this.line_height)
          })
        }
      }
      let prefix = (!item.header) ? "   " : ""
      ctx.fillText(prefix + item.name, p.x + 20, p.y + 4)
      if (!item.header)
        checkbox(ctx, p.x + 10 + 460, p.y + 4, this.value(item.key))

      i += 1


    }
    ctx.restore()
  }

}
