
import { Savefile } from './savefile'
import { name_ui } from './formatters'

const LevelSensor = {
  series: {
    BokoblinSeries: [
      { name: "Enemy_Bokoblin_Junior", value: 4.0 },
      { name: "Enemy_Bokoblin_Middle", value: 16.0 },
      { name: "Enemy_Bokoblin_Senior", value: 32.0 },
      { name: "Enemy_Bokoblin_Dark", value: 48.0 },
    ],
    MoriblinSeries: [
      { name: "Enemy_Moriblin_Junior", value: 11.0 },
      { name: "Enemy_Moriblin_Middle", value: 37.0 },
      { name: "Enemy_Moriblin_Senior", value: 65.0 },
      { name: "Enemy_Moriblin_Senior_Volcano", value: 65.0 },
      { name: "Enemy_Moriblin_Dark", value: 69.0 },
    ],
    LynelSeries: [
      { name: "Enemy_Lynel_Junior", value: 39.0 },
      { name: "Enemy_Lynel_Middle", value: 56.0 },
      { name: "Enemy_Lynel_Senior", value: 84.0 },
      { name: "Enemy_Lynel_Dark", value: 88.0 },
    ],
    LizalfosSeries: [
      { name: "Enemy_Lizalfos_Junior", value: 18.0 },
      { name: "Enemy_Lizalfos_Middle", value: 32.0 },
      { name: "Enemy_Lizalfos_Senior", value: 52.0 },
      { name: "Enemy_Lizalfos_Dark", value: 56.0 },
    ],
    AssassinSeries: [
      { name: "Enemy_Assassin_Shooter_Junior", value: 16.0 },
      { name: "Enemy_Assassin_Middle", value: 50.0 },
    ]
  },
  points: {
    Defeated_Enemy_Wizzrobe_Electric_Num: 5.0,
    Defeated_Enemy_Wizzrobe_Fire_Num: 5.0,
    Defeated_Enemy_Wizzrobe_Ice_Num: 5.0,
    Defeated_Enemy_Guardian_A_Fixed_Moss_Num: 12.0,
    Defeated_Enemy_Golem_Junior_Num: 15.0,
    Defeated_Enemy_Giant_Junior_Num: 15.0,
    Defeated_Enemy_Assassin_Middle_Num: 15.0,
    Defeated_Enemy_Bokoblin_Senior_Num: 15.0,
    Defeated_Enemy_Wizzrobe_Ice_Senior_Num: 15.0,
    Defeated_Enemy_Wizzrobe_Fire_Senior_Num: 15.0,
    Defeated_Enemy_Wizzrobe_Electric_Senior_Num: 15.0,
    Defeated_RemainsFire_Drone_A_01_Num: 15.0,
    Defeated_Enemy_Moriblin_Senior_Num: 18.0,
    Defeated_Enemy_Guardian_Mini_Middle_Num: 20.0,
    Defeated_Enemy_Lizalfos_Electric_Num: 20.0,
    Defeated_Enemy_Lizalfos_Ice_Num: 20.0,
    Defeated_Enemy_Lizalfos_Senior_Num: 20.0,
    Defeated_Enemy_Lizalfos_Fire_Num: 20.0,
    Defeated_Enemy_Bokoblin_Gold_Num: 25.0,
    Defeated_Enemy_Giant_Bone_Num: 25.0,
    Defeated_Enemy_Bokoblin_Dark_Num: 25.0,
    Defeated_Enemy_Golem_Middle_Num: 25.0,
    Defeated_Enemy_Giant_Middle_Num: 25.0,
    Defeated_Enemy_Golem_Senior_Num: 30.0,
    Defeated_Enemy_Golem_Fire_Num: 35.0,
    Defeated_Enemy_Moriblin_Gold_Num: 35.0,
    Defeated_Enemy_Guardian_Mini_Senior_Num: 35.0,
    Defeated_Enemy_Guardian_B_Num: 35.0,
    Defeated_Enemy_Golem_Ice_Num: 35.0,
    Defeated_Enemy_Moriblin_Dark_Num: 35.0,
    Defeated_Enemy_Golem_Fire_R_Num: 35.0,
    Defeated_Enemy_Giant_Senior_Num: 35.0,
    Defeated_Enemy_Lizalfos_Dark_Num: 40.0,
    Defeated_Enemy_Lizalfos_Gold_Num: 40.0,
    Defeated_Enemy_SandwormR_Num: 50.0,
    Defeated_Enemy_Guardian_A_Num: 50.0,
    Defeated_Enemy_Guardian_C_Num: 50.0,
    Defeated_Enemy_Sandworm_Num: 50.0,
    Defeated_Enemy_Lynel_Junior_Num: 50.0,
    Defeated_Enemy_Lynel_Middle_Num: 60.0,
    Defeated_Enemy_Lynel_Senior_Num: 80.0,
    Defeated_Enemy_Assassin_Senior_Num: 100.0,
    Defeated_Enemy_Lynel_Gold_Num: 120.0,
    Defeated_Enemy_Lynel_Dark_Num: 120.0,
    Defeated_Enemy_SiteBoss_Lsword_Num: 300.0,
    Defeated_Enemy_SiteBoss_Spear_Num: 300.0,
    Defeated_Enemy_SiteBoss_Sword_Num: 300.0,
    Defeated_Enemy_SiteBoss_Bow_Num: 300.0,
    Defeated_Priest_Boss_Normal_Num: 500.0,
    Defeated_Enemy_GanonBeast_Num: 800.0,
  },

  setting: {
    Level2EnemyPower: 0.014000000432133675,
    Level2WeaponPower: 0.012000000104308128
  },
}

export function scale_points(s: Savefile, updated: any): number {
  let points = 0
  for (const [enemy, pts] of Object.entries(LevelSensor.points)) {
    let n = s.get(enemy)
    if (enemy in updated) {
      n = updated[enemy]
    }
    points += n * pts
  }
  return points;
}

export function scale_actor(s: Savefile, updated: any): any {
  const points = scale_points(s, updated)
  const enemy_points = points * LevelSensor.setting.Level2EnemyPower;
  const weapon_points = points * LevelSensor.setting.Level2WeaponPower;
  let out: any = {
    enemy_points: enemy_points.toFixed(1),
    scale_points: points.toFixed(1),
    weapon_points: weapon_points.toFixed(1),
  }
  for (const [name, series] of Object.entries(LevelSensor.series)) {
    let i = 0;
    while (i < series.length) {
      if (enemy_points <= series[i].value)
        break
      i += 1;
    }
    out[name] = {}
    out[`${name}_lt1`] = '<'
    out[`${name}_lt2`] = '<'
    if (i == series.length) {
      out[`${name}_next`] = ''
      out[`${name}_next_value`] = ''
      out[`${name}_lt2`] = ''
    } else {
      out[`${name}_next`] = name_ui(series[i].name)
      out[`${name}_next_value`] = series[i].value
    }
    if (i == 0) {
      out[`${name}_current`] = ''
      out[`${name}_current_value`] = ''
      out[`${name}_lt1`] = ''
    } else {
      out[`${name}_current`] = name_ui(series[i - 1].name)
      out[`${name}_current_value`] = series[i - 1].value
    }
  }
  return out
}
/*
weapon:
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_004, plus: -1, value: 4.0}
- {name: Weapon_Sword_004, plus: 0, value: 7.0}
- {name: Weapon_Sword_004, plus: 1, value: 10.0}
- {name: Weapon_Sword_005, plus: -1, value: 12.0}
- {name: Weapon_Sword_005, plus: 0, value: 16.0}
- {name: Weapon_Sword_005, plus: 1, value: 21.0}
- {name: Weapon_Sword_006, plus: -1, value: 24.0}
- {name: Weapon_Sword_006, plus: 0, value: 34.0}
- {name: Weapon_Sword_006, plus: 1, value: 44.0}
not_rank_up: false
series: BokoblinSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_004, plus: -1, value: 4.0}
- {name: Weapon_Lsword_004, plus: 0, value: 6.6666998863220215}
- {name: Weapon_Lsword_004, plus: 1, value: 10.0}
- {name: Weapon_Lsword_005, plus: -1, value: 12.0}
- {name: Weapon_Lsword_005, plus: 0, value: 16.66670036315918}
- {name: Weapon_Lsword_005, plus: 1, value: 20.66670036315918}
- {name: Weapon_Lsword_006, plus: -1, value: 24.0}
- {name: Weapon_Lsword_006, plus: 0, value: 30.0}
- {name: Weapon_Lsword_006, plus: 1, value: 36.0}
not_rank_up: false
series: BokoblinSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_004, plus: -1, value: 4.0}
- {name: Weapon_Spear_004, plus: 0, value: 6.0}
- {name: Weapon_Spear_004, plus: 1, value: 10.0}
- {name: Weapon_Spear_005, plus: -1, value: 12.0}
- {name: Weapon_Spear_005, plus: 0, value: 16.0}
- {name: Weapon_Spear_005, plus: 1, value: 20.0}
- {name: Weapon_Spear_006, plus: -1, value: 24.0}
- {name: Weapon_Spear_006, plus: 0, value: 30.0}
- {name: Weapon_Spear_006, plus: 1, value: 36.0}
not_rank_up: false
series: BokoblinSeries
- actorType: WeaponBow
actors:
- {name: Weapon_Bow_004, plus: -1, value: 4.0}
- {name: Weapon_Bow_004, plus: 0, value: 7.0}
- {name: Weapon_Bow_004, plus: 1, value: 10.0}
- {name: Weapon_Bow_003, plus: -1, value: 12.0}
- {name: Weapon_Bow_003, plus: 0, value: 16.0}
- {name: Weapon_Bow_003, plus: 1, value: 21.0}
- {name: Weapon_Bow_027, plus: -1, value: 24.0}
- {name: Weapon_Bow_027, plus: 0, value: 30.0}
- {name: Weapon_Bow_027, plus: 1, value: 36.0}
not_rank_up: false
series: BokoblinSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_004, plus: -1, value: 3.0}
- {name: Weapon_Shield_004, plus: 0, value: 6.0}
- {name: Weapon_Shield_004, plus: 1, value: 8.0}
- {name: Weapon_Shield_005, plus: -1, value: 10.0}
- {name: Weapon_Shield_005, plus: 0, value: 15.0}
- {name: Weapon_Shield_005, plus: 1, value: 21.0}
- {name: Weapon_Shield_006, plus: -1, value: 25.0}
- {name: Weapon_Shield_006, plus: 0, value: 34.0}
- {name: Weapon_Shield_006, plus: 1, value: 43.0}
not_rank_up: false
series: BokoblinSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_007, plus: -1, value: 14.0}
- {name: Weapon_Sword_007, plus: 0, value: 18.0}
- {name: Weapon_Sword_007, plus: 1, value: 21.0}
- {name: Weapon_Sword_008, plus: -1, value: 24.0}
- {name: Weapon_Sword_008, plus: 0, value: 28.0}
- {name: Weapon_Sword_008, plus: 1, value: 33.0}
- {name: Weapon_Sword_009, plus: -1, value: 36.0}
- {name: Weapon_Sword_009, plus: 0, value: 45.0}
- {name: Weapon_Sword_009, plus: 1, value: 54.0}
not_rank_up: false
series: LizalfosSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_007, plus: -1, value: 14.0}
- {name: Weapon_Spear_007, plus: 0, value: 18.0}
- {name: Weapon_Spear_007, plus: 1, value: 22.0}
- {name: Weapon_Spear_008, plus: -1, value: 24.0}
- {name: Weapon_Spear_008, plus: 0, value: 28.0}
- {name: Weapon_Spear_008, plus: 1, value: 32.0}
- {name: Weapon_Spear_009, plus: -1, value: 36.0}
- {name: Weapon_Spear_009, plus: 0, value: 42.0}
- {name: Weapon_Spear_009, plus: 1, value: 48.0}
not_rank_up: false
series: LizalfosSeries
- actorType: WeaponBow
actors:
- {name: Weapon_Bow_006, plus: -1, value: 14.0}
- {name: Weapon_Bow_006, plus: 0, value: 18.0}
- {name: Weapon_Bow_006, plus: 1, value: 22.0}
- {name: Weapon_Bow_011, plus: -1, value: 25.0}
- {name: Weapon_Bow_011, plus: 0, value: 29.0}
- {name: Weapon_Bow_011, plus: 1, value: 33.0}
- {name: Weapon_Bow_030, plus: -1, value: 36.0}
- {name: Weapon_Bow_030, plus: 0, value: 40.0}
- {name: Weapon_Bow_030, plus: 1, value: 45.0}
not_rank_up: false
series: LizalfosSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_007, plus: -1, value: 15.0}
- {name: Weapon_Shield_007, plus: 0, value: 18.0}
- {name: Weapon_Shield_007, plus: 1, value: 20.0}
- {name: Weapon_Shield_008, plus: -1, value: 22.0}
- {name: Weapon_Shield_008, plus: 0, value: 27.0}
- {name: Weapon_Shield_008, plus: 1, value: 32.0}
- {name: Weapon_Shield_009, plus: -1, value: 35.0}
- {name: Weapon_Shield_009, plus: 0, value: 42.0}
- {name: Weapon_Shield_009, plus: 1, value: 50.0}
not_rank_up: false
series: LizalfosSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_013, plus: -1, value: 20.0}
- {name: Weapon_Sword_013, plus: 0, value: 24.0}
- {name: Weapon_Sword_013, plus: 1, value: 27.0}
- {name: Weapon_Sword_014, plus: -1, value: 30.0}
- {name: Weapon_Sword_014, plus: 0, value: 34.0}
- {name: Weapon_Sword_014, plus: 1, value: 37.0}
- {name: Weapon_Sword_015, plus: -1, value: 40.0}
- {name: Weapon_Sword_015, plus: 0, value: 47.0}
- {name: Weapon_Sword_015, plus: 1, value: 55.0}
not_rank_up: true
series: GuardianMiniSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_013, plus: -1, value: 20.0}
- {name: Weapon_Lsword_013, plus: 0, value: 24.0}
- {name: Weapon_Lsword_013, plus: 1, value: 27.33329963684082}
- {name: Weapon_Lsword_014, plus: -1, value: 30.0}
- {name: Weapon_Lsword_014, plus: 0, value: 34.0}
- {name: Weapon_Lsword_014, plus: 1, value: 37.33330154418945}
- {name: Weapon_Lsword_015, plus: -1, value: 40.0}
- {name: Weapon_Lsword_015, plus: 0, value: 44.0}
- {name: Weapon_Lsword_015, plus: 1, value: 48.0}
not_rank_up: true
series: GuardianMiniSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_013, plus: -1, value: 20.0}
- {name: Weapon_Spear_013, plus: 0, value: 24.0}
- {name: Weapon_Spear_013, plus: 1, value: 28.0}
- {name: Weapon_Spear_014, plus: -1, value: 30.0}
- {name: Weapon_Spear_014, plus: 0, value: 34.0}
- {name: Weapon_Spear_014, plus: 1, value: 38.0}
- {name: Weapon_Spear_015, plus: -1, value: 40.0}
- {name: Weapon_Spear_015, plus: 0, value: 46.0}
- {name: Weapon_Spear_015, plus: 1, value: 52.0}
not_rank_up: true
series: GuardianMiniSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_013, plus: -1, value: 18.0}
- {name: Weapon_Shield_013, plus: 0, value: 22.0}
- {name: Weapon_Shield_013, plus: 1, value: 27.0}
- {name: Weapon_Shield_014, plus: -1, value: 30.0}
- {name: Weapon_Shield_014, plus: 0, value: 34.0}
- {name: Weapon_Shield_014, plus: 1, value: 39.0}
- {name: Weapon_Shield_015, plus: -1, value: 42.0}
- {name: Weapon_Shield_015, plus: 0, value: 46.0}
- {name: Weapon_Shield_015, plus: 1, value: 51.0}
not_rank_up: true
series: GuardianMiniSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_016, plus: -1, value: 24.0}
- {name: Weapon_Sword_016, plus: 0, value: 28.0}
- {name: Weapon_Sword_016, plus: 1, value: 33.0}
- {name: Weapon_Sword_017, plus: -1, value: 36.0}
- {name: Weapon_Sword_017, plus: 0, value: 44.0}
- {name: Weapon_Sword_017, plus: 1, value: 52.0}
- {name: Weapon_Sword_018, plus: -1, value: 58.0}
- {name: Weapon_Sword_018, plus: 0, value: 74.0}
- {name: Weapon_Sword_018, plus: 1, value: 90.0}
not_rank_up: false
series: LynelSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_016, plus: -1, value: 24.0}
- {name: Weapon_Lsword_016, plus: 0, value: 28.66670036315918}
- {name: Weapon_Lsword_016, plus: 1, value: 32.66669845581055}
- {name: Weapon_Lsword_017, plus: -1, value: 36.0}
- {name: Weapon_Lsword_017, plus: 0, value: 42.0}
- {name: Weapon_Lsword_017, plus: 1, value: 48.0}
- {name: Weapon_Lsword_018, plus: -1, value: 52.0}
- {name: Weapon_Lsword_018, plus: 0, value: 59.33330154418945}
- {name: Weapon_Lsword_018, plus: 1, value: 67.33329772949219}
not_rank_up: false
series: LynelSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_016, plus: -1, value: 28.0}
- {name: Weapon_Spear_016, plus: 0, value: 32.0}
- {name: Weapon_Spear_016, plus: 1, value: 36.0}
- {name: Weapon_Spear_017, plus: -1, value: 40.0}
- {name: Weapon_Spear_017, plus: 0, value: 48.0}
- {name: Weapon_Spear_017, plus: 1, value: 54.0}
- {name: Weapon_Spear_018, plus: -1, value: 60.0}
- {name: Weapon_Spear_018, plus: 0, value: 70.0}
- {name: Weapon_Spear_018, plus: 1, value: 82.0}
not_rank_up: false
series: LynelSeries
- actorType: WeaponBow
actors:
- {name: Weapon_Bow_009, plus: -1, value: 10.0}
- {name: Weapon_Bow_009, plus: 0, value: 14.0}
- {name: Weapon_Bow_009, plus: 1, value: 17.0}
- {name: Weapon_Bow_026, plus: -1, value: 20.0}
- {name: Weapon_Bow_026, plus: 0, value: 24.0}
- {name: Weapon_Bow_026, plus: 1, value: 29.0}
- {name: Weapon_Bow_032, plus: -1, value: 32.0}
- {name: Weapon_Bow_032, plus: 0, value: 39.0}
- {name: Weapon_Bow_032, plus: 1, value: 46.0}
not_rank_up: false
series: LynelSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_016, plus: -1, value: 30.0}
- {name: Weapon_Shield_016, plus: 0, value: 35.0}
- {name: Weapon_Shield_016, plus: 1, value: 40.0}
- {name: Weapon_Shield_017, plus: -1, value: 44.0}
- {name: Weapon_Shield_017, plus: 0, value: 51.0}
- {name: Weapon_Shield_017, plus: 1, value: 57.0}
- {name: Weapon_Shield_018, plus: -1, value: 62.0}
- {name: Weapon_Shield_018, plus: 0, value: 70.0}
- {name: Weapon_Shield_018, plus: 1, value: 79.0}
not_rank_up: false
series: LynelSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_001, plus: -1, value: 5.0}
- {name: Weapon_Sword_001, plus: 0, value: 9.0}
- {name: Weapon_Sword_001, plus: 1, value: 12.0}
- {name: Weapon_Sword_002, plus: -1, value: 14.0}
- {name: Weapon_Sword_002, plus: 0, value: 18.0}
- {name: Weapon_Sword_002, plus: 1, value: 23.0}
- {name: Weapon_Sword_003, plus: -1, value: 26.0}
- {name: Weapon_Sword_003, plus: 0, value: 30.0}
- {name: Weapon_Sword_003, plus: 1, value: 33.0}
- {name: Weapon_Sword_024, plus: -1, value: 36.0}
- {name: Weapon_Sword_024, plus: 0, value: 45.0}
- {name: Weapon_Sword_024, plus: 1, value: 54.0}
not_rank_up: false
series: HyliaSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_001, plus: -1, value: 6.6666998863220215}
- {name: Weapon_Lsword_001, plus: 0, value: 9.33329963684082}
- {name: Weapon_Lsword_001, plus: 1, value: 11.33329963684082}
- {name: Weapon_Lsword_002, plus: -1, value: 13.33329963684082}
- {name: Weapon_Lsword_002, plus: 0, value: 18.0}
- {name: Weapon_Lsword_002, plus: 1, value: 22.0}
- {name: Weapon_Lsword_003, plus: -1, value: 25.33329963684082}
- {name: Weapon_Lsword_003, plus: 0, value: 28.66670036315918}
- {name: Weapon_Lsword_003, plus: 1, value: 32.0}
- {name: Weapon_Lsword_024, plus: -1, value: 34.66669845581055}
- {name: Weapon_Lsword_024, plus: 0, value: 39.33330154418945}
- {name: Weapon_Lsword_024, plus: 1, value: 44.66669845581055}
not_rank_up: false
series: HyliaSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_001, plus: -1, value: 6.0}
- {name: Weapon_Spear_001, plus: 0, value: 8.0}
- {name: Weapon_Spear_001, plus: 1, value: 12.0}
- {name: Weapon_Spear_002, plus: -1, value: 14.0}
- {name: Weapon_Spear_002, plus: 0, value: 18.0}
- {name: Weapon_Spear_002, plus: 1, value: 22.0}
- {name: Weapon_Spear_003, plus: -1, value: 26.0}
- {name: Weapon_Spear_003, plus: 0, value: 36.0}
- {name: Weapon_Spear_003, plus: 1, value: 46.0}
- {name: Weapon_Spear_024, plus: -1, value: 52.0}
- {name: Weapon_Spear_024, plus: 0, value: 66.0}
- {name: Weapon_Spear_024, plus: 1, value: 82.0}
not_rank_up: false
series: HyliaSeries
- actorType: WeaponBow
actors:
- {name: Weapon_Bow_001, plus: -1, value: 5.0}
- {name: Weapon_Bow_001, plus: 0, value: 9.0}
- {name: Weapon_Bow_001, plus: 1, value: 12.0}
- {name: Weapon_Bow_002, plus: -1, value: 14.0}
- {name: Weapon_Bow_002, plus: 0, value: 18.0}
- {name: Weapon_Bow_002, plus: 1, value: 23.0}
- {name: Weapon_Bow_035, plus: -1, value: 26.0}
- {name: Weapon_Bow_035, plus: 0, value: 30.0}
- {name: Weapon_Bow_035, plus: 1, value: 35.0}
- {name: Weapon_Bow_036, plus: -1, value: 38.0}
- {name: Weapon_Bow_036, plus: 0, value: 44.0}
- {name: Weapon_Bow_036, plus: 1, value: 50.0}
not_rank_up: false
series: HyliaSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_035, plus: -1, value: 4.0}
- {name: Weapon_Shield_035, plus: 0, value: 8.0}
- {name: Weapon_Shield_035, plus: 1, value: 13.0}
- {name: Weapon_Shield_002, plus: -1, value: 16.0}
- {name: Weapon_Shield_002, plus: 0, value: 25.0}
- {name: Weapon_Shield_002, plus: 1, value: 34.0}
- {name: Weapon_Shield_003, plus: -1, value: 40.0}
- {name: Weapon_Shield_003, plus: 0, value: 46.0}
- {name: Weapon_Shield_003, plus: 1, value: 51.0}
- {name: Weapon_Shield_022, plus: -1, value: 55.0}
- {name: Weapon_Shield_022, plus: 0, value: 62.0}
- {name: Weapon_Shield_022, plus: 1, value: 70.0}
not_rank_up: false
series: HyliaSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_025, plus: -1, value: 22.0}
- {name: Weapon_Sword_025, plus: 0, value: 25.0}
- {name: Weapon_Sword_025, plus: 1, value: 28.0}
not_rank_up: false
series: KokiriSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_025, plus: -1, value: 22.0}
- {name: Weapon_Spear_025, plus: 0, value: 32.0}
- {name: Weapon_Spear_025, plus: 1, value: 40.0}
not_rank_up: false
series: KokiriSeries
- actorType: WeaponBow
actors:
- {name: Weapon_Bow_013, plus: -1, value: 15.0}
- {name: Weapon_Bow_013, plus: 0, value: 20.0}
- {name: Weapon_Bow_013, plus: 1, value: 25.0}
not_rank_up: false
series: KokiriSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_023, plus: -1, value: 30.0}
- {name: Weapon_Shield_023, plus: 0, value: 34.0}
- {name: Weapon_Shield_023, plus: 1, value: 39.0}
not_rank_up: false
series: KokiriSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_027, plus: -1, value: 15.0}
- {name: Weapon_Sword_027, plus: 0, value: 20.0}
- {name: Weapon_Sword_027, plus: 1, value: 24.0}
not_rank_up: false
series: ZoraSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_027, plus: -1, value: 14.66670036315918}
- {name: Weapon_Lsword_027, plus: 0, value: 19.33329963684082}
- {name: Weapon_Lsword_027, plus: 1, value: 24.0}
not_rank_up: false
series: ZoraSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_027, plus: -1, value: 18.0}
- {name: Weapon_Spear_027, plus: 0, value: 24.0}
- {name: Weapon_Spear_028, plus: -1, value: 24.0}
- {name: Weapon_Spear_027, plus: 1, value: 30.0}
- {name: Weapon_Spear_028, plus: 0, value: 34.0}
- {name: Weapon_Spear_028, plus: 1, value: 44.0}
not_rank_up: false
series: ZoraSeries
- actorType: WeaponBow
actors:
- {name: Weapon_Bow_014, plus: -1, value: 15.0}
- {name: Weapon_Bow_014, plus: 0, value: 20.0}
- {name: Weapon_Bow_014, plus: 1, value: 25.0}
not_rank_up: false
series: ZoraSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_025, plus: -1, value: 18.0}
- {name: Weapon_Shield_025, plus: 0, value: 28.0}
- {name: Weapon_Shield_025, plus: 1, value: 38.0}
not_rank_up: false
series: ZoraSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_029, plus: -1, value: 16.0}
- {name: Weapon_Sword_029, plus: 0, value: 20.0}
- {name: Weapon_Sword_029, plus: 1, value: 23.0}
- {name: Weapon_Sword_030, plus: -1, value: 25.0}
- {name: Weapon_Sword_030, plus: 0, value: 28.0}
- {name: Weapon_Sword_030, plus: 1, value: 30.0}
not_rank_up: false
series: OasisSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_029, plus: -1, value: 18.66670036315918}
- {name: Weapon_Lsword_029, plus: 0, value: 22.66670036315918}
- {name: Weapon_Lsword_029, plus: 1, value: 26.66670036315918}
not_rank_up: false
series: OasisSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_029, plus: -1, value: 32.0}
- {name: Weapon_Spear_029, plus: 0, value: 46.0}
- {name: Weapon_Spear_029, plus: 1, value: 56.0}
not_rank_up: false
series: OasisSeries
- actorType: WeaponBow
actors:
- {name: Weapon_Bow_015, plus: -1, value: 14.0}
- {name: Weapon_Bow_015, plus: 0, value: 19.0}
- {name: Weapon_Bow_015, plus: 1, value: 24.0}
not_rank_up: false
series: OasisSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_026, plus: -1, value: 20.0}
- {name: Weapon_Shield_026, plus: 0, value: 26.0}
- {name: Weapon_Shield_026, plus: 1, value: 31.0}
- {name: Weapon_Shield_036, plus: -1, value: 35.0}
- {name: Weapon_Shield_036, plus: 0, value: 40.0}
- {name: Weapon_Shield_036, plus: 1, value: 45.0}
not_rank_up: false
series: OasisSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_031, plus: -1, value: 15.0}
- {name: Weapon_Sword_031, plus: 0, value: 20.0}
- {name: Weapon_Sword_031, plus: 1, value: 24.0}
not_rank_up: false
series: DragonRoostSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_032, plus: -1, value: 20.0}
- {name: Weapon_Spear_032, plus: 0, value: 28.0}
- {name: Weapon_Spear_032, plus: 1, value: 34.0}
not_rank_up: false
series: DragonRoostSeries
- actorType: WeaponBow
actors:
- {name: Weapon_Bow_016, plus: -1, value: 9.0}
- {name: Weapon_Bow_016, plus: 0, value: 16.0}
- {name: Weapon_Bow_017, plus: -1, value: 20.0}
- {name: Weapon_Bow_016, plus: 1, value: 21.0}
- {name: Weapon_Bow_017, plus: 0, value: 27.0}
- {name: Weapon_Bow_017, plus: 1, value: 33.0}
not_rank_up: false
series: DragonRoostSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_042, plus: -1, value: 14.0}
- {name: Weapon_Shield_042, plus: 0, value: 22.0}
- {name: Weapon_Shield_042, plus: 1, value: 30.0}
not_rank_up: false
series: DragonRoostSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_040, plus: -1, value: 1.0}
- {name: Weapon_Sword_502, plus: -1, value: 1.0}
- {name: Weapon_Sword_503, plus: -1, value: 1.0}
- {name: Weapon_Sword_040, plus: 0, value: 2.0}
- {name: Weapon_Sword_043, plus: -1, value: 2.0}
- {name: Weapon_Sword_040, plus: 1, value: 3.0}
- {name: Weapon_Sword_043, plus: 0, value: 4.0}
- {name: Weapon_Sword_022, plus: -1, value: 4.0}
- {name: Weapon_Sword_043, plus: 1, value: 5.0}
- {name: Weapon_Sword_021, plus: -1, value: 6.0}
- {name: Weapon_Sword_022, plus: 0, value: 7.0}
- {name: Weapon_Sword_051, plus: -1, value: 8.0}
- {name: Weapon_Sword_022, plus: 1, value: 10.0}
- {name: Weapon_Sword_021, plus: 0, value: 11.0}
- {name: Weapon_Sword_051, plus: 0, value: 14.0}
- {name: Weapon_Sword_021, plus: 1, value: 14.0}
- {name: Weapon_Sword_051, plus: 1, value: 19.0}
- {name: Weapon_Sword_034, plus: -1, value: 20.0}
- {name: Weapon_Sword_059, plus: -1, value: 20.0}
- {name: Weapon_Sword_035, plus: -1, value: 22.0}
- {name: Weapon_Sword_058, plus: -1, value: 22.0}
- {name: Weapon_Sword_033, plus: -1, value: 24.0}
- {name: Weapon_Sword_059, plus: 0, value: 25.0}
- {name: Weapon_Sword_034, plus: 0, value: 26.0}
- {name: Weapon_Sword_035, plus: 0, value: 28.0}
- {name: Weapon_Sword_057, plus: -1, value: 28.0}
- {name: Weapon_Sword_058, plus: 0, value: 28.0}
- {name: Weapon_Sword_070, plus: -1, value: 30.0}
- {name: Weapon_Sword_059, plus: 1, value: 30.0}
- {name: Weapon_Sword_033, plus: 0, value: 31.0}
- {name: Weapon_Sword_034, plus: 1, value: 32.0}
- {name: Weapon_Sword_058, plus: 1, value: 33.0}
- {name: Weapon_Sword_035, plus: 1, value: 35.0}
- {name: Weapon_Sword_057, plus: 0, value: 36.0}
- {name: Weapon_Sword_033, plus: 1, value: 38.0}
- {name: Weapon_Sword_057, plus: 1, value: 42.0}
- {name: Weapon_Sword_047, plus: -1, value: 48.0}
- {name: Weapon_Sword_047, plus: 0, value: 60.0}
- {name: Weapon_Sword_047, plus: 1, value: 73.0}
not_rank_up: true
series: UniqueSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_056, plus: -1, value: 0.666700005531311}
- {name: Weapon_Lsword_020, plus: -1, value: 8.0}
- {name: Weapon_Lsword_031, plus: -1, value: 8.0}
- {name: Weapon_Lsword_038, plus: -1, value: 9.33329963684082}
- {name: Weapon_Lsword_045, plus: -1, value: 10.66670036315918}
- {name: Weapon_Lsword_020, plus: 0, value: 13.33329963684082}
- {name: Weapon_Lsword_031, plus: 0, value: 13.33329963684082}
- {name: Weapon_Lsword_038, plus: 0, value: 16.0}
- {name: Weapon_Lsword_051, plus: -1, value: 16.66670036315918}
- {name: Weapon_Lsword_045, plus: 0, value: 18.0}
- {name: Weapon_Lsword_020, plus: 1, value: 19.33329963684082}
- {name: Weapon_Lsword_031, plus: 1, value: 19.33329963684082}
- {name: Weapon_Lsword_034, plus: -1, value: 20.0}
- {name: Weapon_Lsword_035, plus: -1, value: 21.33329963684082}
- {name: Weapon_Lsword_051, plus: 0, value: 22.0}
- {name: Weapon_Lsword_045, plus: 1, value: 22.0}
- {name: Weapon_Lsword_033, plus: -1, value: 22.66670036315918}
- {name: Weapon_Lsword_038, plus: 1, value: 22.66670036315918}
- {name: Weapon_Lsword_034, plus: 0, value: 25.33329963684082}
- {name: Weapon_Lsword_035, plus: 0, value: 27.33329963684082}
- {name: Weapon_Lsword_051, plus: 1, value: 28.0}
- {name: Weapon_Lsword_033, plus: 0, value: 28.66670036315918}
- {name: Weapon_Lsword_034, plus: 1, value: 30.0}
- {name: Weapon_Lsword_035, plus: 1, value: 32.0}
- {name: Weapon_Lsword_057, plus: -1, value: 32.0}
- {name: Weapon_Lsword_059, plus: -1, value: 33.33330154418945}
- {name: Weapon_Lsword_033, plus: 1, value: 34.0}
- {name: Weapon_Lsword_057, plus: 0, value: 36.66669845581055}
- {name: Weapon_Lsword_059, plus: 0, value: 38.0}
- {name: Weapon_Lsword_060, plus: -1, value: 40.0}
- {name: Weapon_Lsword_057, plus: 1, value: 42.0}
- {name: Weapon_Lsword_059, plus: 1, value: 43.33330154418945}
- {name: Weapon_Lsword_060, plus: 0, value: 46.0}
- {name: Weapon_Lsword_047, plus: -1, value: 48.0}
- {name: Weapon_Lsword_060, plus: 1, value: 52.0}
- {name: Weapon_Lsword_047, plus: 0, value: 61.33330154418945}
- {name: Weapon_Lsword_047, plus: 1, value: 71.33329772949219}
not_rank_up: true
series: UniqueSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_036, plus: -1, value: 10.0}
- {name: Weapon_Spear_021, plus: -1, value: 10.0}
- {name: Weapon_Spear_030, plus: -1, value: 12.0}
- {name: Weapon_Spear_022, plus: -1, value: 14.0}
- {name: Weapon_Spear_038, plus: -1, value: 16.0}
- {name: Weapon_Spear_036, plus: 0, value: 16.0}
- {name: Weapon_Spear_021, plus: 0, value: 18.0}
- {name: Weapon_Spear_036, plus: 1, value: 20.0}
- {name: Weapon_Spear_022, plus: 0, value: 20.0}
- {name: Weapon_Spear_038, plus: 0, value: 22.0}
- {name: Weapon_Spear_030, plus: 0, value: 22.0}
- {name: Weapon_Spear_022, plus: 1, value: 24.0}
- {name: Weapon_Spear_038, plus: 1, value: 26.0}
- {name: Weapon_Spear_021, plus: 1, value: 26.0}
- {name: Weapon_Spear_049, plus: -1, value: 28.0}
- {name: Weapon_Spear_030, plus: 1, value: 30.0}
- {name: Weapon_Spear_034, plus: -1, value: 40.0}
- {name: Weapon_Spear_049, plus: 0, value: 40.0}
- {name: Weapon_Spear_035, plus: -1, value: 44.0}
- {name: Weapon_Spear_033, plus: -1, value: 48.0}
- {name: Weapon_Spear_049, plus: 1, value: 50.0}
- {name: Weapon_Spear_034, plus: 0, value: 52.0}
- {name: Weapon_Spear_035, plus: 0, value: 58.0}
- {name: Weapon_Spear_023, plus: -1, value: 60.0}
- {name: Weapon_Spear_033, plus: 0, value: 62.0}
- {name: Weapon_Spear_034, plus: 1, value: 64.0}
- {name: Weapon_Spear_047, plus: -1, value: 64.0}
- {name: Weapon_Spear_035, plus: 1, value: 72.0}
- {name: Weapon_Spear_033, plus: 1, value: 78.0}
- {name: Weapon_Spear_023, plus: 0, value: 78.0}
- {name: Weapon_Spear_047, plus: 0, value: 84.0}
- {name: Weapon_Spear_023, plus: 1, value: 96.0}
- {name: Weapon_Spear_047, plus: 1, value: 102.0}
not_rank_up: true
series: UniqueSeries
- actorType: WeaponBow
actors:
- {name: Weapon_Bow_038, plus: -1, value: 4.0}
- {name: Weapon_Bow_038, plus: 0, value: 7.0}
- {name: Weapon_Bow_038, plus: 1, value: 10.0}
- {name: Weapon_Bow_072, plus: -1, value: 30.0}
- {name: Weapon_Bow_072, plus: 0, value: 35.0}
- {name: Weapon_Bow_072, plus: 1, value: 40.0}
- {name: Weapon_Bow_023, plus: -1, value: 44.0}
- {name: Weapon_Bow_033, plus: -1, value: 50.0}
- {name: Weapon_Bow_023, plus: 0, value: 51.0}
- {name: Weapon_Bow_033, plus: 0, value: 58.0}
- {name: Weapon_Bow_023, plus: 1, value: 58.0}
- {name: Weapon_Bow_033, plus: 1, value: 66.0}
- {name: Weapon_Bow_071, plus: -1, value: 100.0}
not_rank_up: true
series: UniqueSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_031, plus: -1, value: 3.0}
- {name: Weapon_Shield_021, plus: -1, value: 3.0}
- {name: Weapon_Shield_031, plus: 0, value: 7.0}
- {name: Weapon_Shield_021, plus: 0, value: 7.0}
- {name: Weapon_Shield_021, plus: 1, value: 10.0}
- {name: Weapon_Shield_031, plus: 1, value: 12.0}
- {name: Weapon_Shield_057, plus: -1, value: 65.0}
- {name: Weapon_Shield_033, plus: -1, value: 70.0}
- {name: Weapon_Shield_038, plus: -1, value: 70.0}
- {name: Weapon_Shield_057, plus: 0, value: 74.0}
- {name: Weapon_Shield_033, plus: 0, value: 80.0}
- {name: Weapon_Shield_038, plus: 0, value: 80.0}
- {name: Weapon_Shield_057, plus: 1, value: 83.0}
- {name: Weapon_Shield_030, plus: -1, value: 90.0}
- {name: Weapon_Shield_033, plus: 1, value: 90.0}
- {name: Weapon_Shield_038, plus: 1, value: 90.0}
- {name: Weapon_Shield_030, plus: 0, value: 113.0}
- {name: Weapon_Shield_030, plus: 1, value: 133.0}
not_rank_up: true
series: UniqueSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_041, plus: -1, value: 15.0}
- {name: Weapon_Sword_041, plus: 0, value: 20.0}
- {name: Weapon_Sword_041, plus: 1, value: 24.0}
not_rank_up: false
series: KakarikoSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_041, plus: -1, value: 21.33329963684082}
- {name: Weapon_Lsword_041, plus: 0, value: 24.66670036315918}
- {name: Weapon_Lsword_041, plus: 1, value: 27.33329963684082}
- {name: Weapon_Lsword_055, plus: -1, value: 33.33330154418945}
- {name: Weapon_Lsword_055, plus: 0, value: 38.0}
- {name: Weapon_Lsword_055, plus: 1, value: 43.33330154418945}
not_rank_up: false
series: KakarikoSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_037, plus: -1, value: 24.0}
- {name: Weapon_Spear_037, plus: 0, value: 34.0}
- {name: Weapon_Spear_037, plus: 1, value: 44.0}
not_rank_up: false
series: KakarikoSeries
- actorType: WeaponBow
actors:
- {name: Weapon_Bow_029, plus: -1, value: 10.0}
- {name: Weapon_Bow_029, plus: 0, value: 18.0}
- {name: Weapon_Bow_029, plus: 1, value: 23.0}
not_rank_up: false
series: KakarikoSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_041, plus: -1, value: 16.0}
- {name: Weapon_Shield_041, plus: 0, value: 25.0}
- {name: Weapon_Shield_041, plus: 1, value: 34.0}
not_rank_up: false
series: KakarikoSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_044, plus: -1, value: 2.0}
- {name: Weapon_Sword_044, plus: 0, value: 4.0}
- {name: Weapon_Sword_044, plus: 1, value: 5.0}
not_rank_up: true
series: AreaSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_060, plus: -1, value: 5.0}
- {name: Weapon_Sword_060, plus: 0, value: 8.0}
- {name: Weapon_Sword_048, plus: -1, value: 10.0}
- {name: Weapon_Sword_060, plus: 1, value: 11.0}
- {name: Weapon_Sword_048, plus: 0, value: 16.0}
- {name: Weapon_Sword_048, plus: 1, value: 21.0}
not_rank_up: false
series: FireRodSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_061, plus: -1, value: 5.0}
- {name: Weapon_Sword_061, plus: 0, value: 8.0}
- {name: Weapon_Sword_049, plus: -1, value: 10.0}
- {name: Weapon_Sword_061, plus: 1, value: 11.0}
- {name: Weapon_Sword_049, plus: 0, value: 15.0}
- {name: Weapon_Sword_049, plus: 1, value: 21.0}
not_rank_up: false
series: IceRodSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_062, plus: -1, value: 5.0}
- {name: Weapon_Sword_062, plus: 0, value: 8.0}
- {name: Weapon_Sword_050, plus: -1, value: 10.0}
- {name: Weapon_Sword_062, plus: 1, value: 11.0}
- {name: Weapon_Sword_050, plus: 0, value: 15.0}
- {name: Weapon_Sword_050, plus: 1, value: 21.0}
not_rank_up: false
series: ElectricRodSeries
- actorType: WeaponSmallSword
actors:
- {name: Weapon_Sword_053, plus: -1, value: 16.0}
- {name: Weapon_Sword_053, plus: 0, value: 21.0}
- {name: Weapon_Sword_053, plus: 1, value: 26.0}
- {name: Weapon_Sword_073, plus: -1, value: 40.0}
- {name: Weapon_Sword_073, plus: 0, value: 50.0}
- {name: Weapon_Sword_073, plus: 1, value: 61.0}
not_rank_up: false
series: AssassinSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_074, plus: -1, value: 26.66670036315918}
- {name: Weapon_Lsword_074, plus: 0, value: 30.66670036315918}
- {name: Weapon_Lsword_074, plus: 1, value: 34.0}
not_rank_up: false
series: AssassinSeries
- actorType: WeaponBow
actors:
- {name: Weapon_Bow_040, plus: -1, value: 14.0}
- {name: Weapon_Bow_040, plus: 0, value: 17.0}
- {name: Weapon_Bow_040, plus: 1, value: 19.0}
not_rank_up: false
series: AssassinSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_010, plus: -1, value: 6.0}
- {name: Weapon_Lsword_010, plus: 0, value: 10.66670036315918}
- {name: Weapon_Lsword_010, plus: 1, value: 14.66670036315918}
- {name: Weapon_Lsword_011, plus: -1, value: 18.0}
- {name: Weapon_Lsword_011, plus: 0, value: 22.66670036315918}
- {name: Weapon_Lsword_011, plus: 1, value: 26.66670036315918}
- {name: Weapon_Lsword_012, plus: -1, value: 30.0}
- {name: Weapon_Lsword_012, plus: 0, value: 34.66669845581055}
- {name: Weapon_Lsword_012, plus: 1, value: 40.0}
not_rank_up: false
series: MoriblinSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_010, plus: -1, value: 8.0}
- {name: Weapon_Spear_010, plus: 0, value: 12.0}
- {name: Weapon_Spear_010, plus: 1, value: 16.0}
- {name: Weapon_Spear_011, plus: -1, value: 18.0}
- {name: Weapon_Spear_011, plus: 0, value: 22.0}
- {name: Weapon_Spear_011, plus: 1, value: 26.0}
- {name: Weapon_Spear_012, plus: -1, value: 30.0}
- {name: Weapon_Spear_012, plus: 0, value: 36.0}
- {name: Weapon_Spear_012, plus: 1, value: 42.0}
not_rank_up: false
series: MoriblinSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_032, plus: -1, value: 2.0}
- {name: Weapon_Lsword_032, plus: 0, value: 3.3333001136779785}
- {name: Weapon_Lsword_032, plus: 1, value: 5.3333001136779785}
- {name: Weapon_Lsword_030, plus: -1, value: 12.0}
- {name: Weapon_Lsword_030, plus: 0, value: 20.0}
- {name: Weapon_Lsword_030, plus: 1, value: 24.66670036315918}
not_rank_up: false
series: AxSeries
- actorType: WeaponLargeSword
actors:
- {name: Weapon_Lsword_036, plus: -1, value: 10.0}
- {name: Weapon_Lsword_036, plus: 0, value: 16.66670036315918}
- {name: Weapon_Lsword_036, plus: 1, value: 23.33329963684082}
- {name: Weapon_Lsword_037, plus: -1, value: 28.0}
- {name: Weapon_Lsword_037, plus: 0, value: 32.66669845581055}
- {name: Weapon_Lsword_037, plus: 1, value: 36.66669845581055}
not_rank_up: false
series: GoronSeries
- actorType: WeaponSpear
actors:
- {name: Weapon_Spear_031, plus: -1, value: 28.0}
- {name: Weapon_Spear_031, plus: 0, value: 40.0}
- {name: Weapon_Spear_031, plus: 1, value: 50.0}
not_rank_up: false
series: GoronSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_032, plus: -1, value: 3.0}
- {name: Weapon_Shield_032, plus: 0, value: 7.0}
- {name: Weapon_Shield_032, plus: 1, value: 12.0}
not_rank_up: false
series: SouthernSeries
- actorType: WeaponShield
actors:
- {name: Weapon_Shield_034, plus: -1, value: 3.0}
- {name: Weapon_Shield_034, plus: 0, value: 7.0}
- {name: Weapon_Shield_034, plus: 1, value: 12.0}
not_rank_up: false
series: HatenoSeries

*/
