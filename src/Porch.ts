export enum PorchType {
  None = "None",
  Bow = "Bow",
  Arrow = "Arrow",
  Weapon = "Weapon",
  Shield = "Shield",
  Armor = "Armor",
  Material = "Material",
  Food = "Food",
  KeyItem = "KeyItem",
}

export function porch_items(ptype: PorchType): string[] {
  // @ts-ignore
  const nums = Object.keys(PorchName).filter(v => Number(v)).filter(v => is_type(v as PorchName, ptype))
  return nums.map(v => PorchName[v])
}

function is_type(name: PorchName, ptype: PorchType) {
  let limits = [0, 0]
  if (ptype == PorchType.Bow)
    limits = [PorchName.Bow_Start, PorchName.Bow_End]
  else if (ptype == PorchType.Arrow)
    limits = [PorchName.Arrow_Start, PorchName.Arrow_End]
  else if (ptype == PorchType.Weapon)
    limits = [PorchName.Weapon_Start, PorchName.Weapon_End]
  else if (ptype == PorchType.Shield)
    limits = [PorchName.Shield_Start, PorchName.Shield_End]
  else if (ptype == PorchType.Armor)
    limits = [PorchName.Armor_Start, PorchName.Armor_End]
  else if (ptype == PorchType.Material)
    limits = [PorchName.Item_Material_Start, PorchName.Item_Material_End]
  else if (ptype == PorchType.Food)
    limits = [PorchName.Item_Cook_Start, PorchName.Item_Cook_End]
  else if (ptype == PorchType.KeyItem)
    limits = [PorchName.Item_Key_Start, PorchName.Item_Key_End]
  return name > limits[0] && name < limits[1]
}

export function to_porch_type(name: PorchName) {
  if (name == PorchName.None)
    return PorchType.None
  if (name > PorchName.Bow_Start && name < PorchName.Bow_End)
    return PorchType.Bow
  if (name > PorchName.Weapon_Start && name < PorchName.Weapon_End)
    return PorchType.Weapon
  if (name > PorchName.Shield_Start && name < PorchName.Shield_End)
    return PorchType.Shield
  if (name >= PorchName.Arrow_Start && name < PorchName.Arrow_End)
    return PorchType.Arrow
  if (name > PorchName.Armor_Start && name < PorchName.Armor_End)
    return PorchType.Armor
  if (name > PorchName.Item_Cook_Start && name < PorchName.Item_Cook_End)
    return PorchType.Food
  if (name > PorchName.Item_Material_Start && name < PorchName.Item_Material_End)
    return PorchType.Material
  if (name > PorchName.Item_Key_Start && name < PorchName.Item_Key_End)
    return PorchType.KeyItem
  return PorchType.None
}

import { PorchName } from './PorchNames'
export { PorchName } from './PorchNames'

export const ModVals: any = {
  AttackUp: 0x1,
  DurabilityUp: 0x2,
  CriticalHit: 0x4,
  LongThrow: 0x8,
  MultiShot: 0x10,
  Zoom: 0x20,
  QuickShot: 0x40,
  SurfMaster: 0x80,
  Star: 0x80000000,
};
export class Modifier {
  value: number;
  constructor(value: number) {
    this.value = value
  }
  is(mod: string) {
    //console.log("IS", this.value, mod, ModVals[mod], this.value & ModVals[mod])
    return this.value & ModVals[mod]
  }
  toggle(mod: string) {
    this.value = this.value ^ ModVals[mod]
  }
  on(mod: string) {
    this.value = this.value | ModVals[mod]
  }
  off(mod: string) {
    this.value = this.value & (~ModVals[mod])
  }

}

export class PorchItem {
  _name: string;
  ptype: PorchType;
  equip: boolean;
  value: number;
  flag_sp: number;
  value_sp: number;
  cook_effect0: [number, number]; // Effect, Level
  cook_effect1: [number, number]; // Sell Price
  stamina_recover: [number, number]; // Life, Duration
  _pname: PorchName;
  constructor() {
    this._pname = PorchName.None
    this._name = ""
    this.ptype = PorchType.None
    this.equip = false
    this.value = 0
    this.flag_sp = 0
    this.value_sp = 0
    this.cook_effect0 = [0.0, 0.0]
    this.cook_effect1 = [0.0, 0.0]
    this.stamina_recover = [0.0, 0.0]
  }
  get name() {
    return this._name
  }
  get pname() {
    return this._pname
  }
  set name(value: string) {
    let tmp: PorchName = PorchName[value as keyof typeof PorchName]
    this._pname = tmp
    if (this._pname in PorchName) {
      this._name = PorchName[this._pname] as string
      this.ptype = to_porch_type(this._pname)
    } else {
      this._name = this._pname as unknown as string // Hmm
      const id = this._name
      const keys: { [key: string]: PorchType } = {
        Weapon_Bow: PorchType.Bow,
        Weapon_Sword: PorchType.Weapon,
        Weapon_Lsword: PorchType.Weapon,
        Weapon_Spear: PorchType.Weapon,
        Weapon_Sheild: PorchType.Shield,
        Armor_: PorchType.Armor,
        Item_Cook_: PorchType.Food,
        Item_Boiled: PorchType.Food,
        Item_Chilled: PorchType.Food,
        Item_Roast: PorchType.Food,
        Animal_Insect: PorchType.Material,
        Item_Enemy: PorchType.Material,
        Item_FishGet: PorchType.Material,
        Item_Fruit: PorchType.Material,
        Item_InsectGet: PorchType.Material,
        Item_Material: PorchType.Material,
        Item_Mushroom: PorchType.Material,
        Item_Ore: PorchType.Material,
        Item_Plant: PorchType.Material,
        Item_FireWood: PorchType.Material,
        Obj_: PorchType.KeyItem,
      }

      let kind = Object.keys(keys).find(key => id.startsWith(key))
      this.ptype = (kind !== undefined) ? keys[kind] : PorchType.None
    }
  }
  set pname(value: PorchName) {
    this._pname = value
    this._name = PorchName[this._pname] as string
    this.ptype = to_porch_type(this._pname)
  }
}



export class SP {
  data: any
  index: any
  constructor(sword: any = undefined, bow: any = undefined, shield: any = undefined, cook: any = undefined) {
    this.data = {}
    this.index = {}
    if (!shield || shield.length == 0)
      shield = Array(20).fill(0)
    if (!sword || sword.length == 0)
      sword = Array(20).fill(0)
    if (!bow || bow.length == 0)
      bow = Array(14).fill(0)
    if (!cook || cook.length == 0)
      cook = Array(60).fill([-1.0, 0.0])
    this.data[PorchType.Shield] = shield
    this.data[PorchType.Bow] = bow
    this.data[PorchType.Weapon] = sword
    this.data[PorchType.Food] = cook
    this.index[PorchType.Shield] = 0
    this.index[PorchType.Bow] = 0
    this.index[PorchType.Weapon] = 0
    this.index[PorchType.Food] = 0
  }
  set(ptype: PorchType, value: number | [number, number]) {
    if (ptype != PorchType.Bow && ptype != PorchType.Weapon &&
      ptype != PorchType.Shield && ptype != PorchType.Food)
      return
    const k = this.index[ptype]
    this.data[ptype][k] = value
    this.index[ptype] += 1
  }
  get(ptype: PorchType) {
    if (ptype != PorchType.Bow && ptype != PorchType.Weapon &&
      ptype != PorchType.Shield && ptype != PorchType.Food)
      return 0
    const k = this.index[ptype];
    this.index[ptype] += 1
    return this.data[ptype][k]
  }
}

export function arrays_to_porch(names: any, value: any, equip: any,
  PorchSword_FlagSp: any, PorchBow_FlagSp: any, PorchShield_FlagSp: any,
  PorchSword_ValueSp: any, PorchBow_ValueSp: any, PorchShield_ValueSp: any,
  cook_effect0: any, cook_effect1: any, stamina_recover: any) {
  let flag_sp = new SP(PorchSword_FlagSp, PorchBow_FlagSp, PorchShield_FlagSp, cook_effect0)
  let value_sp = new SP(PorchSword_ValueSp, PorchBow_ValueSp, PorchShield_ValueSp, cook_effect1)
  let stam_sp = new SP([], [], [], stamina_recover)

  let items = []
  for (let i = 0; i < names.length; i++) {
    const item = names[i]
    if (item == "")
      continue
    let p = new PorchItem()
    p.name = item;
    p.value = value[i]
    p.equip = equip[i]
    if (p.ptype == "Food") {
      p.cook_effect0 = flag_sp.get(p.ptype)
      p.cook_effect1 = value_sp.get(p.ptype)
      p.stamina_recover = stam_sp.get(p.ptype)
    } else {
      p.flag_sp = flag_sp.get(p.ptype)
      p.value_sp = value_sp.get(p.ptype)
    }
    items.push(p)
  }
  return items
}

export function porch_to_arrays(items: PorchItem[]) {
  let flag_sp = new SP()
  let value_sp = new SP()
  let stam_sp = new SP()
  let names = []
  let value = Array(420).fill(0)
  let equip = Array(420).fill(false)
  let i = 0;
  for (const p of items) {
    names.push(p.name)
    value[i] = p.value
    equip[i] = p.equip
    if (p.ptype == "Food") {
      flag_sp.set(p.ptype, p.cook_effect0)
      value_sp.set(p.ptype, p.cook_effect1)
      stam_sp.set(p.ptype, p.stamina_recover)
    } else {
      flag_sp.set(p.ptype, p.flag_sp)
      value_sp.set(p.ptype, p.value_sp)
    }
    i += 1
  }
  return {
    names, value, equip,
    sword_flag_sp: Array.from(flag_sp.data[PorchType.Weapon]),
    bow_flag_sp: Array.from(flag_sp.data[PorchType.Bow]),
    shield_flag_sp: Array.from(flag_sp.data[PorchType.Shield]),
    sword_value_sp: Array.from(value_sp.data[PorchType.Weapon]),
    bow_value_sp: Array.from(value_sp.data[PorchType.Bow]),
    shield_value_sp: Array.from(value_sp.data[PorchType.Shield]),
    cook_effect0: Array.from(flag_sp.data[PorchType.Food]),
    cook_effect1: Array.from(value_sp.data[PorchType.Food]),
    stamina_recover: Array.from(stam_sp.data[PorchType.Food])
  }
}
