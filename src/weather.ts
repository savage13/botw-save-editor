
import { View, Rect } from './View'

import { strokeRect, fillRect, sun, rain, cloudy, snow, storm, storm2, rain2, snow2, sun2 } from './draw'
import { pos_to_map } from './formatters'
import { read_json } from './savefile'
import { ItemDialogView } from './item_display'
import { loadImageFile, clamp } from './util'

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
  3: rain2,  // Heavy Rain
  4: snow,     // Snow
  5: snow2, // HeavySnow
  6: storm,    // ThunderStorm
  7: storm2, // ThunderRain
  8: sun2,   // BlueSkyRain
}

const WeatherNames = [
  "Sun", "Cloudy", "Rain", "Heavy Rain",
  "Snow", "Heavy Snown", "Thunder No Rain", "Thunder and Rain",
  "Blue Sky Rain"
]

const ROW = 0
const COL = 1

export class WeatherView extends View {

  climates_keys: string[];
  climates: string[];
  items: any[];
  day: number;
  cw: any[];

  constructor(state: any, rect: Rect, data: any) {
    super(state, rect, data)
    const padding = 20
    this.rect.x += padding
    this.rect.y += padding
    this.rect.w -= 2 * padding
    this.rect.h -= 2 * padding
    this.cols = 7
    this.day = 0
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
    this.load_image()
  }

  async load_image() {
    if (MapImage == undefined)
      MapImage = await loadImageFile(MapUrl)
    if (Regions == undefined)
      Regions = await read_json(RegionsUrl)
  }

  key_r() {
    if (this.selected[COL] == 0)
      return
    let row = this.selected[ROW]
    let col = this.selected[COL] - 1
    let day = this.day

    const value = this.cw[day][row][col]
    for (let i = col; i < 6; i++) {
      this.cw[day][row][i] = value
    }
    this.store_weather_edits(this.cw)
  }

  store_weather_edits(unpacked_values: any) {
    let out = this.pack(unpacked_values)
    this.state.active_edits['climateWeather'] = out[0]
    this.state.active_edits['climateWeather2'] = out[1]
    this.state.active_edits['climateWeather3'] = out[2]
    if (!this.is_modified(out)) {
      this.clear_weather_edits()
    }
  }

  clear_weather_edits() {
    delete this.state.active_edits['climateWeather']
    delete this.state.active_edits['climateWeather2']
    delete this.state.active_edits['climateWeather3']
  }

  value() {
    const save = this.state.active_save();
    return [
      save.get('climateWeather'),
      save.get('climateWeather2'),
      save.get('climateWeather3')
    ]
  }

  key_b() {
    this.dispatchEvent(new CustomEvent("cancel"))
  }
  key_y() {
    this.clear_weather_edits()
    this.cw = this.unpack(this.value())
  }
  key_a() {
    if (this.selected[COL] == 0)
      return

    const x = 1280 * 0.33
    const y = 720 * 0.33
    const w = 1280 * 0.33
    const h = 720 * 0.33

    let day = this.day
    let row = this.selected[ROW]
    let col = this.selected[COL] - 1
    const v = new ItemDialogView(this.state, new Rect(x, y, w, h), {
      items: Object.keys(Weathers),
      selected: this.cw[day][row][col],
      draw: (value: any) => {
        return Weathers[value]
      },
      set_value: (value: any) => {
        this.cw[day][row][col] = parseInt(value)
        this.store_weather_edits(this.cw)
      }
    })
    v.addEventListener('cancel', (_ev: CustomEvent) => {
      this.state.pop_view()
    });
    this.state.push_view(v)
    //this.dispatchEvent(new CustomEvent("cancel"))
  }
  key_x() {
    this.dispatchEvent(new CustomEvent("write"))
  }
  key_zl() {
    this.day = clamp(this.day - 1, 0, 2)
  }
  key_zr() {
    this.day = clamp(this.day + 1, 0, 2)
  }
  title(): string { return "Weather" }
  commands(): any {
    return { X: "Write", B: "Back", A: "Select", R: "Right Fill", Y: 'Revert', ZR: '+1Day', ZL: '-1Day', }
  }

  is_modified(current: any) {
    // Works on the packed values
    const orig = this.value()
    for (let d = 0; d < 3; d++) {
      for (let i = 0; i < 20; i++) {
        if (orig[d][i] != current[d][i])
          return true
      }
    }
    return false
  }


  unpack(values: any) {
    let days = []
    for (let d = 0; d < 3; d++) {
      let out = []
      for (const r of values[d]) {
        let tmp = []
        for (let i = 0; i < 6; i++) {
          tmp.push((r >> (i * 4)) & 0xF)
        }
        out.push(tmp)
      }
      days.push(out)
    }
    return days
  }

  pack(values: any) {
    let days = []
    for (let d = 0; d < 3; d++) {
      let out = []
      for (const r of values[d]) {
        let v = 0
        for (let i = 0; i < 6; i++) {
          v = v | (r[i] << (i * 4))
        }
        out.push(v)
      }
      days.push(out)
    }
    return days
  }

  update() {

    let cw = this.cw[this.day]

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
      } else {
        ctx.fillText(item.key, p.x, p.y + 4)
      }
      if (p.row == this.selected[ROW] && p.col == this.selected[COL]) {
        strokeRect(ctx, p.x, p.y, p.w, p.h, this.fg_color)
      }
      i += 1
    }

    // Map and Selected Climate Region
    if (MapImage)
      ctx.drawImage(MapImage, 1280 - 600, 720 - 500)

    const name = this.climates_keys[this.selected[ROW]]
    ctx.fillStyle = 'rgba(255,168,0,0.5)'
    if (Regions) {
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
    }

    const x = 1280 - 600 + 100
    let y = this.rect.y + 20
    i = 0
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (let fn of Object.values(Weathers)) {
      let dx = (i % 2) * 250
      let dy = Math.floor(i / 2) * this.line_height * 1.1
      fn(ctx, x + dx, y + dy)
      ctx.fillText(WeatherNames[i], x + dx + 20, y + dy)
      i += 1
    }

    this.set_font(32)
    ctx.fillStyle = this.fg_color;
    ctx.fillText(`Day ${this.day + 1} / 3`, 550, 680)

    ctx.restore()
  }
}
