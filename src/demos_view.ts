
import { View, Rect } from './View'
import { strokeRect, checkbox } from './draw'

const ROW = 0
const COL = 1

export class DemosView extends View {

  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)
    const padding = 20
    this.rect.x += padding
    this.rect.y += padding
    this.rect.w -= 2 * padding
    this.rect.h -= 2 * padding
    this.rows = this.data.items.length
    this.calc_nlines()
    this.set_widths([this.rect.w * 0.66])
  }

  commands(): any { return { a: "Toggle", b: "Back", x: "Write" } }

  key_a() {
    const index = this.selected[ROW]
    const item = this.data.items[index]
    let value = this.data.get_value(item.key)
    return this.data.set_value(item.key, !value)
  }

  key_b() {
    return "pop"
  }
  key_x() {
    return "write_save_file"
  }


  async update() {
    const ctx = this.get_ctx()
    const items = this.data.items;
    this.clear()
    const start = this.item_offset()
    let i = 0
    ctx.save()
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    this.set_font(24)

    let x0 = this.rect.x + this.widths[0] + 20
    let y0 = this.rect.y

    for (const item of items.slice(start)) {
      if (i >= this.nlines * this.cols)
        break
      let p = this.pos(i, start)
      if (p.row == this.selected[ROW] && p.col == this.selected[COL]) {
        strokeRect(ctx, p.x, p.y, p.w, p.h, this.fg_color, 2)
        ctx.fillText(item.key, x0, y0)
        if (item.txt) {
          item.txt.split("\n").forEach((line: string, i: number) => {
            ctx.fillText(line, x0, y0 + (i + 1) * this.line_height)
          })
        }
      }
      ctx.fillText(item.key, p.x + 60, p.y)
      checkbox(ctx, p.x + 10 + 460, p.y, this.data.get_value(item.key))

      i += 1
    }
    ctx.restore()
  }
}
