
import { View, Rect } from './View'

function mixin(a: any, b: any): any {
  // Choice: Should isA apply to either mixin? Should it apply to neither?
  const aNotB = Object.defineProperties(Object.create(a.prototype),
    Object.getOwnPropertyDescriptors(b.prototype));
  const shadowClass: any = function shadowClass() { }
  shadowClass.prototype = aNotB;
  class mixinImpl extends shadowClass { }
  return mixinImpl;
}

const ROW = 0
const COL = 1

export class AccountView extends View {

  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)
    const padding = 10;
    this.rect.x += padding
    this.rect.y += padding
    this.rect.w -= 2 * padding
    this.rect.h -= 2 * padding
    this.line_height = this.rect.h / 2

    const n = this.data.profiles.length

    this.rows = Math.ceil(n / 4)
    this.cols = (n > 4) ? 4 : n

    this.calc_nlines()
    this.set_widths([0.25, 0.25, 0.25, 0.25].map((v: number) => v * this.rect.w))
  }

  key_a() {
    const index = this.selected_index()
    const profile = this.data.profiles[index]
    this.dispatchEvent(new CustomEvent("click", { detail: profile }))
  }

  title(): string { return "Accounts" }

  commands(): any { return { A: "Select" } }

  async update() {
    const index = this.selected_index()
    const n = this.data.profiles.length
    if (index >= n) {
      this.selected[COL] = (n - 1) - (this.cols * (this.rows - 1))
    }
    const ctx = this.get_ctx()
    ctx.save()
    this.clear()

    const w = 256 // Image Width
    const h = 300 //

    this.set_font(24)
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = this.fg_color
    const lh = this.font_size * 1.2
    let i = 0;
    for (const profile of this.data.profiles) {
      let p = this.pos(i, 0)
      const xpad = (p.w - w) / 2
      const ypad = (p.h - h) / 2
      const x = p.x + xpad
      const y = p.y + ypad
      ctx.fillText(profile.nickname, x + w / 2, y + 256 + lh / 2)
      if (profile.Image)
        ctx.drawImage(profile.Image, x, y);
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
