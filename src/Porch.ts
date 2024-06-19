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

export enum PorchName {
  None,
  // Bow
  Bow_Start,
  Weapon_Bow_001, Weapon_Bow_002, Weapon_Bow_003, Weapon_Bow_004, Weapon_Bow_006,
  Weapon_Bow_009, Weapon_Bow_011, Weapon_Bow_013, Weapon_Bow_014, Weapon_Bow_015,
  Weapon_Bow_016, Weapon_Bow_017, Weapon_Bow_023, Weapon_Bow_026, Weapon_Bow_027,
  Weapon_Bow_028, Weapon_Bow_029, Weapon_Bow_030, Weapon_Bow_032, Weapon_Bow_033,
  Weapon_Bow_035, Weapon_Bow_036, Weapon_Bow_038, Weapon_Bow_040, Weapon_Bow_071,
  Weapon_Bow_072,
  Bow_End,
  // Weapon
  Weapon_Start,
  Weapon_Sword_001, Weapon_Sword_002, Weapon_Sword_003, Weapon_Sword_004, Weapon_Sword_005,
  Weapon_Sword_006, Weapon_Sword_007, Weapon_Sword_008, Weapon_Sword_009, Weapon_Sword_013,
  Weapon_Sword_014, Weapon_Sword_015, Weapon_Sword_016, Weapon_Sword_017, Weapon_Sword_018,
  Weapon_Sword_019, Weapon_Sword_020, Weapon_Sword_021, Weapon_Sword_022, Weapon_Sword_023,
  Weapon_Sword_024, Weapon_Sword_025, Weapon_Sword_027, Weapon_Sword_029, Weapon_Sword_030,
  Weapon_Sword_031, Weapon_Sword_033, Weapon_Sword_034, Weapon_Sword_035, Weapon_Sword_040,
  Weapon_Sword_041, Weapon_Sword_043, Weapon_Sword_044, Weapon_Sword_047, Weapon_Sword_048,
  Weapon_Sword_049, Weapon_Sword_050, Weapon_Sword_051, Weapon_Sword_052, Weapon_Sword_053,
  Weapon_Sword_057, Weapon_Sword_058, Weapon_Sword_059, Weapon_Sword_060, Weapon_Sword_061,
  Weapon_Sword_062, Weapon_Sword_070, Weapon_Sword_073, Weapon_Sword_080, Weapon_Sword_081,
  Weapon_Sword_502, Weapon_Sword_503, Weapon_Sword_DemoCheck,
  Weapon_Lsword_001, Weapon_Lsword_002, Weapon_Lsword_003, Weapon_Lsword_004, Weapon_Lsword_005,
  Weapon_Lsword_006, Weapon_Lsword_010, Weapon_Lsword_011, Weapon_Lsword_012, Weapon_Lsword_013,
  Weapon_Lsword_014, Weapon_Lsword_015, Weapon_Lsword_016, Weapon_Lsword_017, Weapon_Lsword_018,
  Weapon_Lsword_019, Weapon_Lsword_020, Weapon_Lsword_023, Weapon_Lsword_024, Weapon_Lsword_027,
  Weapon_Lsword_029, Weapon_Lsword_030, Weapon_Lsword_031, Weapon_Lsword_032, Weapon_Lsword_033,
  Weapon_Lsword_034, Weapon_Lsword_035, Weapon_Lsword_036, Weapon_Lsword_037, Weapon_Lsword_038,
  Weapon_Lsword_041, Weapon_Lsword_045, Weapon_Lsword_047, Weapon_Lsword_051, Weapon_Lsword_054,
  Weapon_Lsword_055, Weapon_Lsword_056, Weapon_Lsword_057, Weapon_Lsword_059, Weapon_Lsword_060,
  Weapon_Lsword_074,
  Weapon_Spear_001,
  Weapon_Spear_002, Weapon_Spear_003, Weapon_Spear_004, Weapon_Spear_005, Weapon_Spear_006,
  Weapon_Spear_007, Weapon_Spear_008, Weapon_Spear_009, Weapon_Spear_010, Weapon_Spear_011,
  Weapon_Spear_012, Weapon_Spear_013, Weapon_Spear_014, Weapon_Spear_015, Weapon_Spear_016,
  Weapon_Spear_017, Weapon_Spear_018, Weapon_Spear_021, Weapon_Spear_022, Weapon_Spear_023,
  Weapon_Spear_024, Weapon_Spear_025, Weapon_Spear_027, Weapon_Spear_028, Weapon_Spear_029,
  Weapon_Spear_030, Weapon_Spear_031, Weapon_Spear_032, Weapon_Spear_033, Weapon_Spear_034,
  Weapon_Spear_035, Weapon_Spear_036, Weapon_Spear_037, Weapon_Spear_038, Weapon_Spear_047,
  Weapon_Spear_049, Weapon_Spear_050,
  Weapon_End,
  // Shield
  Shield_Start,
  Weapon_Shield_001, Weapon_Shield_002, Weapon_Shield_003, Weapon_Shield_004, Weapon_Shield_005,
  Weapon_Shield_006, Weapon_Shield_007, Weapon_Shield_008, Weapon_Shield_009, Weapon_Shield_013,
  Weapon_Shield_014, Weapon_Shield_015, Weapon_Shield_016, Weapon_Shield_017, Weapon_Shield_018,
  Weapon_Shield_021, Weapon_Shield_022, Weapon_Shield_023, Weapon_Shield_025, Weapon_Shield_026,
  Weapon_Shield_030, Weapon_Shield_031, Weapon_Shield_032, Weapon_Shield_033, Weapon_Shield_034,
  Weapon_Shield_035, Weapon_Shield_036, Weapon_Shield_037, Weapon_Shield_038, Weapon_Shield_040,
  Weapon_Shield_041, Weapon_Shield_042, Weapon_Shield_057,
  Shield_End,
  // Arrow
  Arrow_Start,
  AncientArrow, BombArrow_A, ElectricArrow, FireArrow, IceArrow, NormalArrow,
  Arrow_End,
  // Armor
  Armor_Start,
  Armor_001_Head, Armor_001_Lower, Armor_001_Upper, Armor_002_Head, Armor_002_Lower,
  Armor_002_Upper, Armor_003_Head, Armor_003_Lower, Armor_003_Upper, Armor_004_Head,
  Armor_004_Lower, Armor_004_Upper, Armor_005_Head, Armor_005_Lower, Armor_005_Upper,
  Armor_006_Head, Armor_006_Lower, Armor_006_Upper, Armor_007_Head, Armor_007_Lower,
  Armor_007_Upper, Armor_008_Head, Armor_008_Lower, Armor_008_Upper, Armor_009_Head,
  Armor_009_Lower, Armor_009_Upper, Armor_011_Head, Armor_011_Lower, Armor_011_Upper,
  Armor_012_Head, Armor_012_Lower, Armor_012_Upper, Armor_014_Head, Armor_014_Lower,
  Armor_014_Upper, Armor_015_Head, Armor_015_Lower, Armor_015_Upper, Armor_017_Head,
  Armor_017_Lower, Armor_017_Upper, Armor_020_Head, Armor_020_Lower, Armor_020_Upper,
  Armor_021_Head, Armor_021_Lower, Armor_021_Upper, Armor_022_Head, Armor_024_Head,
  Armor_025_Head, Armor_026_Head, Armor_027_Head, Armor_028_Head, Armor_029_Head,
  Armor_035_Head, Armor_035_Lower, Armor_035_Upper, Armor_036_Head, Armor_036_Lower,
  Armor_036_Upper, Armor_037_Head, Armor_037_Lower, Armor_037_Upper, Armor_039_Head,
  Armor_039_Lower, Armor_039_Upper, Armor_040_Head, Armor_040_Lower, Armor_040_Upper,
  Armor_042_Head, Armor_042_Lower, Armor_042_Upper, Armor_043_Lower, Armor_043_Upper,
  Armor_044_Upper, Armor_045_Head, Armor_046_Head, Armor_046_Lower, Armor_046_Upper,
  Armor_048_Head, Armor_048_Lower, Armor_048_Upper, Armor_049_Lower, Armor_053_Head,
  Armor_053_Lower, Armor_053_Upper, Armor_055_Head, Armor_056_Head, Armor_060_Head,
  Armor_060_Lower, Armor_060_Upper, Armor_061_Head, Armor_061_Lower, Armor_061_Upper,
  Armor_062_Head, Armor_062_Lower, Armor_062_Upper, Armor_063_Head, Armor_063_Lower,
  Armor_063_Upper, Armor_064_Head, Armor_064_Lower, Armor_064_Upper, Armor_065_Head,
  Armor_065_Lower, Armor_065_Upper, Armor_066_Head, Armor_066_Lower, Armor_066_Upper,
  Armor_067_Head, Armor_067_Lower, Armor_067_Upper, Armor_071_Head, Armor_071_Lower,
  Armor_071_Upper, Armor_072_Head, Armor_072_Lower, Armor_072_Upper, Armor_073_Head,
  Armor_073_Lower, Armor_073_Upper, Armor_074_Head, Armor_074_Lower, Armor_074_Upper,
  Armor_075_Head, Armor_075_Lower, Armor_075_Upper, Armor_076_Head, Armor_076_Lower,
  Armor_076_Upper, Armor_077_Head, Armor_077_Lower, Armor_077_Upper, Armor_078_Head,
  Armor_078_Lower, Armor_078_Upper, Armor_079_Head, Armor_079_Lower, Armor_079_Upper,
  Armor_083_Head, Armor_083_Lower, Armor_083_Upper, Armor_084_Head, Armor_084_Lower,
  Armor_084_Upper, Armor_085_Head, Armor_085_Lower, Armor_085_Upper, Armor_086_Head,
  Armor_086_Lower, Armor_086_Upper, Armor_087_Head, Armor_087_Lower, Armor_087_Upper,
  Armor_088_Head, Armor_088_Lower, Armor_088_Upper, Armor_089_Head, Armor_089_Lower,
  Armor_089_Upper, Armor_090_Head, Armor_090_Lower, Armor_090_Upper, Armor_095_Head,
  Armor_095_Lower, Armor_095_Upper, Armor_096_Head, Armor_096_Lower, Armor_096_Upper,
  Armor_097_Head, Armor_097_Lower, Armor_097_Upper, Armor_098_Head, Armor_098_Lower,
  Armor_098_Upper, Armor_099_Head, Armor_099_Lower, Armor_099_Upper, Armor_100_Head,
  Armor_100_Lower, Armor_100_Upper, Armor_101_Head, Armor_101_Lower, Armor_101_Upper,
  Armor_102_Head, Armor_102_Lower, Armor_102_Upper, Armor_103_Head, Armor_103_Lower,
  Armor_103_Upper, Armor_104_Head, Armor_104_Lower, Armor_104_Upper, Armor_105_Head,
  Armor_105_Lower, Armor_105_Upper, Armor_106_Head, Armor_106_Lower, Armor_106_Upper,
  Armor_111_Head, Armor_111_Lower, Armor_111_Upper, Armor_112_Head, Armor_112_Lower,
  Armor_112_Upper, Armor_113_Head, Armor_113_Lower, Armor_113_Upper, Armor_114_Head,
  Armor_114_Lower, Armor_114_Upper, Armor_115_Head, Armor_116_Upper, Armor_117_Head,
  Armor_118_Head, Armor_119_Head, Armor_120_Head, Armor_121_Head, Armor_122_Head,
  Armor_123_Head, Armor_124_Head, Armor_125_Head, Armor_126_Head, Armor_127_Head,
  Armor_128_Head, Armor_129_Head, Armor_130_Head, Armor_131_Head, Armor_132_Head,
  Armor_133_Head, Armor_134_Head, Armor_135_Head, Armor_136_Head, Armor_137_Head,
  Armor_138_Head, Armor_139_Head, Armor_140_Head, Armor_140_Lower, Armor_141_Lower,
  Armor_148_Upper, Armor_149_Upper, Armor_150_Upper, Armor_151_Upper, Armor_152_Lower,
  Armor_153_Lower, Armor_154_Lower, Armor_155_Lower, Armor_156_Lower, Armor_157_Lower,
  Armor_158_Lower, Armor_159_Lower, Armor_160_Head, Armor_160_Lower, Armor_160_Upper,
  Armor_168_Head, Armor_169_Head, Armor_170_Upper, Armor_171_Head, Armor_171_Lower,
  Armor_171_Upper, Armor_172_Head, Armor_173_Head, Armor_174_Head, Armor_174_Lower,
  Armor_174_Upper, Armor_175_Upper, Armor_176_Head, Armor_177_Head, Armor_178_Head,
  Armor_179_Head, Armor_179_Lower, Armor_179_Upper, Armor_180_Head, Armor_180_Lower,
  Armor_180_Upper, Armor_181_Head, Armor_182_Head, Armor_183_Head, Armor_184_Head,
  Armor_185_Head, Armor_185_Lower, Armor_185_Upper, Armor_186_Head, Armor_187_Head,
  Armor_188_Head, Armor_189_Head, Armor_190_Head, Armor_191_Head, Armor_192_Head,
  Armor_193_Head, Armor_194_Head, Armor_195_Head, Armor_196_Head, Armor_197_Head,
  Armor_198_Head, Armor_199_Head, Armor_200_Head, Armor_200_Lower, Armor_200_Upper,
  Armor_201_Head, Armor_201_Lower, Armor_201_Upper, Armor_202_Head, Armor_202_Lower,
  Armor_202_Upper, Armor_203_Head, Armor_203_Lower, Armor_203_Upper, Armor_204_Head,
  Armor_204_Lower, Armor_204_Upper, Armor_205_Head, Armor_205_Lower, Armor_205_Upper,
  Armor_206_Head, Armor_206_Lower, Armor_206_Upper, Armor_207_Head, Armor_207_Lower,
  Armor_207_Upper, Armor_208_Head, Armor_208_Lower, Armor_208_Upper, Armor_209_Head,
  Armor_209_Lower, Armor_209_Upper, Armor_210_Head, Armor_210_Lower, Armor_210_Upper,
  Armor_211_Head, Armor_211_Lower, Armor_211_Upper, Armor_212_Head, Armor_212_Lower,
  Armor_212_Upper, Armor_213_Head, Armor_213_Lower, Armor_213_Upper, Armor_214_Head,
  Armor_214_Lower, Armor_214_Upper, Armor_215_Head, Armor_215_Lower, Armor_215_Upper,
  Armor_216_Head, Armor_216_Lower, Armor_216_Upper, Armor_217_Head, Armor_217_Lower,
  Armor_217_Upper, Armor_218_Head, Armor_218_Lower, Armor_218_Upper, Armor_219_Head,
  Armor_219_Lower, Armor_219_Upper, Armor_220_Head, Armor_221_Head, Armor_222_Head,
  Armor_223_Head, Armor_224_Head, Armor_225_Head, Armor_225_Lower, Armor_225_Upper,
  Armor_226_Head, Armor_226_Lower, Armor_226_Upper, Armor_227_Head, Armor_227_Lower,
  Armor_227_Upper, Armor_228_Head, Armor_228_Lower, Armor_228_Upper, Armor_229_Head,
  Armor_229_Lower, Armor_229_Upper, Armor_230_Head, Armor_230_Lower, Armor_230_Upper,
  Armor_231_Head, Armor_231_Lower, Armor_231_Upper, Armor_232_Head, Armor_232_Lower,
  Armor_232_Upper, Armor_233_Head, Armor_233_Lower, Armor_233_Upper, Armor_234_Head,
  Armor_234_Lower, Armor_234_Upper, Armor_500_Head, Armor_500_Lower, Armor_500_Upper,
  Armor_501_Head, Armor_501_Lower, Armor_501_Upper, Armor_502_Upper, Armor_503_Head,
  Armor_Default_Head, Armor_Default_Upper,
  Armor_End,
  // Cook
  Item_Cook_Start,
  Item_Boiled_01,
  Item_ChilledFish_01, Item_ChilledFish_02, Item_ChilledFish_03, Item_ChilledFish_04, Item_ChilledFish_05,
  Item_ChilledFish_06, Item_ChilledFish_07, Item_ChilledFish_08, Item_ChilledFish_09,
  Item_Chilled_01, Item_Chilled_02, Item_Chilled_03, Item_Chilled_04, Item_Chilled_05, Item_Chilled_06,
  Item_Cook_A_01, Item_Cook_A_02, Item_Cook_A_03, Item_Cook_A_04, Item_Cook_A_05,
  Item_Cook_A_07, Item_Cook_A_08, Item_Cook_A_09, Item_Cook_A_10, Item_Cook_A_11,
  Item_Cook_A_12, Item_Cook_A_13, Item_Cook_A_14, Item_Cook_B_01, Item_Cook_B_02,
  Item_Cook_B_03, Item_Cook_B_04, Item_Cook_B_05, Item_Cook_B_06, Item_Cook_B_11,
  Item_Cook_B_12, Item_Cook_B_13, Item_Cook_B_14, Item_Cook_B_15, Item_Cook_B_16,
  Item_Cook_B_17, Item_Cook_B_18, Item_Cook_B_19, Item_Cook_B_20, Item_Cook_B_21,
  Item_Cook_B_22, Item_Cook_B_23, Item_Cook_C_01, Item_Cook_C_02, Item_Cook_C_05,
  Item_Cook_C_06, Item_Cook_C_07, Item_Cook_C_08, Item_Cook_C_11, Item_Cook_C_12,
  Item_Cook_C_13, Item_Cook_C_14, Item_Cook_C_15, Item_Cook_C_16, Item_Cook_C_17,
  Item_Cook_C_17_00, Item_Cook_D_01, Item_Cook_D_02, Item_Cook_D_03, Item_Cook_D_04,
  Item_Cook_D_05, Item_Cook_D_06, Item_Cook_D_07, Item_Cook_D_08, Item_Cook_D_09,
  Item_Cook_D_10, Item_Cook_E_01, Item_Cook_E_02, Item_Cook_E_03, Item_Cook_E_04,
  Item_Cook_F_01, Item_Cook_F_02, Item_Cook_F_03, Item_Cook_F_04, Item_Cook_G_02,
  Item_Cook_G_03, Item_Cook_G_04, Item_Cook_G_05, Item_Cook_G_06, Item_Cook_G_07,
  Item_Cook_G_08, Item_Cook_G_09, Item_Cook_G_10, Item_Cook_G_11, Item_Cook_G_12,
  Item_Cook_G_13, Item_Cook_G_14, Item_Cook_G_15, Item_Cook_G_16, Item_Cook_G_17,
  Item_Cook_H_01, Item_Cook_H_02, Item_Cook_H_03, Item_Cook_I_01, Item_Cook_I_02,
  Item_Cook_I_03, Item_Cook_I_04, Item_Cook_I_05, Item_Cook_I_06, Item_Cook_I_07,
  Item_Cook_I_08, Item_Cook_I_09, Item_Cook_I_10, Item_Cook_I_11, Item_Cook_I_12,
  Item_Cook_I_13, Item_Cook_I_14, Item_Cook_I_15, Item_Cook_I_16, Item_Cook_I_17,
  Item_Cook_J_01, Item_Cook_J_02, Item_Cook_J_03, Item_Cook_J_04, Item_Cook_J_05,
  Item_Cook_J_06, Item_Cook_J_07, Item_Cook_J_08, Item_Cook_J_09, Item_Cook_K_01,
  Item_Cook_K_02, Item_Cook_K_03, Item_Cook_K_04, Item_Cook_K_05, Item_Cook_K_06,
  Item_Cook_K_07, Item_Cook_K_08, Item_Cook_K_09, Item_Cook_L_01, Item_Cook_L_02,
  Item_Cook_L_03, Item_Cook_L_04, Item_Cook_L_05, Item_Cook_M_01, Item_Cook_N_01,
  Item_Cook_N_02, Item_Cook_N_03, Item_Cook_N_04, Item_Cook_O_01, Item_Cook_O_02,
  Item_Cook_P_01, Item_Cook_P_02, Item_Cook_P_03, Item_Cook_P_04, Item_Cook_P_05,
  Item_RoastFish_01, Item_RoastFish_02, Item_RoastFish_03, Item_RoastFish_04, Item_RoastFish_07,
  Item_RoastFish_09, Item_RoastFish_11, Item_RoastFish_13, Item_RoastFish_15, Item_RoastFish_Template,
  Item_Roast_01, Item_Roast_02, Item_Roast_03, Item_Roast_04, Item_Roast_05,
  Item_Roast_06, Item_Roast_07, Item_Roast_08, Item_Roast_09, Item_Roast_10,
  Item_Roast_11, Item_Roast_12, Item_Roast_13, Item_Roast_15, Item_Roast_16,
  Item_Roast_18, Item_Roast_19, Item_Roast_24, Item_Roast_27, Item_Roast_28,
  Item_Roast_31, Item_Roast_32, Item_Roast_33, Item_Roast_36, Item_Roast_37,
  Item_Roast_38, Item_Roast_39, Item_Roast_40, Item_Roast_41, Item_Roast_45,
  Item_Roast_46, Item_Roast_48, Item_Roast_49, Item_Roast_50, Item_Roast_51,
  Item_Roast_52, Item_Roast_53,
  Item_Cook_End,
  // Material
  Item_Material_Start,
  Animal_Insect_A, Animal_Insect_AA, Animal_Insect_AB, Animal_Insect_B, Animal_Insect_C,
  Animal_Insect_E, Animal_Insect_F, Animal_Insect_G, Animal_Insect_H, Animal_Insect_I,
  Animal_Insect_M, Animal_Insect_N, Animal_Insect_P, Animal_Insect_Q, Animal_Insect_R,
  Animal_Insect_S, Animal_Insect_T, Animal_Insect_X,
  Item_Enemy_00, Item_Enemy_01, Item_Enemy_02, Item_Enemy_03, Item_Enemy_04,
  Item_Enemy_05, Item_Enemy_06, Item_Enemy_07, Item_Enemy_08, Item_Enemy_12,
  Item_Enemy_13, Item_Enemy_14, Item_Enemy_15, Item_Enemy_16, Item_Enemy_17,
  Item_Enemy_18, Item_Enemy_19, Item_Enemy_20, Item_Enemy_21, Item_Enemy_24,
  Item_Enemy_25, Item_Enemy_26, Item_Enemy_27, Item_Enemy_28, Item_Enemy_29,
  Item_Enemy_30, Item_Enemy_31, Item_Enemy_32, Item_Enemy_33, Item_Enemy_34,
  Item_Enemy_38, Item_Enemy_39, Item_Enemy_40, Item_Enemy_41, Item_Enemy_42,
  Item_Enemy_43, Item_Enemy_44, Item_Enemy_45, Item_Enemy_46, Item_Enemy_47,
  Item_Enemy_48, Item_Enemy_49, Item_Enemy_50, Item_Enemy_51, Item_Enemy_52,
  Item_Enemy_53, Item_Enemy_54, Item_Enemy_55, Item_Enemy_56, Item_Enemy_57,
  Item_Enemy_Living_Template,
  Item_Enemy_Nonburnable_Template,
  Item_Enemy_Normal_Template,
  Item_FishGet_A, Item_FishGet_B, Item_FishGet_C, Item_FishGet_D, Item_FishGet_E,
  Item_FishGet_F, Item_FishGet_G, Item_FishGet_H, Item_FishGet_I, Item_FishGet_J,
  Item_FishGet_K, Item_FishGet_L, Item_FishGet_L_00, Item_FishGet_M, Item_FishGet_X,
  Item_FishGet_Z,
  Item_Fruit_A, Item_Fruit_B, Item_Fruit_C, Item_Fruit_D, Item_Fruit_E,
  Item_Fruit_E_00, Item_Fruit_F, Item_Fruit_G, Item_Fruit_H, Item_Fruit_I,
  Item_Fruit_J, Item_Fruit_K, Item_Fruit_L, Item_Fruit_Template,
  Item_InsectGet_K, Item_InsectGet_O, Item_InsectGet_Z,
  Item_Material_01, Item_Material_02, Item_Material_03, Item_Material_04, Item_Material_05,
  Item_Material_05_00, Item_Material_06, Item_Material_07, Item_Material_08,
  Item_Material_Template,
  Item_Meat_01, Item_Meat_02, Item_Meat_06, Item_Meat_07, Item_Meat_11,
  Item_Meat_12, Item_Meat_Template,
  Item_MushroomGet_D, Item_Mushroom_A, Item_Mushroom_B, Item_Mushroom_C, Item_Mushroom_E,
  Item_Mushroom_F, Item_Mushroom_F_00, Item_Mushroom_H, Item_Mushroom_J, Item_Mushroom_L,
  Item_Mushroom_M, Item_Mushroom_N, Item_Mushroom_N_00, Item_Mushroom_O, Item_Mushroom_Template,
  Item_Ore_A, Item_Ore_A_00, Item_Ore_B, Item_Ore_C, Item_Ore_D, Item_Ore_E,
  Item_Ore_F, Item_Ore_G, Item_Ore_H, Item_Ore_I, Item_Ore_J, Item_Ore_Template,
  Item_PlantGet_A, Item_PlantGet_B, Item_PlantGet_C, Item_PlantGet_E, Item_PlantGet_F,
  Item_PlantGet_G, Item_PlantGet_H, Item_PlantGet_I, Item_PlantGet_J, Item_PlantGet_L,
  Item_PlantGet_M, Item_PlantGet_O, Item_PlantGet_Q, Item_Plant_Get_Template,
  Item_Plant_RootVegetable_Template, Item_Plant_Template,
  Obj_FireWoodBundle, BeeHome,

  Item_Material_End,
  // KeyItem
  Item_Key_Start,
  Obj_Album,
  Obj_Armor_115_Head,
  Obj_Camera,
  Obj_DLC_HeroSeal_Gerudo,
  Obj_DLC_HeroSeal_Goron,
  Obj_DLC_HeroSeal_Rito,
  Obj_DLC_HeroSeal_Zora,
  Obj_DLC_HeroSoul_Gerudo,
  Obj_DLC_HeroSoul_Goron,
  Obj_DLC_HeroSoul_Rito,
  Obj_DLC_HeroSoul_Zora,
  Obj_DRStone_A_01,
  Obj_DRStone_Get,
  Obj_DungeonClearSeal, // Spirit Orb
  //Obj_HeartUtuwa_A_01, // Heart Container
  Obj_HeroSoul_Gerudo,
  Obj_HeroSoul_Goron,
  Obj_HeroSoul_Rito,
  Obj_HeroSoul_Zora,
  //Obj_IceMaker, // Cryonis
  Obj_KorokNuts,
  //Obj_Magnetglove, // Magnesis
  Obj_Maracas,
  Obj_Motorcycle,
  //Obj_Photo_Animal,
  //Obj_Photo_BossEnemy,
  //Obj_Photo_Enemy,
  //Obj_Photo_Material,
  //Obj_Photo_Other,
  //Obj_Photo_Weapon,
  Obj_PictureBook,
  //Obj_Porch_Bow,
  //Obj_Porch_Shield,
  //Obj_Porch_Weapon,
  Obj_ProofBook, // Classified Enevelope
  Obj_ProofGiantKiller, // Medal
  Obj_ProofGolemKiller, // Medal
  Obj_ProofSandwormKiller, // Medal
  Obj_ProofKorok, // Poop
  //Obj_RemainInsideMap, // Relic Map
  //Obj_RemoteBomb, // Bombs
  //Obj_RemoteBombBall,
  //Obj_RemoteBombBall2,
  //Obj_RemoteBombCube,
  //Obj_RemoteBombCube2,
  //Obj_RemoteBombLv2,
  Obj_SheikPadLv2, // Sheikah Slate
  Obj_SheikSensor, // Sheikah Slate
  Obj_SheikSensorLv2, // Sheikah Slate
  // Obj_StaminaUtuwa_A_01,
  //Obj_StopTimer, // Static
  //Obj_StopTimerLv2,
  Obj_WarpDLC, // Travel Medallion
  PlayerStole2, // Paraglider 
  Dm_PlayerStole2, // Paraglider 
  GameRomHorseReins_01, GameRomHorseReins_02, GameRomHorseReins_03,
  GameRomHorseReins_04, GameRomHorseReins_05, GameRomHorseReins_10,
  GameRomHorseSaddle_01, GameRomHorseSaddle_02, GameRomHorseSaddle_03,
  GameRomHorseSaddle_04, GameRomHorseSaddle_05, GameRomHorseSaddle_10,
  Item_Key_End,
}

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
    this._name = PorchName[this._pname] as string
    this.ptype = to_porch_type(this._pname)
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
/*
function array_compare(a: any, b: any) {
  if (!a || !b) {
    console.log("not things")
    return false
  }
  if (!Array.isArray(a) || !Array.isArray(b)) {
    console.log("not arrays")
    return false
  }
  if (a == b) {
    return true
  }
  if (a.length != b.length) {
    console.log("lengths differ", a.length, b.length)
    return false
  }
  const n = a.length
  for (let i = 0; i < n; i++) {
    if (a[i] != b[i]) {
      console.log(a)
      console.log(b)
      return false
    }
  }
  return true
}
*/

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
/*
function ignore() {
  const PorchBow_FlagSp = [13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const PorchBow_ValueSp = [16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const _PorchItem = ["Weapon_Sword_044", "Weapon_Sword_044", "Weapon_Sword_044", "Weapon_Sword_044", "Weapon_Sword_043", "Weapon_Lsword_032", "Weapon_Bow_001", "NormalArrow", "Weapon_Shield_040", "Item_Mushroom_E", "Item_Fruit_I", "Item_Roast_01", "Obj_DRStone_Get"]
  const PorchItem_EquipFlag: any = [false, false, false, false, false, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  const PorchItem_Value1: any = [400, 400, 400, 400, 800, 4700, 2200, 5, 400, 2, 6, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const PorchShield_FlagSp = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const PorchShield_ValueSp = [7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const PorchSword_FlagSp = [4, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const PorchSword_ValueSp = [10, 11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

function ignore2() {
  const items = arrays_to_porch(_PorchItem, PorchItem_Value1, PorchItem_EquipFlag,
    PorchSword_FlagSp, PorchBow_FlagSp, PorchShield_FlagSp,
    PorchSword_ValueSp, PorchBow_ValueSp, PorchShield_ValueSp
  )
  const z = porch_to_arrays(items)

  console.log('names     ', array_compare(z.names, _PorchItem))
  console.log('value     ', array_compare(z.value, PorchItem_Value1))
  console.log('equip     ', array_compare(z.equip, PorchItem_EquipFlag))
  console.log('bow    fsp', array_compare(z.flag_sp.data[PorchType.Bow], PorchBow_FlagSp))
  console.log('sword  fsp', array_compare(z.flag_sp.data[PorchType.Weapon], PorchSword_FlagSp))
  console.log('shield fsp', array_compare(z.flag_sp.data[PorchType.Shield], PorchShield_FlagSp))
  console.log('bow    vsp', array_compare(z.value_sp.data[PorchType.Bow], PorchBow_ValueSp))
  console.log('sword  vsp', array_compare(z.value_sp.data[PorchType.Weapon], PorchSword_ValueSp))
  console.log('shield vsp', array_compare(z.value_sp.data[PorchType.Shield], PorchShield_ValueSp))
}
*/
