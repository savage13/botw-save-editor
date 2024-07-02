
import { read_json } from './savefile'

// @ts-ignore
import LocationsUrl from './LocationMarker.json';
// @ts-ignore
import TowersUrl from './towers.json';
// @ts-ignore
import KoroksUrl from './koroks.json';
// @ts-ignore
import LocationPosUrl from './locations.json';
// @ts-ignore
import NamesUrl from './names.json'
// @ts-ignore
import AmiiboUrl from './amiibo_names.json'

function stamina_ui(save_value: number, _data: any) {
  let fifths = Math.round(save_value / 200)
  let full = Math.floor(fifths / 5);
  let part = fifths % 5;
  let out = full.toFixed(0)
  if (part)
    out += ` ${part}/5`
  return out
}
function hearts_ui(save_value: number, _data: any = {}) {
  let hearts = Math.round(save_value / 4)
  return hearts.toFixed(0)
}
export function location_ui(value: string, _data: any = {}) {
  if (value in Locations)
    return Locations[value]
  let tmp = value.replace("Location_", "")
  if (tmp in Locations)
    return Locations[tmp]
  return value
}
function korok_ui(id: string, _data: any = {}) {
  if (id in Koroks)
    return `${Koroks[id].korok_id} - ${Koroks[id].korok_type}`
  return undefined
}
export function name_ui(value: string, _data: any = {}) {
  if (value in Names)
    return Names[value]
  return value
}

function cook_effect_ui(value: number[], _data: any = {}) {
  //console.log("COOK0", value, f32_to_u32(value[0]).toString(16), f32_to_u32(value[1]).toString(16))
  if (value[0] == -1) return ""
  let stars = Array(value[1]).fill("*").join("")
  if (value[0] == 10.0) return "AttackUp" + stars
  if (value[0] == 11.0) return "DefenseUp" + stars
  if (value[0] == 12.0) return "Quietness" + stars
  if (value[0] == 13.0) return "AllSpeed" + stars
  if (value[0] == 14.0) return "GutsRecover" + " " + (value[1] / 1000).toFixed(2)
  if (value[0] == 15.0) return "ExGutsMaxUp" + " " + (value[1] / 5).toFixed(2)
  if (value[0] == 16.0) return "Fireproof" + stars
  if (value[0] == 4.0) return "ResistHot" + stars
  if (value[0] == 5.0) return "ResistIce" + stars
  if (value[0] == 6.0) return "ResistElectric" + stars
  if (value[0] == 2.0) return "LifeMaxUp"
  if (value[0] == -1) return "Hearts"
}

export function heart_ui(value: number) {
  let hearts_full = Math.floor(value / 4).toFixed(0)
  let hearts_part = value % 4
  let hpart = (hearts_part != 0) ? ` ${hearts_part}/4` : ""
  let hfull = (hearts_full != "0") ? `${hearts_full}` : ""
  return `${hfull}${hpart}`.trim()
}

export function duration_ui(value: number) {
  let minutes = Math.floor(value / 60)
  let seconds = value % 60
  let m = minutes.toFixed(0)
  let s = seconds.toFixed(0).padStart(2, '0')
  return `${m}:${s}`
}

function time_ui(value: number, _data: any = {}) {
  let minutes_per_value = 24 * 60 / 360
  let minutes_full = value * minutes_per_value; // Minutes of day
  let days = Math.floor(minutes_full / (24 * 60))
  minutes_full = minutes_full - days * 24 * 60
  let hours = Math.floor(minutes_full / 60)
  let minutes = minutes_full % 60;
  let hours_s = hours.toFixed(0).padStart(2, '0')
  let minutes_s = minutes.toFixed(0).padStart(2, '0')
  if (days > 0) {
    return `${days} d ${hours_s}:${minutes_s}`
  }
  return `${hours_s}:${minutes_s}`
}

export function float_ui(value: number, digits: number = 2, _data: any = {}) {
  return value.toFixed(digits)
}

function weapon_durability(value: number, _data: any = {}) {
  return (value / 100).toFixed(2)
}
function arrow_durability(value: number, _data: any = {}) {
  return (value).toFixed(0)
}

function modifier_ui(value: number, _data: any = {}): string {
  let out: string[] = []
  if (value & 0x1)
    out.push("AttackUp")
  if (value & 0x2)
    out.push("DurabilityUp") // Life
  if (value & 0x4)
    out.push("CriticalHit")
  if (value & 0x8)
    out.push("LongThrow")
  if (value & 0x10)
    out.push("Multishot")
  if (value & 0x20)
    out.push("Zoom")
  if (value & 0x40)
    out.push("QuickShot")
  if (value & 0x80)
    out.push("SurfMaster")
  if (value & 0x80000000)
    out.push("*")
  if (out.length > 2)
    return out.map(v => v[0]).join("")
  return out.join(" ")
}

function cook_effect1_ui(value: number[], _data: any = {}) {
  //console.log("COOK1", value)
  return `${value[0]}`
}

function stamina_recover_ui(value: number[], data: any /*item: any, save: any*/) {
  const item = data.item
  const save = data.save
  let part = item.key.split(".")[0]
  let name = save.get(part + ".name")
  let eff0 = save.get(part + ".cook_effect0")
  if (name.startsWith("Item_Roast")) {
    return "--"
  }
  //console.log("STAMINA", value)
  let hearts = heart_ui(value[0])
  if (value[1] == 0 || eff0[0] == -1)
    return `${hearts}`

  let t = duration_ui(value[1])
  return `${hearts} ${t}`

}

let Locations: any = {}
let Towers: any = {}
let Koroks: any = {}
let LocPos: any = {}
let Names: any = {}
let Amiibo: any = {}

export async function load_locations() {
  // Locations
  Locations = await read_json(LocationsUrl)
  // Towers
  let tmp = await read_json(TowersUrl)
  for (const v of tmp) {
    Towers[v.messageid] = v
  }
  // Koroks
  tmp = await read_json(KoroksUrl)
  for (const v of tmp) {
    Koroks[`MainField_${v.name}_${v.hash_id}`] = v
  }
  // Locations with xyz
  tmp = await read_json(LocationPosUrl)
  for (const v of tmp) {
    LocPos[v.messageid] = v
  }
  // Names
  Names = await read_json(NamesUrl)
  // Amiibo
  const raw = await read_json(AmiiboUrl)
  for (const key of Object.keys(raw)) {
    const k = key.slice(0, 14)
    Amiibo[k] = raw[key]
  }
}


export function tower_pos(id: string) {
  if (id in Towers)
    return Towers[id].pos
  if (id in Koroks)
    return Koroks[id].pos
  if (id in LocPos)
    return LocPos[id].pos
  const tmp = id.replace("Location_", "")
  if (tmp in LocPos)
    return LocPos[tmp].pos
  return undefined
}


export function amiibo_ui(amiibo: string[]) {
  let parts = amiibo.split('_')
  //let count = parseInt(parts[3])
  const key1 = parseInt(parts[1]).toString(16).padStart(6, '0') + '00'
  const key2 = parseInt(parts[2]).toString(16).padStart(4, '0')
  let key = '0x' + key1 + key2
  key = Amiibo[key] || key
  return key
}

export const UI: { [key: string]: any } = {

  stamina_recover_ui: stamina_recover_ui,
  stamina_ui: stamina_ui,
  hearts_ui: hearts_ui,
  location_ui: location_ui,
  korok_ui: korok_ui,
  time_ui: time_ui,
  float_ui: float_ui,
  name_ui: name_ui,
  weapon_durability: weapon_durability,
  arrow_durability: arrow_durability,
  modifier_ui: modifier_ui,
  cook_effect_ui: cook_effect_ui,
  cook_effect1_ui: cook_effect1_ui,
  amiibo_ui: amiibo_ui,
}

export function pos_to_map(pos: number[]): number[] {
  let out = Array.from(pos)
  const xmax0 = 6000
  const zmax0 = 5000
  const xmax1 = 600 / 2
  const zmax1 = 500 / 2
  const xoff = 1280 - xmax1
  const zoff = 720 - zmax1
  out[0] = (out[0] / xmax0) * xmax1 + xoff
  out[2] = (out[2] / zmax0) * zmax1 + zoff
  return out
}
