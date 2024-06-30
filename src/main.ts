
import { HidNpadButton } from '@nx.js/constants';

import { Savefile, load_types, read_json } from './savefile';
export { Savefile } from './savefile';

import { View, Rect } from './View'
import { InventoryView } from './InventoryView'
import { AccountView } from './accounts'
import { CaptionView } from './captions'
import { CategoryView } from './category'
import { DetailsView } from './details'
import { DemosView } from './demos_view'
import { WeatherView } from './weather'
import { Message } from './message'
import { load_locations } from './formatters'
import { clamp, loadImage } from './util'
import { star } from './draw'

// @ts-ignore
import Details from './details.json';
// @ts-ignore
import HypersUrl from './hypers.jpg'

let FONT = "system-ui"
const SLEEP = false;

let ON_SWITCH = true;
try {
  let _v = Switch;
} catch (e) {
  ON_SWITCH = false;
}

if (!ON_SWITCH) {
  FONT = "Helvetica";
}

const CaptionKeys = {
  'IsLogicalDelete': 0,
  'GameClear': 0,
  'IsChangedByDebug': 0,
  'CaptionPictSize': 0,
  'SeakSensorPictureIndex': 0,
  'AlbumPictureIndex': 0,
  'IsSaveByAuto': 0,
  'IsGet_Obj_AmiiboItem': 0,
  'AoC_HardMode_Enabled': 0,
  'LastSaveTime_Lower': 0,
  'FamouseValue': 0,
  'LastSaveTime_Upper': 0,
  'SaveLocationName': 0,
  'SaveDistrictName': 0,
}

// Create Map
//let MapImage = new Image()
//MapImage.src = MapUrl

// Cook Effect 0  [0] - EffectType
// Cook Effect 0  [1] - EffectLevel
// Cook Effect 1  [0] - SellingPrice
// Cook Effect 1  [1] - ???
// StaminaRecover [0] - HitPointRecover
// StaminaRecover [1] - EffectTime


const BOTW = "The Legend of Zelda: Breath of the Wild"

let FsSaveDataType = {
  System: 0,
  Account: 1,
  Bcat: 2,
  Device: 3,
  Temporary: 4,
  Cache: 5,
  SystemBcat: 6
};
const FsSaveDataType_i = ['System', 'Account', 'Bcat', 'Device', 'Temporary', 'Cache', 'SystemBcat']

//const s = new Savefile();
const DEF_DELAY = 1000;
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

async function read_file(filename: string): Promise<any> {
  if (ON_SWITCH) {
    return Switch.readFileSync(filename)
  } else {
    const res = await fetch(filename);
    return await res.arrayBuffer();
  }
}

async function read_caption(slot: any): Promise<any> {
  let caption_file = slot.files.find((file: string) => file.endsWith("caption.sav"))
  let caption = new Savefile();

  let buf = await read_file(caption_file)

  caption.read(buf)
  return caption
}

async function read_caption_plus(save: any): Promise<any> {
  //console.log("READ CAPTION PLUS", save.name)
  save.caption = await read_caption(save)
  save.location = save.caption.get('SaveLocationName')
  save.is_auto_save = save.caption.get('IsSaveByAuto')
  save.is_clear = save.caption.get('GameClear')
  save.district = save.caption.get('SaveDistrictName')
  save.hard = save.caption.get('AoC_HardMode_Enabled')
  //console.log("FILES", save.files)
  const img_file = save.files.find((file: string) => file.endsWith("caption.jpg"))
  //console.log("IMG FILE", img_file)
  save.pouch_item = (key: string) => {
    let v = key.split(".")
    let kind = v[1]
    let index = parseInt(v[0].split("[")[1].replace("]", ""))
    //console.log("GET", index, kind, save.pouch_items[index])
    return save.pouch_items[index][kind]
  }
  save.pouch_item_type = (key: string) => {
    const vals: any = {
      name: "string",
      value: "s32",
      equip: "bool",
      flag: "s32",
      flag_sp: "s32",
      value_sp: "s32",
      cook_effect0: "vector2f_array",
      cook_effect1: "vector2f_array",
    }
    let v = key.split(".")
    let kind = v[1]
    return vals[kind]
  }
  save.get = (key: string) => {
    if (key.startsWith("PouchItem")) {
      if (!save.pouch_items)
        return undefined
      return save.pouch_item(key)
    }
    if (key in CaptionKeys) {
      if (!save.caption)
        return undefined
      return save.caption.get(key)
    }
    if (!save.data)
      return undefined
    return save.data.get(key)
  }
  save.type = (key: string) => {
    if (key.startsWith("PouchItem")) {
      if (!save.pouch_items)
        return undefined
      return save.pouch_item_type(key)
    }
    if (key in CaptionKeys) {
      if (!save.caption)
        return undefined
      return save.caption.type(key)
    }
    if (!save.data)
      return undefined
    return save.data.type(key)
  }
  const img_data = await read_file(img_file)
  let imgsrc = URL.createObjectURL(new Blob([img_data], { type: 'image/jpeg' }));
  save.screenshot = await loadImage(imgsrc)
  //if (!ON_SWITCH && SLEEP)
  //  await sleep(100)
  //console.log("READ CAPTION PLUS DONE", save.name)
}

async function read_game_data(slot: any): Promise<any> {
  //console.log("READ PROGRESS", slot.name)
  let game_data = new Savefile()
  let game_data_file = slot.files.find((file: string) => file.endsWith("game_data.sav"))
  let buf = await read_file(game_data_file)
  if (buf === undefined)
    console.error("Error reading in " + game_data_file)
  game_data.read(buf)
  //if (!ON_SWITCH && SLEEP)
  //  await sleep(3000)

  return game_data;
}


async function load_save_file_data_fetch() {
  const names = [0, 1, 2, 3, 4, 5, 6, 7];
  let slots: any = []
  //console.log("NAMES", names)
  for (const name of names) {
    const res = await fetch(`save_data/${name}/caption.sav`);
    if (!res.ok)
      continue
    const res2 = await fetch(`save_data/${name}/game_data.sav`);

    let path = `save_data/${name}`;
    let files = [
      `save_data/${name}/game_data.sav`,
      `save_data/${name}/caption.sav`,
      `save_data/${name}/caption.jpg`
    ];
    slots.push({
      name, path, files, caption: undefined, data: undefined, save_data: {
        mount: () => { },
        unmount: () => { },
      }
    })
  }
  return slots;
}

function uid_equal(a: any, b: any) {
  return a[0] == b[0] && a[1] == b[1]
}

async function load_save_file_data_filter(game_name: string, nickname: string): Promise<any> {
  if (!ON_SWITCH) {
    return load_save_file_data_fetch();
  }
  let game = Array.from(Switch.Application).find(x => x.name == game_name);
  let profile = Array.from(Switch.Profile).find(x => x.nickname == nickname);
  if (!game) {
    console.error("game or profile empty", game, profile);
    return undefined
  }
  if (!profile) {
    console.error("game or profile empty", game, profile);
    return undefined
  }
  let save_data = Array.from(Switch.SaveData).find((x: any) => game &&
    x.applicationId == game.id
    && x.type == FsSaveDataType.Account
    && profile && uid_equal(x.uid, profile.uid));

  if (!save_data) {
    console.error("save data empty", save_data, game.id, profile.uid);
    return undefined;
  }

  // Mount save data
  let m = save_data.mount()

  //console.log("MOUNT", m)
  // See all files in directory (for totk, this is the slots directory)
  let raw_data: any = []
  //console.error('HREF', m.href)
  let dirs = Switch.readDirSync(m.href);
  if (!dirs)
    return raw_data
  //console.error('DIRS', dirs)
  for (const dir of dirs) {
    const path = [m.href, dir].join("/")
    let stats = Switch.statSync(path);
    //console.log(path, stats.mode)

    let files = Switch.readDirSync([m.href, dir].join("/"))
    //console.error("FILES", files);
    if (!files || files === undefined)
      continue
    if (files.some(file => file == "game_data.sav") && files.some(file => file == "caption.sav")) {
      files = files.map(file => [m.href, dir, file].join("/"));
      //let caption = new SaveFile()
      //caption.read(Switch.readFileSync([path, "progress.sav"].join("/")))
      //console.error('appending', path)
      raw_data.push({ name: dir, path, files, caption: undefined, data: undefined, save_data })
    }
  }
  //save_data.unmount()
  //console.log("RAW DATA", raw_data);
  return raw_data
}

// Profile Data
async function base64ToFile(dataURL: any) {
  //const arr = dataURL.split(',');
  //const mime = arr[0].match(/:(.*?);/)[1];
  return (fetch(dataURL)
    .then(function(result) {
      return result.arrayBuffer();
    }));
}
async function load_profile_data_shim() {
  //let image = await base64ToFile(HypersUrl);
  const res = await fetch('romfs/' + HypersUrl)
  const image = await res.arrayBuffer()

  return [
    {
      uid: [BigInt("1153613836778681025"), BigInt("14010567367292562331")],
      nickname: "savage",
      image,
      Image: undefined,
    },
    {
      uid: [BigInt("1153613836778681025"), BigInt("14010567367292562331")],
      nickname: "savage2",
      image,
      Image: undefined,
    },
    {
      uid: [BigInt("1153613836778681025"), BigInt("14010567367292562331")],
      nickname: "savage2",
      image,
      Image: undefined,
    },
  ]
}
async function load_profile_data() {
  if (ON_SWITCH)
    return Array.from(Switch.Profile);
  return await load_profile_data_shim();
}

class AsyncLock {
  disable: any;
  promise: any;
  constructor() {
    this.disable = () => { }
    this.promise = Promise.resolve()
  }
  enable() {
    //console.log('LOCK ENABLE')
    this.promise = new Promise(resolve => this.disable = resolve)
  }
}



const mapping: any = {
  'ArrowLeft': HidNpadButton.StickRLeft,
  'ArrowRight': HidNpadButton.StickRRight,
  'ArrowUp': HidNpadButton.StickRUp,
  'ArrowDown': HidNpadButton.StickRDown,
  'ArrowUpShift': HidNpadButton.Up,
  'ArrowDownShift': HidNpadButton.Down,
  'KeyA': HidNpadButton.A,
  'KeyB': HidNpadButton.B,
  'KeyX': HidNpadButton.X,
  'KeyY': HidNpadButton.Y,
  'Minus': HidNpadButton.Minus | HidNpadButton.ZL,
  'Equal': HidNpadButton.Plus | HidNpadButton.ZL,
  'Alt': HidNpadButton.ZL,
  'KeyL': HidNpadButton.L,
  'KeyR': HidNpadButton.R,
}
const HidNpadButton_AnyDir =
  HidNpadButton.AnyLeft |
  HidNpadButton.AnyRight |
  HidNpadButton.AnyUp |
  HidNpadButton.AnyDown






const lock = new AsyncLock()

class State {
  ctx_raw: any;
  ctx: any;
  off_screen: any;
  canvas: any
  bg_color: string;
  fg_color: string;
  view: number;
  cols: any;
  index: any;
  lock: AsyncLock;

  views: View[];

  ACCT: number;
  FILE: number;
  CATS: number;
  DETS: number;

  profiles: any;
  saves: any;
  details: any;
  //saves_read_attemtps: number;
  current_nickname: string;
  current_save_index: number;
  editing: boolean;
  active_edits: any;
  active_edit_key: string;
  active_edit_type: string;
  categories: any;

  vkey: any;

  constructor() {
    this.lock = new AsyncLock()
    this.ACCT = 0
    this.FILE = 1
    this.CATS = 2
    this.DETS = 3
    this.view = 0
    this.index = [0, 0, 0, 0];
    this.cols = [4, 4, 4, 4];

    this.views = []

    this.profiles = [];
    this.saves = [];
    //this.saves_read_attempts = 0

    this.details = read_json(Details)

    this.categories = []

    this.current_nickname = "";
    this.current_save_index = -1;
    this.editing = false;
    this.active_edit_key = ""
    this.active_edit_type = ""
    this.active_edits = {};

    if (ON_SWITCH) {
      this.ctx_raw = screen.getContext('2d')
    } else {
      // @ts-ignore
      this.canvas = document.getElementById("canvas")
      this.ctx_raw = this.canvas.getContext('2d')
    }

    this.off_screen = new OffscreenCanvas(this.ctx_raw.canvas.width, this.ctx_raw.canvas.height)
    this.ctx = this.off_screen.getContext('2d')
    this.bg_color = "#000000"
    this.fg_color = "#d4edfc"
    this.setup_keys()
    this.clear()
    let font_size = 48;
    let line_height = font_size * 1.2;
    this.ctx.font = `${font_size}px ${FONT}`
    this.ctx.fillStyle = this.fg_color;
    this.blit()
  }
  set_profiles(profiles: any) {
    this.profiles = profiles;
  }
  clear() {
    // Clear full window
    this.ctx.fillStyle = this.bg_color;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    this.ctx.fillStyle = this.fg_color;
    this.ctx.font = `28px ${FONT}`
    this.ctx.translate(10, 720 - 20);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("BotW Save Editor", 0, 0);
    this.ctx.restore();
  }

  key(value: string, code: any) {
    if (!this.editing)
      return
    if (code == "Backspace") {
      this.active_edits[this.active_edit_key] = this.active_edits[this.active_edit_key].slice(0, -1)
    } else {
      this.active_edits[this.active_edit_key] += value;
    }
    //console.log("VALUE", this.active_edits[this.active_edit_key])
  }

  key_up(max: number = -1, step: number = 1) {
    const k = this.view;
    if (max < 0) {
      this.index[k] -= step;
      return
    }
    let N = this.cols[k] // Columns
    if (this.index[k] - N >= 0)
      this.index[k] = clamp(this.index[k] - N, 0, max - 1);
  }
  key_down(max: number = -1, step: number = 1) {
    const k = this.view;
    if (max < 0) {
      this.index[k] += step;
      return
    }
    let N = this.cols[k] // Columns
    if (this.index[k] + N <= max - 1)
      this.index[k] = clamp(this.index[k] + N, 0, max - 1);
  }
  key_left(max: number) {
    let k = this.view;
    if (max < 0) {
      this.index[k] -= 1
      return
    }
    this.index[k] = clamp(this.index[k] - 1, 0, max - 1);
  }
  key_right(max: number) {
    let k = this.view;
    if (max < 0) {
      this.index[k] += 1
      return
    }
    this.index[k] = clamp(this.index[k] + 1, 0, max - 1);
  }
  key_b(max: number) {
    let k = this.view;
    if (k == this.DETS)
      this.index[k] = 0
    this.view = clamp(this.view - 1, 0, 3);
  }
  key_x(max: number) {
    if (this.view != this.DETS)
      return
    this.write_active_edits();
  }
  key_y(max: number) {
    if (this.view != this.DETS)
      return
  }

  pop_view() {
    this.views.pop()
    this.update()
  }

  push_view(view: View) {
    this.views.push(view)
    this.update()
  }

  key_a(max: number) {
    if (this.view == this.DETS) {
      this.editing_on()
      return
    }
    this.view = clamp(this.view + 1, 0, 3);
    if (this.view == 3 && this.categories[this.index[this.CATS]] == "Pouch Items") {
      const save = this.active_save()
      this.push_view(new InventoryView(this, new Rect(20, 40, 1280 - 40, 720 - 50), {
        save, items: this.details["Pouch Items"]
      }))
    }
    if (this.view == 3 && this.categories[this.index[this.CATS]] == "Demos") {
      const save = this.active_save()
      this.push_view(new DemosView(this, new Rect(20, 40, 1280 - 40, 720 - 50), {
        save,
        items: this.details["Demos"],
        set_value: (key: string, value: boolean) => {
          this.active_edits[key] = value
        },
        get_value: (key: string): any => {
          if (key in this.active_edits)
            return this.active_edits[key]
          return this.active_save().get(key)
        }
      }))
    }
  }
  editing_on() {
    this.editing = true;
    this.active_edit_type = this.active_detail_type()
    if (this.active_edit_type == undefined) {
      //console.log("editing type is", this.active_edit_type)
      this.editing = false;
      return
    }
    this.active_edit_key = this.active_detail_key()
    if (!(this.active_edit_key in this.active_edits))
      this.active_edits[this.active_edit_key] = this.active_detail_value()
    //console.log("EDIT ON", this.active_edit_key, this.active_edit_type)
    //navigator.virtualKeyboard.show();
  }
  editing_off() {
    this.editing = false
    const value = this.active_detail_value()
    if (value == this.active_edits[this.active_edit_key])
      delete this.active_edits[this.active_edit_key]

    this.active_edit_key = ""
    //console.log("EDIT OFF", this.active_edit_key, this.active_edit_type)
    //navigator.virtualKeyboard.hide();
  }
  active_detail() {
    let name = this.categories[this.index[this.CATS]];
    let items = this.details[name];
    return items[this.index[this.DETS]]
  }
  active_detail_step() {
    return this.active_detail().step
  }
  active_detail_bigstep() {
    return this.active_detail().bigstep
  }
  active_detail_min() {
    return this.active_detail().min
  }
  active_detail_max() {
    return this.active_detail().max
  }
  active_detail_key() {
    return this.active_detail().key
  }
  active_detail_file() {
    return this.active_detail().file
  }
  active_detail_value() {
    const save = this.active_save();
    const key = this.active_detail_key()
    return save.get(key)
  }

  active_detail_type() {
    const save = this.active_save();
    const key = this.active_detail_key()
    return save.type(key)
  }

  active_save(): any {
    if (this.current_save_index < 0 || this.current_save_index >= this.saves.length)
      return undefined
    return this.saves[this.current_save_index];
  }
  write_active_edits() {

    this.push_view(new Message(this, Rect.percent(0.33, 0.33, 0.33, 0.33), {
      msg: "Write savefile?", title: "", ok_cancel: true,
      on_confirm: () => {
        this.views.pop()
        this.write_active_edits_internal()
      },
      on_cancel: () => {
        this.views.pop()
      }
    }))
  }
  write_active_edits_internal() {

    const save = this.active_save();

    let top_view = new Message(this, Rect.percent(0.33, 0.33, 0.33, 0.33), {
      msg: "Storing backing ...", on_update: () => { this.update() }
    })
    this.push_view(top_view)
    this.update();

    // Create backup in case we mess up
    save.data.backup()
    save.caption.backup()

    let error = undefined

    top_view.set_msg("Setting Pouch Items ...")

    if (!save.data.set_pouch_items(save.pouch_items)) {
      error = "Error writing pouch items"
    }
    for (const [key, value] of Object.entries(this.active_edits)) {
      if (error)
        break
      if (key.startsWith("PouchItem"))
        continue

      top_view.set_msg(`Setting ${key} ...`)

      if (key in CaptionKeys) {
        if (!save.caption.set(key, value))
          error = `Error wriring ${key} in caption`
      } else {
        if (!save.data.set(key, value))
          error = `Error wriring ${key} in data`
      }
    }
    if (error) {
      top_view.data.msg = error
      this.update()
      save.data.restore();
      save.caption.restore();
      setTimeout(() => {
        this.pop_view()
      }, 2000)

      return
    }
    top_view.set_msg(`Writing data ...`)

    write_save_file(save, this);

    top_view.set_msg(`Writing data: Complete :D`)
    this.active_edits = {}
    setTimeout(() => {
      this.pop_view()
    }, 1000)

  }



  async load_caption_data(nickname: string) {
    //console.log("CAPTION DATA");
    await new Promise(async (resolve, _reject) => {
      //console.log("CAPTION DATA LOAD");
      const new_saves = await load_save_file_data_filter(BOTW, nickname);
      for (const save of new_saves) {
        await read_caption_plus(save);
      }
      let normal = new_saves.filter((s: any) => !s.hard)
      let hard = new_saves.filter((s: any) => s.hard)
      this.saves.splice(0, this.saves.length, ...normal)
      this.saves.push(...hard)
      this.update();
      resolve(true)
    }).then(async () => {
      this.update();
    });
  }

  async show_captions(profile: any) {
    const nickname = profile.nickname
    const cv = new CaptionView(this, new Rect(40, 40, 1280 - 40, 720 - 50), {
      saves: this.saves
    })
    cv.addEventListener('cancel', (_ev: CustomEvent) => {
      this.pop_view()
    })
    cv.addEventListener('click', (ev: CustomEvent) => {
      this.show_categories(ev.detail)
    })
    this.push_view(cv)
    if (nickname != this.current_nickname) {
      this.current_nickname = nickname
      this.current_save_index = -1
      this.active_edits = {}
      await this.load_caption_data(this.current_nickname)
    }
  }


  update_pouch_items(save: any) {
    // Read Pouch Items from savefile in memory
    save.pouch_items = save.data.pouch_items()
    this.update_pouch_items_details(save)
  }

  update_pouch_items_details(save: any) {
    let ptype = ""

    this.details["Pouch Items"] = []
    this.details["Pouch Items"] = save.pouch_items.map((v: any, i: number) => {
      //console.log(v)
      const val_ui_vals: { [key: string]: string } = {
        "Weapon": "weapon_durability",
        "Bow": "weapon_durability",
        "Arrow": "arrow_durability",
        "Shield": "weapon_durability",
      }
      let val_ui = val_ui_vals[v.ptype]
      const min_vals: { [key: string]: number } = {
        "Weapon": 0, "Bow": 0, "Arrow": 0, "Shield": 0, "Armor": 0,
        "Food": 0, "Material": 0, "KeyItem": 0,
      }
      let min = min_vals[v.ptype]
      const max_vals: { [key: string]: number } = {
        "Weapon": 100000, "Bow": 100000, "Arrow": 100000,
        "Shield": 100000, "Armor": 0,
        "Food": 999, "Material": 999, "KeyItem": 1,
      }
      let max = max_vals[v.ptype]
      const step_vals: { [key: string]: number } = {
        "Weapon": 1, "Bow": 1, "Arrow": 1,
        "Shield": 1, "Armor": 0,
        "Food": 1, "Material": 1, "KeyItem": 1,
      }
      let step = step_vals[v.ptype]
      const bigstep_vals: { [key: string]: number } = {
        "Weapon": 100, "Bow": 100, "Arrow": 20,
        "Shield": 100, "Armor": 0,
        "Food": 20, "Material": 20, "KeyItem": 20,
      }
      let bigstep = bigstep_vals[v.ptype]
      if (v.ptype == "KeyItem" && v._name == "Obj_KorokNuts")
        max = 900
      if (v.ptype == "KeyItem" && v._name == "Obj_DungeonClearSeal")
        max = 300
      let flag_sp = "flag_sp"
      let value_sp = "value_sp"
      let flag_func = "modifier_ui"
      let equip = "equip"
      let equip_func = undefined
      let value_func = undefined
      if (v.ptype == "Food") {
        equip = "cook_effect0" // EffectType + Effect Level
        equip_func = "cook_effect_ui"

        flag_sp = "stamina_recover"
        flag_func = "stamina_recover_ui"

        value_sp = "cook_effect1" // Selling Price
        value_func = "cook_effect1_ui"
        //console.log(name_ui(v._name), cook_effect_ui(v.cook_effect0),
        //  cook_effect1_ui(v.cook_effect1), v.stamina_recover, v)
      }
      let out = []
      if (ptype != v.ptype) {
        let header: any = {
          Weapon: ["Weapon", "Equip", "Durability", "Modifier", "Value"],
          Bow: ["Bow", "Equip", "Durability", "Modifier", "Value"],
          Arrow: ["Arrow", "Equip", "Count", "", ""],
          Shield: ["Shield", "Equip", "Durability", "Modifier", "Value"],
          Armor: ["Armor", "Equip", "", "", ""],
          Material: ["Material", "", "Count", "", ""],
          Food: ["Food", "Modifier", "Count", "Heart/Time", "Price"],
          KeyItem: ["KeyItem", "Equip", "Count", "", ""],
        }
        let values = header[v.ptype];
        values = values.map((v: any) => { return { key: v, name: "", header: true } })
        out.push(...values)
        ptype = v.ptype
      }
      let value_sp_skip = ["Arrow", "Material", "KeyItem", "Armor"].includes(v.ptype)
      let value_skip = ["Armor"].includes(v.ptype)
      let equip_skip = ["Material"].includes(v.ptype)
      let flag_sp_skip = ["Arrow", "Armor", "Material", "KeyItem"].includes(v.ptype)

      out.push(...[
        { key: `PouchItem[${i}].name`, name: `Item #${i + 1}`, "ui": "name_ui" },
        { key: `PouchItem[${i}].${equip}`, name: `Equipped`, "ui": equip_func, skip: equip_skip },
        {
          key: `PouchItem[${i}].value`, name: `Value`, "ui":
            val_ui, min, max, step, bigstep, skip: value_skip
        },
        {
          key: `PouchItem[${i}].${flag_sp}`, name: `Flag`, "ui": flag_func,
          skip: flag_sp_skip
        },
        {
          key: `PouchItem[${i}].${value_sp}`, name: `Value`, "ui": value_func,
          min: 0, max: 10000, step: 1, bigstep: 1000,
          skip: value_sp_skip,
        },
      ])
      return out
    }).flat();
  }

  show_weather_items() {
    const save = this.active_save()
    const v = new WeatherView(this, new Rect(20, 40, 1280 - 40, 720 - 50), {
      save, items: this.details["Weather"]
    })
    v.addEventListener('cancel', () => { this.pop_view() })
    //v.addEventListener('revert', () => { this.update_pouch_items(this.active_save()) })
    v.addEventListener('write', () => { this.write_active_edits() })
    this.push_view(v)
  }

  show_pouch_items() {
    const v = new InventoryView(this, new Rect(20, 40, 1280 - 40, 720 - 50), {
      save: this.active_save(), items: this.details["Pouch Items"]
    })
    v.addEventListener('cancel', () => { this.pop_view() })
    v.addEventListener('revert', () => { this.update_pouch_items(this.active_save()) })
    v.addEventListener('write', () => { this.write_active_edits() })
    this.push_view(v)
  }

  show_detail(index: number) {
    let cat = this.categories[index]
    if (cat == "Pouch Items")
      return this.show_pouch_items()
    if (cat == "Weather")
      return this.show_weather_items()
    const dv = new DetailsView(this, new Rect(40, 40, 1280 - 40, 720 - 50), {
      save: this.active_save(), items: this.details[cat], title: cat
    })
    dv.addEventListener('cancel', (_ev: CustomEvent) => {
      this.pop_view()
    })
    dv.addEventListener('write', (_ev: CustomEvent) => {
      this.write_active_edits()
    })
    dv.addEventListener('change', (ev: CustomEvent) => {
      const key = ev.detail.key
      const value = ev.detail.value
      let value_orig = this.active_save().get(key)
      this.active_edits[key] = value
      if (value_orig == value)
        delete this.active_edits[key]
    })
    this.push_view(dv)

  }

  async show_categories(save_index: number) {
    if (this.details instanceof Promise) {
      // Resolve Categories Data Promise (this.details; held in details.json)
      this.details = await this.details
      this.categories = Object.keys(this.details);
    }

    const save = this.saves[save_index];

    if (this.current_save_index != save_index) {
      this.current_save_index = save_index
      this.active_edits = {}
      if (save.data) {
        this.update_pouch_items(save)
      }
    }
    const cv = new CategoryView(this, new Rect(40, 40, 1280 - 40, 720 - 50), {
      items: this.categories, save
    })
    cv.addEventListener('cancel', (_ev: CustomEvent) => {
      this.pop_view()
    })
    cv.addEventListener('click', (ev: CustomEvent) => {
      this.show_detail(ev.detail)
    })
    this.push_view(cv)

    if (!save.data) {
      save.status = "Game data requested to read"
      setTimeout(() => { this.update() }, 1)

      await new Promise(async (resolve, reject) => {
        save.status = "Game data reading ..."
        setTimeout(() => { this.update() }, 1)

        let game_data = new Savefile()
        let game_data_file = save.files.find((file: string) => file.endsWith("game_data.sav"))
        save.status = "Reading game data ..."
        let buf = await read_file(game_data_file)
        if (!ON_SWITCH && SLEEP)
          await sleep(2000)
        if (buf === undefined || buf === null) {
          return reject(`Error reading in ${save.name} ${save.path}`)
        }
        save.status = "Parsing game data ..."
        const ret = game_data.read(buf)
        if (!ret.status)
          return reject(ret.msg)
        //if (!ON_SWITCH && SLEEP)
        //  await sleep(2000)

        save.data = game_data
        //save.data = await read_game_data(save);

        save.status = "Game data read inventory"
        setTimeout(() => { this.update() }, 1)
        this.update_pouch_items(save)
        save.status = "Game data inventory read"
        resolve(1);
      }).then(() => {
        save.status = ""
        this.update();
      }).catch(error => {
        //console.error(error)
        save.status = error.toString()
        this.update()
      })
    }
  }


  async update_practice_saves(items: any) {
    let y = 60
    this.clear()
    this.ctx.font = `24px ${FONT}`
    this.ctx.fillStyle = this.fg_color;
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'bottom';

    for (const item of items) {
      if (!item.data) {
        const res = await fetch(item.url)
        item.data = await res.json()
      }
      for (const [key, val] of Object.entries(item.data.saves)) {
        this.ctx.fillText(`${key}: ${val}`, 50, y)
        y += 24 * 1.25
      }
    }
  }

  async update(detail: any = "_REDRAW_") {

    await this.lock.promise
    this.lock.enable()

    let n = 0;
    if (this.view == this.ACCT)
      n = this.profiles.length;
    if (this.view == this.FILE)
      n = this.saves.length;
    if (this.view == this.CATS)
      n = this.categories.length;
    if (this.view == this.DETS) {
      n = -1
    }

    //console.log("UPDATE", detail, this.editing)
    if (detail == '_REDRAW_')
      true
    if (this.views.length) {
      const top_view = this.views.at(-1)
      if (top_view) {
        top_view.key(detail)
      }
    }

    if (this.views.length) {
      let top_view = this.views.at(-1)
      if (top_view) {
        if (top_view.clear_all())
          this.clear()
        let modified = Object.keys(this.active_edits).length
        let comms = top_view.commands()
        this.ctx.save()
        this.ctx.fillStyle = this.bg_color
        this.ctx.fillRect(200, 0, 1280 - 20, 40)
        this.ctx.fillStyle = this.fg_color
        this.ctx.font = `24px ${FONT}`
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "top";
        let k = 0;
        for (const [key, val] of Object.entries(comms)) {
          this.ctx.fillText(`${key} ${val}`, 1250 - k * 150, 10)
          k += 1
        }
        this.ctx.restore()

        let title = top_view.title()
        this.ctx.save()
        this.ctx.fillStyle = this.fg_color
        this.ctx.font = `36px ${FONT}`
        this.ctx.textAlign = "left"
        this.ctx.textBaseline = "top"
        this.ctx.fillText(title, 40, 10)
        this.ctx.restore()

        if (modified)
          star(this.ctx, 20, 25, this.fg_color)

        await top_view.update()
        this.blit()
      }
      //} else if (this.view == this.ACCT) {
      //  this.update_accounts();
      //  this.blit();
      //} else if (this.view == this.FILE) {
      //  this.update_captions();
      //  this.blit();
      //} else if (this.view == this.CATS) {
      //await this.update_categories();
      //this.blit();
      //} else if (this.view == this.DETS) {
      //await this.update_details();
      //this.blit();
    }
    this.lock.disable()
  }
  blit() {
    this.ctx_raw.drawImage(this.off_screen, 0, 0);
  }
  message(msg: string) {
    this.ctx.save()
    this.ctx.font = `24px ${FONT}`
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillStyle = this.bg_color
    this.ctx.rect(40, 720 - 30, 720, 30)
    this.ctx.fill()
    this.ctx.fillStyle = this.fg_color
    this.ctx.strokeStyle = this.fg_color
    //this.ctx.rect(1280 * , 720 * 0.4, 1280 * 0.33, 720 * 0.2)
    //this.ctx.stroke()
    this.ctx.fillText(msg, 50, 720 - 35)
    this.ctx.restore()
    //console.log("message", msg)
    this.blit()
  }

  setup_keys() {
    if (ON_SWITCH) {
      const self = this;
      let BUTTON: HidNpadButton;
      let INTERVAL_ID: ReturnType<typeof setInterval>;
      let FACTOR = 0.632120 // 1 - 1/exp(1)
      function repeat_button_event(detail: number, interval_ms = 400) {
        if (!BUTTON || BUTTON !== detail)
          return
        self.update(detail)
        interval_ms = Math.max(30, interval_ms * FACTOR)
        setTimeout(() => { repeat_button_event(detail, interval_ms) }, interval_ms);
      }
      addEventListener('buttondown', (event: any) => {
        clearInterval(INTERVAL_ID);
        BUTTON = BUTTON | event.detail
        if ((BUTTON & HidNpadButton.Plus) && BUTTON !== HidNpadButton.Plus)
          event.preventDefault()
        this.update(BUTTON)
        INTERVAL_ID = setTimeout(() => repeat_button_event(BUTTON), 400)
      })
      addEventListener('buttonup', (event: any) => {
        clearInterval(INTERVAL_ID);
        BUTTON = BUTTON & (~event.detail) // Clear Bit
      })
      //addEventListener('keyup', (event: any) => {
      //  if (this.editing)
      //    this.key(event.key, event.code)
      //});
    } else {
      window.addEventListener('keydown', async (event: any) => {
        let detail = undefined
        //console.log(event)
        if ((event.code in mapping)) {
          detail = mapping[event.code]
          if (event.altKey) {
            detail = detail | mapping.Alt
          }
          if (event.shiftKey) {
            if (event.code + "Shift" in mapping)
              detail = mapping[event.code + "Shift"]
          }
          if (event.key == "+") {
            detail = HidNpadButton.Plus | HidNpadButton.ZL
          }
        }
        if (this.editing) {
          if (!detail || !(detail & HidNpadButton_AnyDir))
            detail = event.key
        }
        //console.log("DETAIL", detail)
        this.update(detail);
      });
    }
  }
}


function write_save_file(save: any, state: State) {
  if (!ON_SWITCH)
    return
  //create_backup(save.save_data)

  //save.save_data.mount()

  for (const file of save.files) {
    if (file.endsWith("game_data.sav")) {
      state.message(`Writing ${file} ...`)
      Switch.writeFileSync(file, save.data.raw())
    }
    if (file.endsWith("caption.sav")) {
      state.message(`Writing ${file} ...`)
      Switch.writeFileSync(file, save.caption.raw())
    }
  }
  save.save_data.commit()
  //save.save_data.unmount()
}


function create_backup(save_data: any, state: State) {
  let now = new Date().toISOString().slice(0, 19)
  if (!ON_SWITCH)
    return
  const m = save_data.mount()
  const dst = "smdc:/switch/botwgz/" + now
  Switch.mkdirSync(dst);
  state.message(`Creating backup at ${dst}`);
  //let m = save_data.mount()

  let dirs: string[] | null = Switch.readDirSync(m.href)
  if (dirs) {
    for (const dir of dirs) {
      state.message(`Copying ${dir} ...`);
      const dst_dir = dst + "/" + dir
      Switch.mkdirSync(dst_dir)
      const path = m.href + "/" + dir
      let files = Switch.readDirSync(path);
      if (!files || files === undefined)
        continue
      for (const file of files) {
        const dst_file = dst_dir + "/" + file
        const data = Switch.readFileSync(file)
        if (data)
          Switch.writeFileSync(dst_file, data);
      }
    }
  }
  state.message(`Backup created`);
  //save_data.unmount()

}

export async function main() {
  let state = new State();
  state.clear()
  //console.log(state.ctx)
  state.ctx.fillStyle = state.fg_color
  state.ctx.font = `42px ${FONT}`
  state.ctx.textAlign = "center";
  state.ctx.textBaseline = "middle";
  state.ctx.fillText('BotW Save Editor', 1280 / 2, 720 / 2)
  state.ctx.font = `28px ${FONT}`
  state.ctx.fillText('Loading user data ...', 1280 / 2, 720 / 2 + 32 * 1.2)
  state.blit()


  let profiles = await load_profile_data();
  state.set_profiles(profiles);
  for (const profile of profiles) {
    let imgsrc = URL.createObjectURL(new Blob([profile.image], { type: 'image/jpeg' }));
    // @ts-ignore
    profile.Image = await loadImage(imgsrc);
  }
  const av = new AccountView(state, new Rect(40, 40, 1280 - 40, 720 - 50), { profiles })
  av.addEventListener('click', (ev: CustomEvent) => {
    state.show_captions(ev.detail)
  })

  state.push_view(av)

  state.update()
  setTimeout(() => {
    load_types();
    load_locations();
  }, 10)
}


main();

