
import { View, Rect } from './View'
import { is_up, is_down, is_any_up, is_any_right, is_any_left, is_any_down } from './View'
import { fillRect, checkbox } from './draw'
import { UI, tower_pos, pos_to_map } from './formatters'
import { clamp, loadImageFile } from './util'
import { scale_actor } from './LevelSensor'

const ROW = 0

// @ts-ignore
import MapUrl from './BotW-Map-small.jpg';

let MapImage: undefined | Image = undefined


export class DetailsView extends View {
  editing: boolean;
  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)
    this.editing = false
    const padding = 20
    this.rect.x += padding
    this.rect.y += padding
    this.rect.w -= 2 * padding
    this.rect.h -= 2 * padding
    this.cols = 1
    this.rows = this.data.items.length
    this.calc_nlines()
    this.set_widths([0.50 * this.rect.w])
  }

  title(): string { return this.data.title || "Details" }

  commands(): any { return { X: "Write", B: "Back", A: "Select" } }

  key_b() {
    this.dispatchEvent(new CustomEvent("cancel"))
  }
  key_x() {
    this.dispatchEvent(new CustomEvent("write"))
  }
  key_a() {
    if (this.editing) {
      this.editing = false;
      return
    }
    let index = this.selected_index()
    let item = this.data.items[index]
    let value = this.value(item.key)
    let value_type = this.data.save.type(item.key)

    if (value_type == "bool") {
      this.dispatchEvent(new CustomEvent("change", { detail: { key: item.key, value: !value } }))
    } else if (value_type == "s32" || value_type == "f32") {
      this.editing = true
    }
  }
  key_dir(detail: number): boolean {
    if (!this.editing)
      return false
    let index = this.selected_index()
    let item = this.data.items[index]
    let value = this.value(item.key)
    let value_type = this.data.save.type(item.key)

    if (value_type == "s32" || value_type == "f32") {
      let step = (is_up(detail) || is_down(detail)) ? item.bigstep : item.step;
      if (is_any_up(detail) || is_any_right(detail))
        value += step
      else if (is_any_down(detail) || is_any_left(detail))
        value -= step
      if (item.min != undefined && item.max != undefined)
        value = clamp(value, item.min, item.max)
      this.dispatchEvent(new CustomEvent("change", { detail: { key: item.key, value: value } }))
    }
    return true;

  }

  edited(key: string): boolean {
    return key in this.state.active_edits
  }

  value(key: string): any {
    if (key in this.state.active_edits)
      return this.state.active_edits[key]
    if (key == "DifficultyScale") {
      const args = scale_actor(this.data.save.data, this.state.active_edits)
      return args.scale_points;
    }
    return this.data.save.get(key)
  }

  async update() {
    if (MapImage === undefined) {
      MapImage = await loadImageFile(MapUrl)
    }
    const ctx = this.get_ctx()
    ctx.save()
    ctx.fillStyle = this.fg_color
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    this.set_font(24)

    if (!this.data.save || !this.data.save.data) {
      ctx.fillText("Loading save data...", 1280 / 2, 720 / 2)
      return
    }

    const w_name = 350

    const start = this.item_offset()
    let i = 0
    for (const item of this.data.items.slice(start)) {
      if (i > this.nlines * this.cols - 1)
        break
      const p = this.pos(i, start)

      if (p.row == this.selected[ROW]) {
        let color = this.current_row_color
        if (this.edited(item.key))
          color = this.edit_color
        if (this.editing)
          color = this.active_color
        fillRect(ctx, p.x, p.y, p.w, p.h, color)

      } else if (this.edited(item.key)) {
        fillRect(ctx, p.x, p.y, p.w, p.h, this.edit_color)
      }

      const value = this.value(item.key)

      let nfmt = (x: any) => { return x }
      if (item.name_ui && item.name_ui in UI)
        nfmt = UI[item.name_ui]

      ctx.fillText(nfmt(item.name), p.x, p.y)

      let fmt = (x: any) => { return `${x}` };
      if (item.ui && item.ui in UI)
        fmt = UI[item.ui]

      let value_type = this.data.save.type(item.key)
      if (value_type == "bool")
        checkbox(ctx, p.x + w_name, p.y + 4, value)
      else
        ctx.fillText(fmt(value), p.x + w_name, p.y + 0.1 * this.font_size)

      if (p.row == this.selected[ROW]) {
        if (this.data.title != "Defeated Enemies")
          ctx.drawImage(MapImage, 1280 - 600, 720 - 500)
        let pos = tower_pos(item.name)
        if (item.key.startsWith("PlayerSavePos"))
          pos = this.value("PlayerSavePos")
        if (pos) {
          const ipos = pos_to_map(pos)
          ctx.save()
          ctx.beginPath()
          ctx.arc(ipos[0], ipos[2], 10, 0, 2 * Math.PI);
          ctx.fill()
          const xyz = pos.map((v: number) => v.toFixed(2)).join(", ")
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';

          ctx.fillText(xyz, 1280 - 600, 720 - 10)
          ctx.restore()
        }
        const lh = this.line_height
        let k = 0;
        ctx.fillText(nfmt(item.name), 1280 - 600, this.rect.y + lh * k)
        if (item.name != nfmt(item.name)) {
          k += 1
          ctx.fillText(item.name, 1280 - 600, this.rect.y + lh * k)
        }
        if (item.key != item.name) {
          k += 1
          ctx.fillText(item.key, 1280 - 600, this.rect.y + lh * k)
        }
        k += 1
        ctx.fillText(fmt(value), 1280 - 600, this.rect.y + lh * k)
        if (item.txt) {
          k += 1
          let txt = item.txt
          if (item.key == "DifficultyScale") {
            const args = scale_actor(this.data.save.data, this.state.active_edits)
            txt = txt.replace(/\${(\w+)}/g, (_, v) => args[v])
          }
          let lines = txt.split("\n")
          for (let j = 0; j < lines.length; j++) {
            ctx.fillText(lines[j].trim(), 1280 - 600, this.rect.y + lh * (k + j))
          }
        }
      }
      i += 1
    }
    if (this.data.title == "Defeated Enemies") {
      const args = scale_actor(this.data.save.data, this.state.active_edits)
      this.set_font(28)
      ctx.fillText(`Difficulty Scaling`, 1280 - 600, this.rect.y + this.line_height * 6.5)
      ctx.beginPath()
      ctx.strokeStyle = this.fg_color
      ctx.lineWidth = 2
      ctx.moveTo(1280 - 600, this.rect.y + this.line_height * 7.5)
      ctx.lineTo(1280 - 600 + 500, this.rect.y + this.line_height * 7.5)
      ctx.stroke()
      this.set_font(24)
      ctx.fillText(`Points: ${args.scale_points}`, 1280 - 600 + 30, this.rect.y + this.line_height * 8)
      ctx.fillText(`Enemy Points: ${args.enemy_points}`, 1280 - 600 + 30, this.rect.y + this.line_height * 9)
      ctx.fillText(`              = points * 0.014`, 1280 - 600 + 30, this.rect.y + this.line_height * 10)
      ctx.fillText(`Weapons Points: ${args.weapon_points}`, 1280 - 600 + 30, this.rect.y + this.line_height * 11)
      ctx.fillText(`              = points * 0.012`, 1280 - 600 + 30, this.rect.y + this.line_height * 12)
      let k = 14
      for (const key of ['BokoblinSeries', 'LizalfosSeries', 'MoriblinSeries', 'LynelSeries', 'AssassinSeries']) {
        const k1 = `${key}_current`
        const k2 = `${key}_current_value`
        const k3 = `${key}_next`
        const k4 = `${key}_next_value`
        const trans = (args[k3] != "") ? "--" : "(maxed)"
        ctx.fillText(`${args[k1]} ${args[k2]} ${trans} ${args[k3]} ${args[k4]}`, 1280 - 600 + 30, this.rect.y + this.line_height * k)
        k += 1
      }
    }

    ctx.restore()


  }
}
