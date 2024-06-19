
import { View, Rect } from './View'
import { fillRect } from './draw'

export class Message extends View {

  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)
    this.borderWidth = 3
    this.borderColor = this.fg_color;
  }
  key_a() {
    this.data.on_confirm()
  }
  key_b() {
    this.data.on_cancel()
  }

  set_msg(msg: string) {
    this.data.msg = msg
    if (this.data.on_update)
      this.data.on_update()
  }

  commands(): any { return { A: "Ok", B: "Cancel" } }

  async update() {
    const ctx = this.get_ctx()
    this.clear()

    ctx.save()

    let x = this.rect.x
    let y = this.rect.y
    let w = this.rect.w
    let h = this.rect.h

    fillRect(ctx, x, y, w, 10, this.fg_color)

    if (this.data.title) {
      this.set_font(32)
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(this.data.title, x, y + 12)
    }
    if (this.data.msg) {
      this.set_font(24)
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let x1 = x + w / 2
      let y1 = y + h / 2
      ctx.fillText(this.data.msg, x1, y1)
    }
    if (this.data.ok_cancel) {
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      let x1 = x + w - 10
      let y1 = y + h - 10
      ctx.fillText("A: Ok   B:  Cancel ", x1, y1)
    }


    ctx.restore()
  }
}
