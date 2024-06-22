
import { HidNpadButton } from '@nx.js/constants';

import { View, Rect } from './View'
import { is_any_up, is_any_right, is_any_down, is_any_left } from './View'
import { is_up, is_right, is_down, is_left } from './View'

import { PorchItem, Modifier, ModVals, PorchName } from './savefile'
import { fillRect, strokeRect, checkbox } from './draw'
import { spicy, hasty, chilly, electro, sneaky, stamina_circle, heart } from './draw'
import { CookEffectValues, CookEffectKeys, CookEffect } from './cook_effect'
import { ItemDisplay2View, ItemDialogView } from './item_display'
import { UI, heart_ui, duration_ui } from './formatters'
import { clamp, range } from './util'

const ROW = 0
const COL = 1


export class InventoryView extends View {
  padding: number;
  editing: boolean;
  edit_key: string;
  edit_type: string;
  edit_index: number;
  edit_kind: string;
  edit_item: any;
  edits: any;
  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data);
    this.editing = false
    this.padding = 20
    this.rect.x += this.padding
    this.rect.y += this.padding
    this.rect.w -= 2 * this.padding
    this.rect.h -= 2 * this.padding
    this.cols = 5
    this.rows = this.data.items.length / this.cols
    this.calc_nlines()
    let colw = (1.0 - 0.3) / 4
    this.set_widths([0.3, colw, colw, colw, colw].map((v: any) => v * this.rect.w))
    this.edit_key = ""
    this.edit_kind = ""
    this.edit_type = ""
    this.edit_index = 0
    this.edits = {}
  }

  key_b() {
    if (!this.editing)
      this.dispatchEvent(new CustomEvent('cancel'))
  }
  key_a() {
    // Do not edit a Header value
    const k = this.selected_index()
    const item = this.data.items[k]
    if (item.header)
      return

    this.edit_item = item
    this.edit_key = item.key
    this.edit_type = this.data.save.type(item.key)
    let v = item.key.split(".")
    this.edit_kind = v[1]
    this.edit_index = parseInt(v[0].split("[")[1].replace("]", ""))

    if (this.edit_type == "bool") {
      return this.set_edit_value(!this.edit_value())
    }

    if (this.edit_kind == "stamina_recover") {
      const x = 1280 * 0.33
      const y = 720 * 0.33
      const w = 1280 * 0.33
      const h = 720 * 0.33
      const items1 = range(120)
      const items2 = range(30 * 4).map(v => 60 * v / 4)
      const v = new ItemDisplay2View(this.state, new Rect(x, y, w, h), {
        save: this.data.save,
        selected: this.data.save.pouch_items[this.edit_index][this.edit_kind],
        set_value: (value: any) => {
          value = value.map((x: any) => parseFloat(x))
          this.set_edit_value(value)
        },
        get_items1: (_key: string) => { return items1 },
        get_items2: (_key: string) => { return items2 },
        fmt_items2: (_key: string) => { return (x: number) => duration_ui(x) },
        fmt_items1: (_key: string) => { return (x: number) => heart_ui(x) },
      })
      v.addEventListener('cancel', (_ev: CustomEvent) => {
        this.state.pop_view()
      })
      this.state.push_view(v)
      return
    }
    if (this.edit_kind == "cook_effect0") {
      const x = 1280 * 0.33
      const y = 720 * 0.33
      const w = 1280 * 0.33
      const h = 720 * 0.33
      const items = Object.keys(CookEffectValues).filter(v => !isNaN(Number(v)))
      const items2: { [key: string]: number[] } = { default: [1, 2, 3] }

      items2[CookEffectKeys.None] = []
      items2[CookEffectKeys.LifeMaxUp] = []
      items2[CookEffectKeys.GutsRecover] = [200, 400, 800, 1000, 1400, 1600, 2200, 2400, 2800, 3000]
      items2[CookEffectKeys.ExGutsMaxUp] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      const v = new ItemDisplay2View(this.state, new Rect(x, y, w, h), {
        items: items,
        save: this.data.save,
        selected: this.data.save.pouch_items[this.edit_index][this.edit_kind],
        set_value: (value: any) => {
          //console.log('SET VALUE', value)
          value = value.map((x: any) => parseFloat(x))
          this.set_edit_value(value)
        },
        get_items1: () => { return items; },
        get_items2: (key: string) => {
          if (key in items2)
            return items2[key];
          return items2.default
        },
        fmt_items1: (_key: string) => {
          return (x: number) => CookEffect[CookEffectValues[x]]
        },
        fmt_items2: (key: number) => {
          if (key == CookEffectKeys.GutsRecover)
            return (x: number) => { return (x / 1000).toFixed(1) }
          if (key == CookEffectKeys.ExGutsMaxUp)
            return (x: number) => { return (x / 5).toFixed(1) }
          return (x: any) => x;
        }
      })
      v.addEventListener('cancel', (_ev: CustomEvent) => {
        this.state.pop_view()
      })
      this.state.push_view(v)
      return

    }
    if (this.edit_kind == "name") {
      const x = 1280 * 0.33
      const y = 720 * 0.33
      const w = 1280 * 0.33
      const h = 720 * 0.33
      const items = Object.keys(PorchName).filter(v => isNaN(Number(v)))
      const v = new ItemDialogView(this.state, new Rect(x, y, w, h), {
        items: items,
        save: this.data.save,
        selected: this.data.save.pouch_items[this.edit_index]['name'],
        set_value: (value: any) => {
          this.set_edit_value(value)
        },
      })
      v.addEventListener('cancel', () => {
        this.state.pop_view()
      })
      this.state.push_view(v)
      return
    }
    if (this.edit_kind == "flag_sp") {
      const x = 1280 * 0.33
      const y = 720 * 0.33
      const w = 1280 * 0.33
      const h = 720 * 0.33
      const items = ["Durability Up", "Long Throw", "Attack Up", "Zoom"]

      const v = new ItemDialogView(this.state, new Rect(x, y, w, h), {
        items: Object.keys(ModVals),
        save: this.data.save,
        selected: 2,
        multi_select: true,
        is_checked: (key: any) => {
          let value = this.edit_value()
          let m = new Modifier(value)
          return m.is(key)
        },
        set_value: (key: any) => {
          let value = this.edit_value()
          let m = new Modifier(value)
          m.toggle(key)
          this.set_edit_value(m.value)
        },
      })
      v.addEventListener('cancel', () => {
        this.state.pop_view()
      })

      this.state.push_view(v)
      return
    }

    //console.log("GET", index, kind, save.pouch_items[index])
    //return save.pouch_items[index][kind]
    this.editing = !this.editing

  }
  key_x() { // Writ data to save file
    this.dispatchEvent(new CustomEvent("write"))
  }
  key_y() { // Revert to existing data in save file
    this.dispatchEvent(new CustomEvent("revert"))
    return "update_pouch_items"
  }

  get_item_index() {
    let k = this.selected_index()
    const item = this.data.items[k]
    if (item.header)
      return undefined
    let v = item.key.split(".")
    let index = parseInt(v[0].split("[")[1].replace("]", ""))
    return index
  }

  key_zl_up() {
    let index = this.get_item_index()
    //console.log("ZL UP", index);
    if (index === undefined)
      return
    if (index == 0)
      return
    let item = this.data.save.pouch_items.splice(index, 1) // Remove item
    this.data.save.pouch_items.splice(index - 1, 0, item[0]) // Insert item
    this.state.update_pouch_items_details(this.data.save)
    this.data.items = this.state.details["Pouch Items"]
    this.key(HidNpadButton.StickRUp)
  }
  key_zl_down() {
    let index = this.get_item_index()
    //console.log("ZL DOWN", index);
    if (index === undefined)
      return
    let item = this.data.save.pouch_items.splice(index, 1) // Remove item
    this.data.save.pouch_items.splice(index + 1, 0, item[0]) // Insert item
    this.state.update_pouch_items_details(this.data.save)
    this.data.items = this.state.details["Pouch Items"]
    this.key(HidNpadButton.StickRDown)
  }
  key_zl_minus() {
    //console.log("ZL MINUS");
    let index = this.get_item_index()
    if (index === undefined)
      return
    const n = this.data.save.pouch_items.length
    if (index >= 0 && index <= n) {
      this.data.save.pouch_items.splice(index, 1)
    }
    this.state.update_pouch_items_details(this.data.save)
    this.data.items = this.state.details["Pouch Items"]
  }
  key_zl_plus(): any {
    const MAX: { [key: string]: number } = {
      Total: 420,
      Weapon: 20,
      Shield: 20,
      Bow: 14,
      Arrow: 6,
      Armor: 100,
      Food: 60,
    }
    //console.log("ZL PLUS");
    const new_names: any = {
      Weapon: 'Weapon_Sword_044',
      Bow: 'Weapon_Bow_001',
      Shield: 'Weapon_Shield_040',
      Arrow: 'NormalArrow',
      Armor: 'Armor_001_Head',
      Cook: 'Item_Boiled_01',
      Material: 'Item_Ore_I',
      KeyItem: 'Obj_DungeonClearSeal',
    }

    if (this.data.save.pouch_items.length + 1 > MAX.Total) {
      return "preventDefault"
    }

    let k = this.selected_index()
    let item = this.data.items[k]
    // Save original type if on header
    let ptype0 = (item.header) ? item.key : undefined
    // Get next real value
    while (item && item.header) {
      k += 1
      item = this.data.items[k]
    }
    let new_item = new PorchItem()
    // If at the end, add a Key Item
    if (k >= this.data.items) {
      new_item.name = new_names["KeyItem"]
      this.data.save.pouch_items.push(new_item)
    } else {
      // Get Index
      let v = item.key.split(".")
      let index = parseInt(v[0].split("[")[1].replace("]", ""))
      const value = this.data.save.pouch_items[index]
      let pt = (ptype0) ? ptype0 : value.ptype
      new_item.name = new_names[pt]
      if (!ptype0)
        index += 1
      if (pt in MAX && this.data.save.pouch_items.length + 1 >= MAX[pt])
        return "preventDefault"
      this.data.save.pouch_items.splice(index, 0, new_item)

    }
    this.state.update_pouch_items_details(this.data.save)
    this.data.items = this.state.details["Pouch Items"]
    return "preventDefault"
  }

  edit_value() {
    return this.data.save.pouch_items[this.edit_index][this.edit_kind]
  }
  set_edit_value(value: any) {
    //console.log("set edit value", value, this.edit_index, this.edit_kind)
    this.data.save.pouch_items[this.edit_index][this.edit_kind] = value
  }
  edit_step(detail: any) {
    let step = 0
    if (is_up(detail) || is_right(detail))
      step = this.edit_item.bigstep
    else if (is_down(detail) || is_left(detail))
      step = -this.edit_item.bigstep
    else if (is_any_up(detail) || is_any_right(detail))
      step = this.edit_item.step
    else if (is_any_down(detail) || is_any_left(detail))
      step = -this.edit_item.step
    return step
  }

  key_dir(detail: any) {
    if (!this.editing) {
      return false;
    }
    if (this.edit_type == "bool") {
      this.set_edit_value(!this.edit_value())
    } else if (this.edit_type == "s32") {
      let value = this.edit_value()
      let step = this.edit_step(detail)
      value = clamp(value + step, this.edit_item.min, this.edit_item.max)
      this.set_edit_value(value)
    } else if (this.edit_type == "vector2f_array") {
      if (this.edit_key == "cook_effect1") { // Basic Price
        // [SellingPrice, 0] = CookEffect1
        let value = this.edit_value()
        let step = this.edit_step(detail)
        value[0] = clamp(value[0] + step, this.edit_item.min, this.edit_item.max)
        this.set_edit_value(value)
      }
      //console.log("VAL", this.edit_value())
    } else {

    }
    return true
  }

  value(key: string) {
    return this.data.save.get(key)
  }
  title(): string { return "Inventory" }

  commands(): any {
    return {
      X: "Write", B: "Back", A: "Select", Y: "Revert",
      ZL: "Move", "ZL-": "Del", "ZL+": "Add",
    }
  }

  // x - Send changes to save file, clear edits
  // y - Reread pouch data from savefile, redraw

  // ZL Move, shift selected item up or down, change selected value up or down
  // ZL - remove item from list
  // ZL + Add item from list, Pick default Item to add
  //      Based on value above or below

  async update() {
    const ctx = this.get_ctx()
    const items = this.data.items;
    //const save = this.data.save;

    this.clear()

    ctx.font = `${this.font_size}px ${this.font}`
    ctx.fillColor = this.fg_color;

    const start = this.item_offset()
    let i = 0;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.lineWidth = 1;
    for (const item of items.slice(start)) {
      if (i > this.nlines * this.cols - 1)
        break

      let p = this.pos(i, start)
      if (p.row == this.selected[ROW]) {
        fillRect(ctx, p.x, p.y, p.w, p.h, "#222222")
      }

      if (item.skip) {
        i += 1
        continue
      }

      if (p.row == this.selected[ROW] && p.col == this.selected[COL]) {
        strokeRect(ctx, p.x, p.y, p.w, p.h, this.fg_color, 2)
        if (this.editing) {
          fillRect(ctx, p.x, p.y, p.w, p.h, this.active_color)
        }
      }
      if (item.edited) {
        fillRect(ctx, p.x, p.y, p.w, p.h, this.edit_color)
      }
      if (item.header) {
        fillRect(ctx, p.x, p.y, p.w, p.h, "#444444")
      }
      let fmt = (x: any) => { return x };
      if (item.ui && item.ui in UI)
        fmt = UI[item.ui]

      let value_raw = item.key
      if (!item.header)
        value_raw = this.value(value_raw)

      // @ts-ignore
      let value = fmt(value_raw, { item, save: this.data.save })
      const lh = this.line_height

      ctx.fillStyle = this.fg_color;
      if (this.data.save.type(item.key) == "bool")
        checkbox(ctx, p.x + 24, p.y + lh / 8, value_raw)
      else if (typeof (value) == "string" && item.key.endsWith(".cook_effect0") && value === "")
        heart(ctx, p.x + 24, p.y + lh / 2, "#EA3323")
      else if (typeof (value) == "string" && value.startsWith("LifeMaxUp"))
        heart(ctx, p.x + 24, p.y + lh / 2, "#FDFC72")
      else if (typeof (value) == "string" && value.startsWith("AllSpeed"))
        hasty(ctx, p.x + 24, p.y + lh / 2, value_raw[1])
      else if (typeof (value) == "string" && value.startsWith("ResistElectric"))
        electro(ctx, p.x + 24, p.y + lh / 2, value_raw[1])
      else if (typeof (value) == "string" && value.startsWith("ResistHot"))
        chilly(ctx, p.x + 24, p.y + lh / 2, value_raw[1])
      else if (typeof (value) == "string" && value.startsWith("ResistIce"))
        spicy(ctx, p.x + 24, p.y + lh / 2, value_raw[1])
      else if (typeof (value) == "string" && value.startsWith("Quietness"))
        sneaky(ctx, p.x + 24, p.y + lh / 2, value_raw[1])
      else if (typeof (value) == "string" && value.startsWith("GutsRecover")) {
        stamina_circle(ctx, p.x + 24, p.y + lh / 2, value_raw[1] / 1000, "lime")
      } else if (typeof (value) == "string" && value.startsWith("ExGutsMaxUp")) {
        stamina_circle(ctx, p.x + 24, p.y + lh / 2, value_raw[1] / 5, "yellow")
      } else
        ctx.fillText(`${value}`, p.x, p.y)
      i += 1
    }
  }
}
