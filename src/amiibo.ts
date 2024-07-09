
import { View, Rect } from './View'

import { amiibo_ui } from './formatters'

import { fillRect } from './draw'

const ROW = 0;

export class AmiiboView extends View {
  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)
    const padding = 20
    this.rect.x += padding
    this.rect.y += padding
    this.rect.w -= 2 * padding
    this.rect.h -= 2 * padding
    this.set_widths([this.rect.w * 0.5])
    this.calc_nlines()
  }
  commands(): any { return { B: "Back", X: "Write", Y: "Reset" } }
  title(): string { return 'Amiibo' }
  key_a() {
  }
  key_b() {
    this.dispatchEvent(new CustomEvent("cancel"))
  }
  key_x() {
    this.dispatchEvent(new CustomEvent("write"))
  }
  key_y() {
    //this.dispatchEvent(new CustomEvent("write"))
    this.state.active_edits['AmiiboLastTouchDate'] = '19700101'
  }

  value(key: string) {
    if (key in this.state.active_edits)
      return this.state.active_edits[key]
    return this.data.save.data.get(key)
  }

  update() {
    const ctx = this.get_ctx();
    this.clear()
    ctx.save()

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = this.fg_color;
    this.set_font(24)

    //let amiibo = this.data.save.data.get('AmiiboTouchHistory').filter((v: any) => v.length)
    let amiibo = this.value('AmiiboTouchHistory').filter((v: any) => v.length)

    this.rows = amiibo.length

    let x0 = this.rect.x + this.widths[0] + 20
    let y0 = this.rect.y

    const start = this.item_offset()
    let i = 0;
    for (const item of amiibo.slice(start)) {
      if (i >= this.nlines)
        break
      let p = this.pos(i, start)
      if (p.row == this.selected[ROW]) {
        fillRect(ctx, p.x, p.y, p.w, p.h, this.current_row_color)
        const parts = item.split("_")
        let count = parseInt(parts[3])
        let uid = parts[0]
        ctx.fillText(amiibo_ui(item), x0, y0 + this.line_height * 0)
        ctx.fillText(`UID: ${uid}`, x0, y0 + this.line_height * 1)
        ctx.fillText(`Count: ${count}`, x0, y0 + this.line_height * 2)
        this.set_font(20)
        ctx.fillText(`Raw: ${item}`, x0, y0 + this.line_height * 3)

        this.set_font(28)
        const last = this.value('AmiiboLastTouchDate')
        ctx.fillText(`Last Amiibo Use Date`, x0, y0 + this.line_height * 5.5)
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = this.fg_color
        ctx.moveTo(x0, y0 + this.line_height * 6.5)
        ctx.lineTo(x0 + 400, y0 + this.line_height * 6.5)
        ctx.stroke()
        this.set_font(24)
        ctx.fillText(`${last}`, x0 + 20, y0 + this.line_height * 7)
        this.set_font(20)
        ctx.fillText(`Press Y to Reset`, x0 + 20, y0 + this.line_height * 8)
        this.set_font(24)
      }
      let k = p.row.toString().padStart(4, ' ')
      ctx.fillText(k + ' ' + amiibo_ui(item), p.x + 20, p.y + 5)
      i += 1
    }

    ctx.restore()
  }
}
