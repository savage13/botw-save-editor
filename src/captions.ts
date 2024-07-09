
import { View, Rect } from './View'

import { star } from './draw'
import { location_ui } from './formatters'

const ROW = 0
const COL = 1

export class CaptionView extends View {
  num_saves: number;
  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)
    const padding = 10;
    this.rect.x += padding
    this.rect.y += padding
    this.rect.w -= 2 * padding
    this.rect.h -= 2 * padding
    this.line_height = this.rect.h / 2
    this.num_saves = 0
    this.calc_nlines()
    this.set_widths([0.25, 0.25, 0.25, 0.25].map((v: number) => v * this.rect.w))
    this.data_updated()
  }
  data_updated() {
    this.rows = 0
    this.cols = 0
    const n = this.data.saves.length
    this.num_saves = n
    this.rows = Math.ceil(n / 4)
    this.cols = (n > 4) ? 4 : n
  }

  key_b() {
    this.dispatchEvent(new CustomEvent("cancel", {}))
  }
  key_a() {
    const index = this.selected_index()
    if (this.data.saves.length <= 0 || index < 0)
      return
    this.dispatchEvent(new CustomEvent("click", { detail: index }))
  }

  caption_status(ctx: any) {
    ctx.save()
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = this.fg_color
    this.set_font(18)
    let x = this.rect.x + this.rect.w
    let y = this.rect.y + this.rect.h
    if (!this.data.saves) {
      ctx.fillText('No saves loaded', x, y)
    } else if (this.data.saves.length == 0)
      ctx.fillText('Reading caption data ...', x, y)
    else
      ctx.fillText('Caption data loaded', x, y)
    ctx.restore()
  }

  commands(): any { return { A: "Select", B: "Back" } }

  title(): string { return "Save Files" }

  update() {
    const ctx = this.get_ctx()

    ctx.save()
    this.set_font(24)
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = this.fg_color
    this.clear()

    this.caption_status(ctx)
    if (this.data.saves.length != this.num_saves)
      this.data_updated()
    if (this.num_saves == 0)
      return

    const w = 256 // Image Width
    const h = 270 //
    const lh = this.font_size * 1.2

    let i = 0;
    for (const save of this.data.saves) {
      const p = this.pos(i, 0)
      const xpad = (p.w - w) / 2
      const ypad = (p.h - h) / 2
      const x = p.x + xpad
      let y = p.y + ypad

      if (save.screenshot) {
        ctx.drawImage(save.screenshot, x, y);
      }
      let y1 = (save.screenshot) ? save.screenshot.height : 144;
      y1 += y;
      if (save.location)
        ctx.fillText(location_ui(save.location), x + w / 2, y1 + lh);
      if (save.district)
        ctx.fillText(location_ui(save.district), x + w / 2, y1 + 2 * lh)

      if (save.is_auto_save === false) {
        star(ctx, x + 25, y + 25, this.fg_color)
      }
      if (save.hard === true) {
        ctx.save()
        ctx.fillStyle = "#E35026aa"
        ctx.beginPath()
        ctx.roundRect(x + w - 90, y, 90, lh, 5)
        ctx.fill()
        ctx.fillStyle = "#000000"
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText("Master", x + w - 10, y + 5)
        ctx.restore()
      }
      ctx.beginPath()
      ctx.lineWidth = 5;
      if (p.row == this.selected[ROW] && p.col == this.selected[COL]) {
        ctx.strokeStyle = "#26b773";
      } else {
        ctx.strokeStyle = "gray";
      }
      ctx.roundRect(x, y, w, h, 10);
      ctx.stroke();


      i += 1
    }


    ctx.restore()
  }
}
