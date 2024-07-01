
import { View, Rect } from './View'

const ROW = 0
const COL = 1

export class CategoryView extends View {
  msg: string;
  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)
    const padding = 10;
    this.rect.x += padding
    this.rect.y += padding
    this.rect.w -= 2 * padding
    this.rect.h -= 2 * padding
    this.line_height = this.rect.h / 3
    const n = this.data.items.length
    this.rows = Math.ceil(n / 4)
    this.cols = (n > 4) ? 4 : n
    this.line_height = this.rect.h / 3
    this.calc_nlines()
    this.set_widths([0.25, 0.25, 0.25, 0.25].map((v: number) => v * this.rect.w))
    this.msg = ""
  }
  key_b() {
    this.dispatchEvent(new CustomEvent("cancel", {}))
  }
  key_a() {
    const save = this.data.save
    this.msg = ""
    if (!save || !save.data) {
      this.msg = "Waiting on game data"
      return
    }
    const index = this.selected_index()
    this.dispatchEvent(new CustomEvent("click", { detail: index }))
  }
  commands(): any { return { A: "Select", B: "Back" } }
  title(): string { return "Categories" }

  game_data_state(ctx: any) {
    ctx.save()
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    let x = this.rect.x + this.rect.w - 5
    let y = this.rect.y + this.rect.h - 5
    const save = this.data.save
    this.set_font(18)

    if (!save) {
      ctx.fillText("No active save", x, y)
    } else if (!save.data) {
      ctx.fillText("Loading game data ...", x, y)
    } else {
      ctx.fillText("Game data loaded", x, y)
    }
    if (save && save.status !== undefined)
      ctx.fillText(save.status, x, y - 18 * 1.2)
    if (this.msg.length)
      ctx.fillText(this.msg, x, y - 2 * 18 * 1.2)
    this.msg = ""
    ctx.restore()
  }

  async update() {
    const index = this.selected_index()
    const n = this.data.items.length
    if (index >= n) {
      this.selected[COL] = (n - 1) - (this.cols * (this.rows - 1))
    }
    const ctx = this.get_ctx()
    ctx.save()
    this.set_font(24)
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = this.fg_color
    this.clear()

    this.game_data_state(ctx)

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const w = 260
    const h = 120

    let i = 0
    for (const category of this.data.items) {
      const p = this.pos(i, 0)
      const xpad = (p.w - w) / 2
      const ypad = (p.h - h) / 2
      const x = p.x + xpad
      const y = p.y + ypad

      ctx.fillText(category, x + w / 2, y + h / 2);

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
