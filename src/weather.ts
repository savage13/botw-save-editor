
import { View, Rect } from './View'

import { strokeRect, fillRect, sun, rain, cloudy, snow, storm } from './draw'
import { pos_to_map } from './formatters'
import { read_json } from './savefile'
import { ItemDialogView } from './item_display'
import { loadImageFile } from './util'

// @ts-ignore
import MapUrl from './BotW-Map-small.jpg';

let MapImage: undefined | Image = undefined

// @ts-ignore
import RegionsUrl from './climate_polys.json'

let Regions: undefined | any = undefined

const Weathers: { [key: number]: any } = {
  0: sun,    // Blue Sky
  1: cloudy,      // Cloudy
  2: rain,      // Rain
  3: rain,  // Heavy Rain
  4: snow,     // Snow
  5: snow, // HeavySnow
  6: storm,    // ThunderStorm
  7: storm, // ThunderRain
  8: sun,   // BlueSkyRain
}

const ROW = 0
const COL = 1

export class WeatherView extends View {

  climates_keys: string[];
  climates: string[];
  items: any[];

  cw: any;

  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)
    const padding = 20
    this.rect.x += padding
    this.rect.y += padding
    this.rect.w -= 2 * padding
    this.rect.h -= 2 * padding
    this.cols = 7
    this.climates_keys = [
      "HyrulePlainClimate", "NorthHyrulePlainClimate", "HebraFrostClimate", // Rain to Snow (2)
      "TabantaAridClimate", "FrostClimate",   // Rain to Snow (4)
      "GerudoDesertClimate", "GerudoPlateauClimate", "EldinClimateLv0",
      "TamourPlainClimate", "ZoraTemperateClimate", "HateruPlainClimate",
      "FiloneSubtropicalClimate", "SouthHateruHumidTemperateClimate",
      "EldinClimateLv1", "EldinClimateLv2",
      // sic
      "DarkWoodsClimat", "LostWoodClimate", "GerudoFrostClimate", // Rain to Snow (17)
      "KorogForest", "GerudoDesertClimateLv2"
    ]
    this.climates = [
      "Hyrule Plain", "North Hyrule Plain", "Hebra Frost",
      "Tabanta Arid", "Frost", "Gerudo Desert",
      "Gerudo Plateau", "Eldin Lv0", "Tamour Plain",
      "Zora Temperate", "Hateru Plain", "Filone Subtropical",
      "South Hateru Humid Temperate", "Eldin Lv1", "Eldin Lv2",
      "Dark Woods", "Lost Wood", "Gerudo Frost",
      "Korog Forest", "Gerudo Desert Lv2",
    ]
    this.items = this.climates.map((v, i) => [
      { name: v, key: v },
      { key: [i, 0] },
      { key: [i, 1] },
      { key: [i, 2] },
      { key: [i, 3] },
      { key: [i, 4] },
      { key: [i, 5] },
    ]).flat()
    const cw_raw = this.value()
    this.cw = this.unpack(cw_raw)

    this.rows = this.climates.length
    this.calc_nlines()
    const w = 0.04
    this.set_widths([0.3, w, w, w, w, w, w].map(v => v * this.rect.w))

  }
  key_b() {
    this.dispatchEvent(new CustomEvent("cancel"))
  }
  key_a() {
    const x = 1280 * 0.33
    const y = 720 * 0.33
    const w = 1280 * 0.33
    const h = 720 * 0.33

    let row = this.selected[ROW]
    let col = this.selected[COL] - 1
    const v = new ItemDialogView(this.state, new Rect(x, y, w, h), {
      items: Object.keys(Weathers),
      selected: this.cw[row][col],
      draw: (value: any) => {
        return Weathers[value]
      },
      set_value: (value: any) => {
        this.cw[row][col] = parseInt(value)
        let out = this.pack(this.cw)
        this.state.active_edits['climateWeather'] = out
        if (!this.is_modified(out)) {
          delete this.state.active_edits['climateWeather']
        }
      }
    })
    v.addEventListener('cancel', (_ev: CustomEvent) => {
      this.state.pop_view()
    });
    this.state.push_view(v)
    //this.dispatchEvent(new CustomEvent("cancel"))
  }
  key_x() {
    this.state.active_edits['climateWeather'] = this.pack(this.cw)
    this.dispatchEvent(new CustomEvent("write"))
  }
  title(): string { return "Weather" }
  commands(): any { return { X: "Write", B: "Back", A: "Select" } }

  is_modified(current: any) {
    const orig = this.value()
    for (let i = 0; i < 20; i++) {
      if (orig[i] != current[i])
        return true
    }
    return false
  }

  value() {
    const save = this.state.active_save();
    return save.get('climateWeather')
  }

  unpack(values: any) {
    let out = []
    for (const r of values) {
      let tmp = []
      for (let i = 0; i < 6; i++) {
        tmp.push((r >> (i * 4)) & 0xF)
      }
      out.push(tmp)
    }
    return out
  }

  pack(values: any) {
    let out = []
    for (const r of values) {
      let v = 0
      for (let i = 0; i < 6; i++) {
        v = v | (r[i] << (i * 4))
      }
      out.push(v)
    }
    return out
  }

  async update() {
    if (MapImage == undefined)
      MapImage = await loadImageFile(MapUrl)
    if (Regions == undefined)
      Regions = await read_json(RegionsUrl)

    let cw = this.cw

    const ctx = this.get_ctx()
    ctx.save()
    ctx.fillStyle = this.fg_color
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    this.set_font(24)

    const start = this.item_offset()

    let i = 0

    for (const item of this.items.slice(start)) {
      if (i > this.nlines * this.cols - 1)
        break
      const p = this.pos(i, start)
      if (p.row == this.selected[ROW])
        fillRect(ctx, p.x, p.y, p.w, p.h, this.current_row_color)
      if (Array.isArray(item.key)) {
        let i = item.key[0]
        let j = item.key[1]
        let r2s = 0
        if (i == 2 || i == 4 || i == 17) {
          if (cw[i][j] == 2 || cw[i][j] == 3) {
            r2s = 2
          }
        }
        let fn = Weathers[cw[i][j] + r2s]
        ctx.save()
        fn(ctx, p.x + p.w / 2, p.y + p.h / 2)
        ctx.restore()
        if (cw[i][j] == 3 || cw[i][j] == 5) {
          strokeRect(ctx, p.x, p.y, p.w, p.h, "#666666")
        }
      } else {
        ctx.fillText(item.key, p.x, p.y)
      }
      if (p.row == this.selected[ROW] && p.col == this.selected[COL]) {
        strokeRect(ctx, p.x, p.y, p.w, p.h, this.fg_color)
      }
      i += 1
    }

    // Map and Selected Climate Region
    ctx.drawImage(MapImage, 1280 - 600, 720 - 500)

    const name = this.climates_keys[this.selected[ROW]]
    ctx.fillStyle = 'rgba(255,168,0,0.5)'
    const polys = Regions[name]
    ctx.beginPath()
    for (const rings of polys) {
      for (const ring of rings) {
        for (const pts of ring) {
          for (let i = 0; i < pts.length; i++) {
            const pt = [pts[i][0], 0, pts[i][1]]
            const p = pos_to_map(pt)
            if (i == 0)
              ctx.moveTo(p[0], p[2])
            else
              ctx.lineTo(p[0], p[2])
          }
          ctx.closePath()
        }
      }

    }
    ctx.fill()

    ctx.restore()
  }
}
