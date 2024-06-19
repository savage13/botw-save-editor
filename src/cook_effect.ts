export enum CookEffect {
  None,
  ResistHot,
  ResistCold,
  ResistElectric,
  AttackUp,
  DefenseUp,
  Quietness,
  AllSpeed,
  Fireproof,
  GutsRecover,
  ExGutsMaxUp,
  LifeMaxUp
}
export const CookEffectValues: { [key: number]: CookEffect } = {
  2.0: CookEffect.LifeMaxUp,
  4.0: CookEffect.ResistHot,
  5.0: CookEffect.ResistCold,
  6.0: CookEffect.ResistElectric,
  10.0: CookEffect.AttackUp,
  11.0: CookEffect.DefenseUp,
  12.0: CookEffect.Quietness,
  13.0: CookEffect.AllSpeed,
  14.0: CookEffect.GutsRecover,
  15.0: CookEffect.ExGutsMaxUp,
  16.0: CookEffect.Fireproof,
};
CookEffectValues[-1.0] = CookEffect.None
export const CookEffectKeys: { [key: string]: number } = {
  None: -1,
  LifeMaxUp: 2.0,
  ResistHot: 4.0,
  ResistCold: 5.0,
  ResistElectric: 6.0,
  AttackUp: 10.0,
  DefenseUp: 11.0,
  Quietness: 12.0,
  AllSpeed: 13.0,
  GutsRecover: 14.0,
  ExGutsMaxUp: 15.0,
  Fireproof: 16.0,
};

