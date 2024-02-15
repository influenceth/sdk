const IDS = {
  WATER: 1,
  HYDROGEN: 2,
  AMMONIA: 3,
  NITROGEN: 4,
  SULFUR_DIOXIDE: 5,
  CARBON_DIOXIDE: 6,
  CARBON_MONOXIDE: 7,
  METHANE: 8,
  APATITE: 9,
  BITUMEN: 10,
  CALCITE: 11,
  FELDSPAR: 12,
  OLIVINE: 13,
  PYROXENE: 14,
  COFFINITE: 15,
  MERRILLITE: 16,
  XENOTIME: 17,
  RHABDITE: 18,
  GRAPHITE: 19,
  TAENITE: 20,
  TROILITE: 21,
  URANINITE: 22,
  OXYGEN: 23,
  DEIONIZED_WATER: 24,
  RAW_SALTS: 25,
  SILICA: 26,
  NAPHTHA: 27,
  SODIUM_BICARBONATE: 28,
  IRON: 29,
  COPPER: 30,
  NICKEL: 31,
  QUICKLIME: 32,
  ACETYLENE: 33,
  AMMONIUM_CARBONATE: 34,
  TRIPLE_SUPERPHOSPHATE: 35,
  PHOSPHATE_AND_SULFATE_SALTS: 36,
  IRON_SULFIDE: 37,
  LEAD_SULFIDE: 38,
  TIN_SULFIDE: 39,
  MOLYBDENUM_DISULFIDE: 40,
  FUSED_QUARTZ: 41,
  FIBERGLASS: 42,
  BARE_COPPER_WIRE: 43,
  CEMENT: 44,
  SODIUM_CHLORIDE: 45,
  POTASSIUM_CHLORIDE: 46,
  BORAX: 47,
  LITHIUM_CARBONATE: 48,
  MAGNESIUM_CHLORIDE: 49,
  PROPYLENE: 50,
  SULFUR: 51,
  STEEL: 52,
  SILICON: 53,
  NITRIC_ACID: 54,
  SULFURIC_ACID: 55,
  SOIL: 56,
  FERROSILICON: 57,
  WEATHERED_OLIVINE: 58,
  OXALIC_ACID: 59,
  SILVER: 60,
  GOLD: 61,
  TIN: 62,
  IRON_OXIDE: 63,
  SPIRULINA_AND_CHLORELLA_ALGAE: 64,
  MOLYBDENUM_TRIOXIDE: 65,
  SILICA_POWDER: 66,
  SOLDER: 67,
  FIBER_OPTIC_CABLE: 68,
  STEEL_BEAM: 69,
  STEEL_SHEET: 70,
  STEEL_PIPE: 71,
  STEEL_WIRE: 72,
  ACRYLONITRILE: 73,
  POLYPROPYLENE: 74,
  MAGNESIUM: 75,
  CHLORINE: 76,
  SODIUM_CARBONATE: 77,
  CALCIUM_CHLORIDE: 78,
  BORIA: 79,
  LITHIUM_SULFATE: 80,
  HYDROCHLORIC_ACID: 81,
  HYDROFLUORIC_ACID: 82,
  PHOSPHORIC_ACID: 83,
  BORIC_ACID: 84,
  ZINC_OXIDE: 85,
  NICKEL_OXIDE: 86,
  MAGNESIA: 87,
  ALUMINA: 88,
  SODIUM_HYDROXIDE: 89,
  POTASSIUM_HYDROXIDE: 90,
  SOYBEANS: 91,
  POTATOES: 92,
  AMMONIUM_OXALATE: 93,
  RARE_EARTH_SULFATES: 94,
  FERROCHROMIUM: 95,
  YELLOWCAKE: 96,
  ALUMINA_CERAMIC: 97,
  AUSTENITIC_NICHROME: 98,
  COPPER_WIRE: 99,
  SILICON_WAFER: 100,
  STEEL_CABLE: 101,
  POLYACRYLONITRILE: 102,
  NATURAL_FLAVORINGS: 103,
  PLATINUM: 104,
  LITHIUM_CHLORIDE: 105,
  ZINC: 106,
  EPICHLOROHYDRIN: 107,
  BISPHENOL_A: 108,
  RARE_EARTH_OXIDES: 109,
  AMMONIUM_CHLORIDE: 110,
  ALUMINIUM: 111,
  CALCIUM: 112,
  SODIUM_CHROMATE: 113,
  LEACHED_COFFINITE: 114,
  URANYL_NITRATE: 115,
  FLUORINE: 116,
  SODIUM_TUNGSTATE: 117,
  FERRITE: 118,
  DIODE: 119,
  LASER_DIODE: 120,
  BALL_VALVE: 121,
  ALUMINIUM_BEAM: 122,
  ALUMINIUM_SHEET: 123,
  ALUMINIUM_PIPE: 124,
  POLYACRYLONITRILE_FABRIC: 125,
  COLD_GAS_THRUSTER: 126,
  COLD_GAS_TORQUE_THRUSTER: 127,
  CARBON_FIBER: 128,
  FOOD: 129,
  SMALL_PROPELLANT_TANK: 130,
  BOROSILICATE_GLASS: 131,
  BALL_BEARING: 132,
  LARGE_THRUST_BEARING: 133,
  BORON: 134,
  LITHIUM: 135,
  EPOXY: 136,
  NEODYMIUM_OXIDE: 137,
  YTTRIA: 138,
  SODIUM_DICHROMATE: 139,
  NOVOLAK_PREPOLYMER_RESIN: 140,
  FERROMOLYBDENUM: 141,
  AMMONIUM_DIURANATE: 142,
  AMMONIUM_PARATUNGSTATE: 143,
  ENGINE_BELL: 144,
  STEEL_TRUSS: 145,
  ALUMINIUM_HULL_PLATE: 146,
  ALUMINIUM_TRUSS: 147,
  CARGO_MODULE: 148,
  PRESSURE_VESSEL: 149,
  PROPELLANT_TANK: 150,
  STAINLESS_STEEL: 151,
  BARE_CIRCUIT_BOARD: 152,
  FERRITE_BEAD_INDUCTOR: 153,
  CORE_DRILL_BIT: 154,
  CORE_DRILL_THRUSTER: 155,
  PARABOLIC_DISH: 156,
  PHOTOVOLTAIC_PANEL: 157,
  LIPO_BATTERY: 158,
  NEODYMIUM_TRICHLORIDE: 159,
  CHROMIA: 161,
  PHOTORESIST_EPOXY: 162,
  URANIUM_DIOXIDE: 163,
  TUNGSTEN: 164,
  SHUTTLE_HULL: 165,
  LIGHT_TRANSPORT_HULL: 166,
  CARGO_RING: 167,
  HEAVY_TRANSPORT_HULL: 168,
  TUNGSTEN_POWDER: 169,
  HYDROGEN_PROPELLANT: 170,
  STAINLESS_STEEL_SHEET: 171,
  STAINLESS_STEEL_PIPE: 172,
  CCD: 173,
  COMPUTER_CHIP: 174,
  CORE_DRILL: 175,
  NEODYMIUM: 176,
  CHROMIUM: 178,
  URANIUM_TETRAFLUORIDE: 179,
  PURE_NITROGEN: 180,
  ND_YAG_LASER_ROD: 181,
  NICHROME: 182,
  NEODYMIUM_MAGNET: 183,
  UNENRICHED_URANIUM_HEXAFLUORIDE: 184,
  HIGHLY_ENRICHED_URANIUM_HEXAFLUORIDE: 185,
  ND_YAG_LASER: 186,
  THIN_FILM_RESISTOR: 187,
  HIGHLY_ENRICHED_URANIUM_POWDER: 188,
  LEACHED_FELDSPAR: 189,
  ROASTED_RHABDITE: 190,
  RHABDITE_SLAG: 191,
  POTASSIUM_CARBONATE: 192,
  HYDROGEN_HEPTAFLUOROTANTALATE_AND_NIOBATE: 193,
  LEAD: 194,
  POTASSIUM_FLUORIDE: 195,
  POTASSIUM_HEPTAFLUOROTANTALATE: 196,
  DIEPOXY_PREPOLYMER_RESIN: 197,
  TANTALUM: 199,
  PEDOT: 200,
  POLYMER_TANTALUM_CAPACITOR: 201,
  SURFACE_MOUNT_DEVICE_REEL: 202,
  CIRCUIT_BOARD: 203,
  BRUSHLESS_MOTOR_STATOR: 204,
  BRUSHLESS_MOTOR_ROTOR: 205,
  BRUSHLESS_MOTOR: 206,
  LANDING_LEG: 207,
  LANDING_AUGER: 208,
  PUMP: 209,
  RADIO_ANTENNA: 210,
  FIBER_OPTIC_GYROSCOPE: 211,
  STAR_TRACKER: 212,
  COMPUTER: 213,
  CONTROL_MOMENT_GYROSCOPE: 214,
  ROBOTIC_ARM: 215,
  BERYLLIUM_CARBONATE: 217,
  BERYLLIA: 218,
  BERYLLIA_CERAMIC: 219,
  NEON: 220,
  HEAT_EXCHANGER: 221,
  TURBOPUMP: 222,
  NEON_FUEL_SEPARATOR_CENTRIFUGE: 224,
  FUEL_MAKE_UP_TANK: 225,
  NEON_MAKE_UP_TANK: 226,
  LIGHTBULB_END_MODERATORS: 227,
  FUSED_QUARTZ_LIGHTBULB_TUBE: 229,
  REACTOR_PLUMBING_ASSEMBLY: 230,
  FLOW_DIVIDER_MODERATOR: 231,
  NUCLEAR_LIGHTBULB: 232,
  COMPOSITE_OVERWRAPPED_REACTOR_SHELL: 233,
  CLOSED_CYCLE_GAS_CORE_NUCLEAR_REACTOR_ENGINE: 234,
  HABITATION_MODULE: 235,
  MOBILITY_MODULE: 236,
  FLUIDS_AUTOMATION_MODULE: 237,
  SOLIDS_AUTOMATION_MODULE: 238,
  TERRAIN_INTERFACE_MODULE: 239,
  AVIONICS_MODULE: 240,
  ESCAPE_MODULE: 241,
  ATTITUDE_CONTROL_MODULE: 242,
  POWER_MODULE: 243,
  THERMAL_MODULE: 244,
  PROPULSION_MODULE: 245
};

const CLASSIFICATIONS = {
  ASSEMBLY: 'Assembly',
  CROP: 'Crop',
  MANUFACTURED_GOOD: 'Manufactured Good',
  RAW_MATERIAL: 'Raw Material',
  REFINED_MATERIAL: 'Refined Material'
};

const CATEGORIES = {
  ACID: 'Acid',
  ADHESIVE: 'Adhesive',
  ALLOY: 'Alloy',
  BASE: 'Base',
  CARBONATE: 'Carbonate',
  CERAMIC: 'Ceramic',
  CONSTRUCTION: 'Construction',
  CRYSTAL: 'Crystal',
  ELECTROMECHANICAL: 'Electromechanical',
  ELECTRONICS: 'Electronics',
  ELECTRO_OPTICAL: 'Electro-optical',
  ENGINE_PART: 'Engine Part',
  FABRIC: 'Fabric',
  FISSILE: 'Fissile',
  FLUORIDE: 'Fluoride',
  FOOD: 'Food',
  GROWN_ORGANIC: 'Grown Organic',
  HULL_MODULE: 'Hull Module',
  INGREDIENT: 'Ingredient',
  INTEGRATION_MODULE: 'Integration Module',
  MECHANISM: 'Mechanism',
  METAL: 'Metal',
  NITRATE: 'Nitrate',
  NONMETAL: 'Nonmetal',
  ORGANIC: 'Organic',
  ORGANIC_SUBSTRATE: 'Organic Substrate',
  OXIDE: 'Oxide',
  PHOSPHATE: 'Phosphate',
  POLYMER: 'Polymer',
  POWDER: 'Powder',
  PROCESSED_GLASS: 'Processed Glass',
  PROCESSED_METAL: 'Processed Metal',
  PROPELLANT: 'Propellant',
  RARE_EARTH: 'Rare Earth',
  REFINED_FISSILE: 'Refined Fissile',
  REFINED_GLASS: 'Refined Glass',
  REFINED_METAL: 'Refined Metal',
  REFINED_ORGANIC: 'Refined Organic',
  REFINED_RARE_EARTH: 'Refined Rare Earth',
  REFINED_VOLATILE: 'Refined Volatile',
  SALT: 'Salt',
  SEMI_REFINED: 'Semi-refined',
  SHIP_HULL: 'Ship Hull',
  SHIP_PART: 'Ship Part',
  SULFATE: 'Sulfate',
  SULFIDE: 'Sulfide',
  TOOL: 'Tool',
  VOLATILE: 'Volatile'
};

// massPerUnit is g, volumePerUnit is mL
const TYPES = {
  [IDS.WATER]: {
    i: IDS.WATER,
    name: 'Water',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.VOLATILE,
    massPerUnit: 1000,
    volumePerUnit: 971,
    isAtomic: false
  },
  [IDS.HYDROGEN]: {
    i: IDS.HYDROGEN,
    name: 'Hydrogen',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.VOLATILE,
    massPerUnit: 1000,
    volumePerUnit: 14100,
    isAtomic: false
  },
  [IDS.AMMONIA]: {
    i: IDS.AMMONIA,
    name: 'Ammonia',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.VOLATILE,
    massPerUnit: 1000,
    volumePerUnit: 1370,
    isAtomic: false
  },
  [IDS.NITROGEN]: {
    i: IDS.NITROGEN,
    name: 'Nitrogen',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.VOLATILE,
    massPerUnit: 1000,
    volumePerUnit: 1240,
    isAtomic: false
  },
  [IDS.SULFUR_DIOXIDE]: {
    i: IDS.SULFUR_DIOXIDE,
    name: 'Sulfur Dioxide',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.VOLATILE,
    massPerUnit: 1000,
    volumePerUnit: 684,
    isAtomic: false
  },
  [IDS.CARBON_DIOXIDE]: {
    i: IDS.CARBON_DIOXIDE,
    name: 'Carbon Dioxide',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.VOLATILE,
    massPerUnit: 1000,
    volumePerUnit: 801,
    isAtomic: false
  },
  [IDS.CARBON_MONOXIDE]: {
    i: IDS.CARBON_MONOXIDE,
    name: 'Carbon Monoxide',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.VOLATILE,
    massPerUnit: 1000,
    volumePerUnit: 1250,
    isAtomic: false
  },
  [IDS.METHANE]: {
    i: IDS.METHANE,
    name: 'Methane',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.VOLATILE,
    massPerUnit: 1000,
    volumePerUnit: 2220,
    isAtomic: false
  },
  [IDS.APATITE]: {
    i: IDS.APATITE,
    name: 'Apatite',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 521,
    isAtomic: false
  },
  [IDS.BITUMEN]: {
    i: IDS.BITUMEN,
    name: 'Bitumen',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 1600,
    isAtomic: false
  },
  [IDS.CALCITE]: {
    i: IDS.CALCITE,
    name: 'Calcite',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 615,
    isAtomic: false
  },
  [IDS.FELDSPAR]: {
    i: IDS.FELDSPAR,
    name: 'Feldspar',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.METAL,
    massPerUnit: 1000,
    volumePerUnit: 606,
    isAtomic: false
  },
  [IDS.OLIVINE]: {
    i: IDS.OLIVINE,
    name: 'Olivine',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.METAL,
    massPerUnit: 1000,
    volumePerUnit: 617,
    isAtomic: false
  },
  [IDS.PYROXENE]: {
    i: IDS.PYROXENE,
    name: 'Pyroxene',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.METAL,
    massPerUnit: 1000,
    volumePerUnit: 476,
    isAtomic: false
  },
  [IDS.COFFINITE]: {
    i: IDS.COFFINITE,
    name: 'Coffinite',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.FISSILE,
    massPerUnit: 1000,
    volumePerUnit: 327,
    isAtomic: false
  },
  [IDS.MERRILLITE]: {
    i: IDS.MERRILLITE,
    name: 'Merrillite',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.RARE_EARTH,
    massPerUnit: 1000,
    volumePerUnit: 521,
    isAtomic: false
  },
  [IDS.XENOTIME]: {
    i: IDS.XENOTIME,
    name: 'Xenotime',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.RARE_EARTH,
    massPerUnit: 1000,
    volumePerUnit: 358,
    isAtomic: false
  },
  [IDS.RHABDITE]: {
    i: IDS.RHABDITE,
    name: 'Rhabdite',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.METAL,
    massPerUnit: 1000,
    volumePerUnit: 233,
    isAtomic: false
  },
  [IDS.GRAPHITE]: {
    i: IDS.GRAPHITE,
    name: 'Graphite',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.METAL,
    massPerUnit: 1000,
    volumePerUnit: 737,
    isAtomic: false
  },
  [IDS.TAENITE]: {
    i: IDS.TAENITE,
    name: 'Taenite',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.METAL,
    massPerUnit: 1000,
    volumePerUnit: 208,
    isAtomic: false
  },
  [IDS.TROILITE]: {
    i: IDS.TROILITE,
    name: 'Troilite',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.METAL,
    massPerUnit: 1000,
    volumePerUnit: 362,
    isAtomic: false
  },
  [IDS.URANINITE]: {
    i: IDS.URANINITE,
    name: 'Uraninite',
    classification: CLASSIFICATIONS.RAW_MATERIAL,
    category: CATEGORIES.FISSILE,
    massPerUnit: 1000,
    volumePerUnit: 156,
    isAtomic: false
  },
  [IDS.OXYGEN]: {
    i: IDS.OXYGEN,
    name: 'Oxygen',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.NONMETAL,
    massPerUnit: 1000,
    volumePerUnit: 876,
    isAtomic: false
  },
  [IDS.DEIONIZED_WATER]: {
    i: IDS.DEIONIZED_WATER,
    name: 'Deionized Water',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_VOLATILE,
    massPerUnit: 1000,
    volumePerUnit: 1000,
    isAtomic: false
  },
  [IDS.RAW_SALTS]: {
    i: IDS.RAW_SALTS,
    name: 'Raw Salts',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 775,
    isAtomic: false
  },
  [IDS.SILICA]: {
    i: IDS.SILICA,
    name: 'Silica',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 629,
    isAtomic: false
  },
  [IDS.NAPHTHA]: {
    i: IDS.NAPHTHA,
    name: 'Naphtha',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 1300,
    isAtomic: false
  },
  [IDS.SODIUM_BICARBONATE]: {
    i: IDS.SODIUM_BICARBONATE,
    name: 'Sodium Bicarbonate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.CARBONATE,
    massPerUnit: 1000,
    volumePerUnit: 909,
    isAtomic: false
  },
  [IDS.IRON]: {
    i: IDS.IRON,
    name: 'Iron',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 140,
    isAtomic: false
  },
  [IDS.COPPER]: {
    i: IDS.COPPER,
    name: 'Copper',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 123,
    isAtomic: false
  },
  [IDS.NICKEL]: {
    i: IDS.NICKEL,
    name: 'Nickel',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 161,
    isAtomic: false
  },
  [IDS.QUICKLIME]: {
    i: IDS.QUICKLIME,
    name: 'Quicklime',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 599,
    isAtomic: false
  },
  [IDS.ACETYLENE]: {
    i: IDS.ACETYLENE,
    name: 'Acetylene',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 1440,
    isAtomic: false
  },
  [IDS.AMMONIUM_CARBONATE]: {
    i: IDS.AMMONIUM_CARBONATE,
    name: 'Ammonium Carbonate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.CARBONATE,
    massPerUnit: 1000,
    volumePerUnit: 1330,
    isAtomic: false
  },
  [IDS.TRIPLE_SUPERPHOSPHATE]: {
    i: IDS.TRIPLE_SUPERPHOSPHATE,
    name: 'Triple Superphosphate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.PHOSPHATE,
    massPerUnit: 1000,
    volumePerUnit: 870,
    isAtomic: false
  },
  [IDS.PHOSPHATE_AND_SULFATE_SALTS]: {
    i: IDS.PHOSPHATE_AND_SULFATE_SALTS,
    name: 'Phosphate and Sulfate Salts',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 595,
    isAtomic: false
  },
  [IDS.IRON_SULFIDE]: {
    i: IDS.IRON_SULFIDE,
    name: 'Iron Sulfide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SULFIDE,
    massPerUnit: 1000,
    volumePerUnit: 344,
    isAtomic: false
  },
  [IDS.LEAD_SULFIDE]: {
    i: IDS.LEAD_SULFIDE,
    name: 'Lead Sulfide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SULFIDE,
    massPerUnit: 1000,
    volumePerUnit: 219,
    isAtomic: false
  },
  [IDS.TIN_SULFIDE]: {
    i: IDS.TIN_SULFIDE,
    name: 'Tin Sulfide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SULFIDE,
    massPerUnit: 1000,
    volumePerUnit: 319,
    isAtomic: false
  },
  [IDS.MOLYBDENUM_DISULFIDE]: {
    i: IDS.MOLYBDENUM_DISULFIDE,
    name: 'Molybdenum Disulfide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SULFIDE,
    massPerUnit: 1000,
    volumePerUnit: 329,
    isAtomic: false
  },
  [IDS.FUSED_QUARTZ]: {
    i: IDS.FUSED_QUARTZ,
    name: 'Fused Quartz',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_GLASS,
    massPerUnit: 1000,
    volumePerUnit: 415,
    isAtomic: false
  },
  [IDS.FIBERGLASS]: {
    i: IDS.FIBERGLASS,
    name: 'Fiberglass',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.FABRIC,
    massPerUnit: 1000,
    volumePerUnit: 1260,
    isAtomic: false
  },
  [IDS.BARE_COPPER_WIRE]: {
    i: IDS.BARE_COPPER_WIRE,
    name: 'Bare Copper Wire',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 123,
    isAtomic: false
  },
  [IDS.CEMENT]: {
    i: IDS.CEMENT,
    name: 'Cement',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.CONSTRUCTION,
    massPerUnit: 1000,
    volumePerUnit: 1130,
    isAtomic: false
  },
  [IDS.SODIUM_CHLORIDE]: {
    i: IDS.SODIUM_CHLORIDE,
    name: 'Sodium Chloride',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 1410,
    isAtomic: false
  },
  [IDS.POTASSIUM_CHLORIDE]: {
    i: IDS.POTASSIUM_CHLORIDE,
    name: 'Potassium Chloride',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 842,
    isAtomic: false
  },
  [IDS.BORAX]: {
    i: IDS.BORAX,
    name: 'Borax',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 963,
    isAtomic: false
  },
  [IDS.LITHIUM_CARBONATE]: {
    i: IDS.LITHIUM_CARBONATE,
    name: 'Lithium Carbonate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.CARBONATE,
    massPerUnit: 1000,
    volumePerUnit: 948,
    isAtomic: false
  },
  [IDS.MAGNESIUM_CHLORIDE]: {
    i: IDS.MAGNESIUM_CHLORIDE,
    name: 'Magnesium Chloride',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 718,
    isAtomic: false
  },
  [IDS.PROPYLENE]: {
    i: IDS.PROPYLENE,
    name: 'Propylene',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 2040,
    isAtomic: false
  },
  [IDS.SULFUR]: {
    i: IDS.SULFUR,
    name: 'Sulfur',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.NONMETAL,
    massPerUnit: 1000,
    volumePerUnit: 805,
    isAtomic: false
  },
  [IDS.STEEL]: {
    i: IDS.STEEL,
    name: 'Steel',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ALLOY,
    massPerUnit: 1000,
    volumePerUnit: 159,
    isAtomic: false
  },
  [IDS.SILICON]: {
    i: IDS.SILICON,
    name: 'Silicon',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.NONMETAL,
    massPerUnit: 1000,
    volumePerUnit: 715,
    isAtomic: false
  },
  [IDS.NITRIC_ACID]: {
    i: IDS.NITRIC_ACID,
    name: 'Nitric Acid',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ACID,
    massPerUnit: 1000,
    volumePerUnit: 893,
    isAtomic: false
  },
  [IDS.SULFURIC_ACID]: {
    i: IDS.SULFURIC_ACID,
    name: 'Sulfuric Acid',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ACID,
    massPerUnit: 1000,
    volumePerUnit: 687,
    isAtomic: false
  },
  [IDS.SOIL]: {
    i: IDS.SOIL,
    name: 'Soil',
    classification: CLASSIFICATIONS.CROP,
    category: CATEGORIES.ORGANIC_SUBSTRATE,
    massPerUnit: 1000,
    volumePerUnit: 714,
    isAtomic: false
  },
  [IDS.FERROSILICON]: {
    i: IDS.FERROSILICON,
    name: 'Ferrosilicon',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ALLOY,
    massPerUnit: 1000,
    volumePerUnit: 271,
    isAtomic: false
  },
  [IDS.WEATHERED_OLIVINE]: {
    i: IDS.WEATHERED_OLIVINE,
    name: 'Weathered Olivine',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SEMI_REFINED,
    massPerUnit: 1000,
    volumePerUnit: 521,
    isAtomic: false
  },
  [IDS.OXALIC_ACID]: {
    i: IDS.OXALIC_ACID,
    name: 'Oxalic Acid',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ACID,
    massPerUnit: 1000,
    volumePerUnit: 1050,
    isAtomic: false
  },
  [IDS.SILVER]: {
    i: IDS.SILVER,
    name: 'Silver',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 119,
    isAtomic: false
  },
  [IDS.GOLD]: {
    i: IDS.GOLD,
    name: 'Gold',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 65,
    isAtomic: false
  },
  [IDS.TIN]: {
    i: IDS.TIN,
    name: 'Tin',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 171,
    isAtomic: false
  },
  [IDS.IRON_OXIDE]: {
    i: IDS.IRON_OXIDE,
    name: 'Iron Oxide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 387,
    isAtomic: false
  },
  [IDS.SPIRULINA_AND_CHLORELLA_ALGAE]: {
    i: IDS.SPIRULINA_AND_CHLORELLA_ALGAE,
    name: 'Spirulina and Chlorella Algae',
    classification: CLASSIFICATIONS.CROP,
    category: CATEGORIES.INGREDIENT,
    massPerUnit: 1000,
    volumePerUnit: 2500,
    isAtomic: false
  },
  [IDS.MOLYBDENUM_TRIOXIDE]: {
    i: IDS.MOLYBDENUM_TRIOXIDE,
    name: 'Molybdenum Trioxide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 426,
    isAtomic: false
  },
  [IDS.SILICA_POWDER]: {
    i: IDS.SILICA_POWDER,
    name: 'Silica Powder',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.POWDER,
    massPerUnit: 1000,
    volumePerUnit: 755,
    isAtomic: false
  },
  [IDS.SOLDER]: {
    i: IDS.SOLDER,
    name: 'Solder',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 1000,
    volumePerUnit: 148,
    isAtomic: false
  },
  [IDS.FIBER_OPTIC_CABLE]: {
    i: IDS.FIBER_OPTIC_CABLE,
    name: 'Fiber Optic Cable',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_GLASS,
    massPerUnit: 1000,
    volumePerUnit: 886,
    isAtomic: false
  },
  [IDS.STEEL_BEAM]: {
    i: IDS.STEEL_BEAM,
    name: 'Steel Beam',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 1100,
    isAtomic: false
  },
  [IDS.STEEL_SHEET]: {
    i: IDS.STEEL_SHEET,
    name: 'Steel Sheet',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 150,
    isAtomic: false
  },
  [IDS.STEEL_PIPE]: {
    i: IDS.STEEL_PIPE,
    name: 'Steel Pipe',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 1200,
    isAtomic: false
  },
  [IDS.STEEL_WIRE]: {
    i: IDS.STEEL_WIRE,
    name: 'Steel Wire',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 150,
    isAtomic: false
  },
  [IDS.ACRYLONITRILE]: {
    i: IDS.ACRYLONITRILE,
    name: 'Acrylonitrile',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 1230,
    isAtomic: false
  },
  [IDS.POLYPROPYLENE]: {
    i: IDS.POLYPROPYLENE,
    name: 'Polypropylene',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.POLYMER,
    massPerUnit: 1000,
    volumePerUnit: 1570,
    isAtomic: false
  },
  [IDS.MAGNESIUM]: {
    i: IDS.MAGNESIUM,
    name: 'Magnesium',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 632,
    isAtomic: false
  },
  [IDS.CHLORINE]: {
    i: IDS.CHLORINE,
    name: 'Chlorine',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.NONMETAL,
    massPerUnit: 1000,
    volumePerUnit: 4020,
    isAtomic: false
  },
  [IDS.SODIUM_CARBONATE]: {
    i: IDS.SODIUM_CARBONATE,
    name: 'Sodium Carbonate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.CARBONATE,
    massPerUnit: 1000,
    volumePerUnit: 787,
    isAtomic: false
  },
  [IDS.CALCIUM_CHLORIDE]: {
    i: IDS.CALCIUM_CHLORIDE,
    name: 'Calcium Chloride',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 775,
    isAtomic: false
  },
  [IDS.BORIA]: {
    i: IDS.BORIA,
    name: 'Boria',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 739,
    isAtomic: false
  },
  [IDS.LITHIUM_SULFATE]: {
    i: IDS.LITHIUM_SULFATE,
    name: 'Lithium Sulfate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SULFATE,
    massPerUnit: 1000,
    volumePerUnit: 751,
    isAtomic: false
  },
  [IDS.HYDROCHLORIC_ACID]: {
    i: IDS.HYDROCHLORIC_ACID,
    name: 'Hydrochloric Acid',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ACID,
    massPerUnit: 1000,
    volumePerUnit: 1040,
    isAtomic: false
  },
  [IDS.HYDROFLUORIC_ACID]: {
    i: IDS.HYDROFLUORIC_ACID,
    name: 'Hydrofluoric Acid',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ACID,
    massPerUnit: 1000,
    volumePerUnit: 1090,
    isAtomic: false
  },
  [IDS.PHOSPHORIC_ACID]: {
    i: IDS.PHOSPHORIC_ACID,
    name: 'Phosphoric Acid',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ACID,
    massPerUnit: 1000,
    volumePerUnit: 694,
    isAtomic: false
  },
  [IDS.BORIC_ACID]: {
    i: IDS.BORIC_ACID,
    name: 'Boric Acid',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ACID,
    massPerUnit: 1000,
    volumePerUnit: 1390,
    isAtomic: false
  },
  [IDS.ZINC_OXIDE]: {
    i: IDS.ZINC_OXIDE,
    name: 'Zinc Oxide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 357,
    isAtomic: false
  },
  [IDS.NICKEL_OXIDE]: {
    i: IDS.NICKEL_OXIDE,
    name: 'Nickel Oxide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 300,
    isAtomic: false
  },
  [IDS.MAGNESIA]: {
    i: IDS.MAGNESIA,
    name: 'Magnesia',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 559,
    isAtomic: false
  },
  [IDS.ALUMINA]: {
    i: IDS.ALUMINA,
    name: 'Alumina',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 460,
    isAtomic: false
  },
  [IDS.SODIUM_HYDROXIDE]: {
    i: IDS.SODIUM_HYDROXIDE,
    name: 'Sodium Hydroxide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.BASE,
    massPerUnit: 1000,
    volumePerUnit: 671,
    isAtomic: false
  },
  [IDS.POTASSIUM_HYDROXIDE]: {
    i: IDS.POTASSIUM_HYDROXIDE,
    name: 'Potassium Hydroxide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.BASE,
    massPerUnit: 1000,
    volumePerUnit: 674,
    isAtomic: false
  },
  [IDS.SOYBEANS]: {
    i: IDS.SOYBEANS,
    name: 'Soybeans',
    classification: CLASSIFICATIONS.CROP,
    category: CATEGORIES.INGREDIENT,
    massPerUnit: 1000,
    volumePerUnit: 1530,
    isAtomic: false
  },
  [IDS.POTATOES]: {
    i: IDS.POTATOES,
    name: 'Potatoes',
    classification: CLASSIFICATIONS.CROP,
    category: CATEGORIES.INGREDIENT,
    massPerUnit: 1000,
    volumePerUnit: 1520,
    isAtomic: false
  },
  [IDS.AMMONIUM_OXALATE]: {
    i: IDS.AMMONIUM_OXALATE,
    name: 'Ammonium Oxalate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 1110,
    isAtomic: false
  },
  [IDS.RARE_EARTH_SULFATES]: {
    i: IDS.RARE_EARTH_SULFATES,
    name: 'Rare Earth Sulfates',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SULFATE,
    massPerUnit: 1000,
    volumePerUnit: 681,
    isAtomic: false
  },
  [IDS.FERROCHROMIUM]: {
    i: IDS.FERROCHROMIUM,
    name: 'Ferrochromium',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ALLOY,
    massPerUnit: 1000,
    volumePerUnit: 222,
    isAtomic: false
  },
  [IDS.YELLOWCAKE]: {
    i: IDS.YELLOWCAKE,
    name: 'Yellowcake',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 172,
    isAtomic: false
  },
  [IDS.ALUMINA_CERAMIC]: {
    i: IDS.ALUMINA_CERAMIC,
    name: 'Alumina Ceramic',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.CERAMIC,
    massPerUnit: 1000,
    volumePerUnit: 316,
    isAtomic: false
  },
  [IDS.AUSTENITIC_NICHROME]: {
    i: IDS.AUSTENITIC_NICHROME,
    name: 'Austenitic Nichrome',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ALLOY,
    massPerUnit: 1000,
    volumePerUnit: 135,
    isAtomic: false
  },
  [IDS.COPPER_WIRE]: {
    i: IDS.COPPER_WIRE,
    name: 'Copper Wire',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 1000,
    volumePerUnit: 152,
    isAtomic: false
  },
  [IDS.SILICON_WAFER]: {
    i: IDS.SILICON_WAFER,
    name: 'Silicon Wafer',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.CRYSTAL,
    massPerUnit: 1000,
    volumePerUnit: 472,
    isAtomic: false
  },
  [IDS.STEEL_CABLE]: {
    i: IDS.STEEL_CABLE,
    name: 'Steel Cable',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 182,
    isAtomic: false
  },
  [IDS.POLYACRYLONITRILE]: {
    i: IDS.POLYACRYLONITRILE,
    name: 'Polyacrylonitrile',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.POLYMER,
    massPerUnit: 1000,
    volumePerUnit: 1210,
    isAtomic: false
  },
  [IDS.NATURAL_FLAVORINGS]: {
    i: IDS.NATURAL_FLAVORINGS,
    name: 'Natural Flavorings',
    classification: CLASSIFICATIONS.CROP,
    category: CATEGORIES.INGREDIENT,
    massPerUnit: 1000,
    volumePerUnit: 1820,
    isAtomic: false
  },
  [IDS.PLATINUM]: {
    i: IDS.PLATINUM,
    name: 'Platinum',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 58,
    isAtomic: false
  },
  [IDS.LITHIUM_CHLORIDE]: {
    i: IDS.LITHIUM_CHLORIDE,
    name: 'Lithium Chloride',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 805,
    isAtomic: false
  },
  [IDS.ZINC]: {
    i: IDS.ZINC,
    name: 'Zinc',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 175,
    isAtomic: false
  },
  [IDS.EPICHLOROHYDRIN]: {
    i: IDS.EPICHLOROHYDRIN,
    name: 'Epichlorohydrin',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 1060,
    isAtomic: false
  },
  [IDS.BISPHENOL_A]: {
    i: IDS.BISPHENOL_A,
    name: 'Bisphenol A',
    classification: CLASSIFICATIONS.CROP,
    category: CATEGORIES.GROWN_ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 1040,
    isAtomic: false
  },
  [IDS.RARE_EARTH_OXIDES]: {
    i: IDS.RARE_EARTH_OXIDES,
    name: 'Rare Earth Oxides',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 272,
    isAtomic: false
  },
  [IDS.AMMONIUM_CHLORIDE]: {
    i: IDS.AMMONIUM_CHLORIDE,
    name: 'Ammonium Chloride',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 1090,
    isAtomic: false
  },
  [IDS.ALUMINIUM]: {
    i: IDS.ALUMINIUM,
    name: 'Aluminium',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 463,
    isAtomic: false
  },
  [IDS.CALCIUM]: {
    i: IDS.CALCIUM,
    name: 'Calcium',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 1290,
    isAtomic: false
  },
  [IDS.SODIUM_CHROMATE]: {
    i: IDS.SODIUM_CHROMATE,
    name: 'Sodium Chromate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 617,
    isAtomic: false
  },
  [IDS.LEACHED_COFFINITE]: {
    i: IDS.LEACHED_COFFINITE,
    name: 'Leached Coffinite',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SEMI_REFINED,
    massPerUnit: 1000,
    volumePerUnit: 333,
    isAtomic: false
  },
  [IDS.URANYL_NITRATE]: {
    i: IDS.URANYL_NITRATE,
    name: 'Uranyl Nitrate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.NITRATE,
    massPerUnit: 1000,
    volumePerUnit: 593,
    isAtomic: false
  },
  [IDS.FLUORINE]: {
    i: IDS.FLUORINE,
    name: 'Fluorine',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.NONMETAL,
    massPerUnit: 1000,
    volumePerUnit: 1520,
    isAtomic: false
  },
  [IDS.SODIUM_TUNGSTATE]: {
    i: IDS.SODIUM_TUNGSTATE,
    name: 'Sodium Tungstate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 435,
    isAtomic: false
  },
  [IDS.FERRITE]: {
    i: IDS.FERRITE,
    name: 'Ferrite',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ALLOY,
    massPerUnit: 1000,
    volumePerUnit: 220,
    isAtomic: false
  },
  [IDS.DIODE]: {
    i: IDS.DIODE,
    name: 'Diode',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 1000,
    volumePerUnit: 800,
    isAtomic: false
  },
  [IDS.LASER_DIODE]: {
    i: IDS.LASER_DIODE,
    name: 'Laser Diode',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 1000,
    volumePerUnit: 800,
    isAtomic: false
  },
  [IDS.BALL_VALVE]: {
    i: IDS.BALL_VALVE,
    name: 'Ball Valve',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.MECHANISM,
    massPerUnit: 1000,
    volumePerUnit: 1480,
    isAtomic: false
  },
  [IDS.ALUMINIUM_BEAM]: {
    i: IDS.ALUMINIUM_BEAM,
    name: 'Aluminium Beam',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 3190,
    isAtomic: false
  },
  [IDS.ALUMINIUM_SHEET]: {
    i: IDS.ALUMINIUM_SHEET,
    name: 'Aluminium Sheet',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 436,
    isAtomic: false
  },
  [IDS.ALUMINIUM_PIPE]: {
    i: IDS.ALUMINIUM_PIPE,
    name: 'Aluminium Pipe',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 3190,
    isAtomic: false
  },
  [IDS.POLYACRYLONITRILE_FABRIC]: {
    i: IDS.POLYACRYLONITRILE_FABRIC,
    name: 'Polyacrylonitrile Fabric',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.FABRIC,
    massPerUnit: 1000,
    volumePerUnit: 2820,
    isAtomic: false
  },
  [IDS.COLD_GAS_THRUSTER]: {
    i: IDS.COLD_GAS_THRUSTER,
    name: 'Cold Gas Thruster',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.MECHANISM,
    massPerUnit: 3000,
    volumePerUnit: 1725,
    isAtomic: true
  },
  [IDS.COLD_GAS_TORQUE_THRUSTER]: {
    i: IDS.COLD_GAS_TORQUE_THRUSTER,
    name: 'Cold Gas Torque Thruster',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.MECHANISM,
    massPerUnit: 3000,
    volumePerUnit: 1725,
    isAtomic: true
  },
  [IDS.CARBON_FIBER]: {
    i: IDS.CARBON_FIBER,
    name: 'Carbon Fiber',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.FABRIC,
    massPerUnit: 1000,
    volumePerUnit: 1750,
    isAtomic: false
  },
  [IDS.FOOD]: {
    i: IDS.FOOD,
    name: 'Food',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.FOOD,
    massPerUnit: 1000,
    volumePerUnit: 1250,
    isAtomic: false
  },
  [IDS.SMALL_PROPELLANT_TANK]: {
    i: IDS.SMALL_PROPELLANT_TANK,
    name: 'Small Propellant Tank',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.MECHANISM,
    massPerUnit: 6000,
    volumePerUnit: 87000,
    isAtomic: true
  },
  [IDS.BOROSILICATE_GLASS]: {
    i: IDS.BOROSILICATE_GLASS,
    name: 'Borosilicate Glass',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_GLASS,
    massPerUnit: 1000,
    volumePerUnit: 595,
    isAtomic: false
  },
  [IDS.BALL_BEARING]: {
    i: IDS.BALL_BEARING,
    name: 'Ball Bearing',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.MECHANISM,
    massPerUnit: 1000,
    volumePerUnit: 212,
    isAtomic: false
  },
  [IDS.LARGE_THRUST_BEARING]: {
    i: IDS.LARGE_THRUST_BEARING,
    name: 'Large Thrust Bearing',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.MECHANISM,
    massPerUnit: 2000000,
    volumePerUnit: 8640000,
    isAtomic: true
  },
  [IDS.BORON]: {
    i: IDS.BORON,
    name: 'Boron',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.NONMETAL,
    massPerUnit: 1000,
    volumePerUnit: 543,
    isAtomic: false
  },
  [IDS.LITHIUM]: {
    i: IDS.LITHIUM,
    name: 'Lithium',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 3770,
    isAtomic: false
  },
  [IDS.EPOXY]: {
    i: IDS.EPOXY,
    name: 'Epoxy',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ADHESIVE,
    massPerUnit: 1000,
    volumePerUnit: 1680,
    isAtomic: false
  },
  [IDS.NEODYMIUM_OXIDE]: {
    i: IDS.NEODYMIUM_OXIDE,
    name: 'Neodymium Oxide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 251,
    isAtomic: false
  },
  [IDS.YTTRIA]: {
    i: IDS.YTTRIA,
    name: 'Yttria',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 363,
    isAtomic: false
  },
  [IDS.SODIUM_DICHROMATE]: {
    i: IDS.SODIUM_DICHROMATE,
    name: 'Sodium Dichromate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 661,
    isAtomic: false
  },
  [IDS.NOVOLAK_PREPOLYMER_RESIN]: {
    i: IDS.NOVOLAK_PREPOLYMER_RESIN,
    name: 'Novolak Prepolymer Resin',
    classification: CLASSIFICATIONS.CROP,
    category: CATEGORIES.GROWN_ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 1020,
    isAtomic: false
  },
  [IDS.FERROMOLYBDENUM]: {
    i: IDS.FERROMOLYBDENUM,
    name: 'Ferromolybdenum',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ALLOY,
    massPerUnit: 1000,
    volumePerUnit: 168,
    isAtomic: false
  },
  [IDS.AMMONIUM_DIURANATE]: {
    i: IDS.AMMONIUM_DIURANATE,
    name: 'Ammonium Diuranate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 370,
    isAtomic: false
  },
  [IDS.AMMONIUM_PARATUNGSTATE]: {
    i: IDS.AMMONIUM_PARATUNGSTATE,
    name: 'Ammonium Paratungstate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 435,
    isAtomic: false
  },
  [IDS.ENGINE_BELL]: {
    i: IDS.ENGINE_BELL,
    name: 'Engine Bell',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 300000,
    volumePerUnit: 570000,
    isAtomic: true
  },
  [IDS.STEEL_TRUSS]: {
    i: IDS.STEEL_TRUSS,
    name: 'Steel Truss',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.HULL_MODULE,
    massPerUnit: 1500000,
    volumePerUnit: 21000000,
    isAtomic: true
  },
  [IDS.ALUMINIUM_HULL_PLATE]: {
    i: IDS.ALUMINIUM_HULL_PLATE,
    name: 'Aluminium Hull Plate',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.HULL_MODULE,
    massPerUnit: 600000,
    volumePerUnit: 50520000,
    isAtomic: true
  },
  [IDS.ALUMINIUM_TRUSS]: {
    i: IDS.ALUMINIUM_TRUSS,
    name: 'Aluminium Truss',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.HULL_MODULE,
    massPerUnit: 1000000,
    volumePerUnit: 21100000,
    isAtomic: true
  },
  [IDS.CARGO_MODULE]: {
    i: IDS.CARGO_MODULE,
    name: 'Cargo Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.HULL_MODULE,
    massPerUnit: 5000000,
    volumePerUnit: 347500000,
    isAtomic: true
  },
  [IDS.PRESSURE_VESSEL]: {
    i: IDS.PRESSURE_VESSEL,
    name: 'Pressure Vessel',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.HULL_MODULE,
    massPerUnit: 1850000,
    volumePerUnit: 262700000,
    isAtomic: true
  },
  [IDS.PROPELLANT_TANK]: {
    i: IDS.PROPELLANT_TANK,
    name: 'Propellant Tank',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.HULL_MODULE,
    massPerUnit: 3500000,
    volumePerUnit: 2047500000,
    isAtomic: true
  },
  [IDS.STAINLESS_STEEL]: {
    i: IDS.STAINLESS_STEEL,
    name: 'Stainless Steel',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ALLOY,
    massPerUnit: 1000,
    volumePerUnit: 140,
    isAtomic: false
  },
  [IDS.BARE_CIRCUIT_BOARD]: {
    i: IDS.BARE_CIRCUIT_BOARD,
    name: 'Bare Circuit Board',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 1000,
    volumePerUnit: 417,
    isAtomic: false
  },
  [IDS.FERRITE_BEAD_INDUCTOR]: {
    i: IDS.FERRITE_BEAD_INDUCTOR,
    name: 'Ferrite-bead Inductor',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 1000,
    volumePerUnit: 228,
    isAtomic: false
  },
  [IDS.CORE_DRILL_BIT]: {
    i: IDS.CORE_DRILL_BIT,
    name: 'Core Drill Bit',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.MECHANISM,
    massPerUnit: 2000,
    volumePerUnit: 17260,
    isAtomic: true
  },
  [IDS.CORE_DRILL_THRUSTER]: {
    i: IDS.CORE_DRILL_THRUSTER,
    name: 'Core Drill Thruster',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.MECHANISM,
    massPerUnit: 10000,
    volumePerUnit: 100000,
    isAtomic: true
  },
  [IDS.PARABOLIC_DISH]: {
    i: IDS.PARABOLIC_DISH,
    name: 'Parabolic Dish',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.MECHANISM,
    massPerUnit: 72000,
    volumePerUnit: 11808000,
    isAtomic: true
  },
  [IDS.PHOTOVOLTAIC_PANEL]: {
    i: IDS.PHOTOVOLTAIC_PANEL,
    name: 'Photovoltaic Panel',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 8000,
    volumePerUnit: 52640,
    isAtomic: true
  },
  [IDS.LIPO_BATTERY]: {
    i: IDS.LIPO_BATTERY,
    name: 'LiPo Battery',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 5000,
    volumePerUnit: 3160,
    isAtomic: true
  },
  [IDS.NEODYMIUM_TRICHLORIDE]: {
    i: IDS.NEODYMIUM_TRICHLORIDE,
    name: 'Neodymium Trichloride',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SALT,
    massPerUnit: 1000,
    volumePerUnit: 404,
    isAtomic: false
  },
  [IDS.CHROMIA]: {
    i: IDS.CHROMIA,
    name: 'Chromia',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 348,
    isAtomic: false
  },
  [IDS.PHOTORESIST_EPOXY]: {
    i: IDS.PHOTORESIST_EPOXY,
    name: 'Photoresist Epoxy',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ADHESIVE,
    massPerUnit: 1000,
    volumePerUnit: 1670,
    isAtomic: false
  },
  [IDS.URANIUM_DIOXIDE]: {
    i: IDS.URANIUM_DIOXIDE,
    name: 'Uranium Dioxide',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 165,
    isAtomic: false
  },
  [IDS.TUNGSTEN]: {
    i: IDS.TUNGSTEN,
    name: 'Tungsten',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 65,
    isAtomic: false
  },
  [IDS.SHUTTLE_HULL]: {
    i: IDS.SHUTTLE_HULL,
    name: 'Shuttle Hull',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.SHIP_HULL,
    massPerUnit: 44600000,
    volumePerUnit: 16011400000,
    isAtomic: true
  },
  [IDS.LIGHT_TRANSPORT_HULL]: {
    i: IDS.LIGHT_TRANSPORT_HULL,
    name: 'Light Transport Hull',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.SHIP_HULL,
    massPerUnit: 74200000,
    volumePerUnit: 35987000000,
    isAtomic: true
  },
  [IDS.CARGO_RING]: {
    i: IDS.CARGO_RING,
    name: 'Cargo Ring',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.HULL_MODULE,
    massPerUnit: 10000000,
    volumePerUnit: 1550000000,
    isAtomic: true
  },
  [IDS.HEAVY_TRANSPORT_HULL]: {
    i: IDS.HEAVY_TRANSPORT_HULL,
    name: 'Heavy Transport Hull',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.SHIP_HULL,
    massPerUnit: 480400000,
    volumePerUnit: 60530400000,
    isAtomic: true
  },
  [IDS.TUNGSTEN_POWDER]: {
    i: IDS.TUNGSTEN_POWDER,
    name: 'Tungsten Powder',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.POWDER,
    massPerUnit: 1000,
    volumePerUnit: 104,
    isAtomic: false
  },
  [IDS.HYDROGEN_PROPELLANT]: {
    i: IDS.HYDROGEN_PROPELLANT,
    name: 'Hydrogen Propellant',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.PROPELLANT,
    massPerUnit: 1000,
    volumePerUnit: 13300,
    isAtomic: false
  },
  [IDS.STAINLESS_STEEL_SHEET]: {
    i: IDS.STAINLESS_STEEL_SHEET,
    name: 'Stainless Steel Sheet',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 150,
    isAtomic: false
  },
  [IDS.STAINLESS_STEEL_PIPE]: {
    i: IDS.STAINLESS_STEEL_PIPE,
    name: 'Stainless Steel Pipe',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.PROCESSED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 1200,
    isAtomic: false
  },
  [IDS.CCD]: {
    i: IDS.CCD,
    name: 'CCD',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRO_OPTICAL,
    massPerUnit: 1000,
    volumePerUnit: 84,
    isAtomic: false
  },
  [IDS.COMPUTER_CHIP]: {
    i: IDS.COMPUTER_CHIP,
    name: 'Computer Chip',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 1000,
    volumePerUnit: 79,
    isAtomic: false
  },
  [IDS.CORE_DRILL]: {
    i: IDS.CORE_DRILL,
    name: 'Core Drill',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.TOOL,
    massPerUnit: 30000,
    volumePerUnit: 107100,
    isAtomic: true
  },
  [IDS.NEODYMIUM]: {
    i: IDS.NEODYMIUM,
    name: 'Neodymium',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_RARE_EARTH,
    massPerUnit: 1000,
    volumePerUnit: 178,
    isAtomic: false
  },
  [IDS.CHROMIUM]: {
    i: IDS.CHROMIUM,
    name: 'Chromium',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 174,
    isAtomic: false
  },
  [IDS.URANIUM_TETRAFLUORIDE]: {
    i: IDS.URANIUM_TETRAFLUORIDE,
    name: 'Uranium Tetrafluoride',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.FLUORIDE,
    massPerUnit: 1000,
    volumePerUnit: 271,
    isAtomic: false
  },
  [IDS.PURE_NITROGEN]: {
    i: IDS.PURE_NITROGEN,
    name: 'Pure Nitrogen',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_VOLATILE,
    massPerUnit: 1000,
    volumePerUnit: 1240,
    isAtomic: false
  },
  [IDS.ND_YAG_LASER_ROD]: {
    i: IDS.ND_YAG_LASER_ROD,
    name: 'Nd:YAG Laser Rod',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.CRYSTAL,
    massPerUnit: 1000,
    volumePerUnit: 242,
    isAtomic: false
  },
  [IDS.NICHROME]: {
    i: IDS.NICHROME,
    name: 'Nichrome',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.ALLOY,
    massPerUnit: 1000,
    volumePerUnit: 143,
    isAtomic: false
  },
  [IDS.NEODYMIUM_MAGNET]: {
    i: IDS.NEODYMIUM_MAGNET,
    name: 'Neodymium Magnet',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTROMECHANICAL,
    massPerUnit: 1000,
    volumePerUnit: 142,
    isAtomic: false
  },
  [IDS.UNENRICHED_URANIUM_HEXAFLUORIDE]: {
    i: IDS.UNENRICHED_URANIUM_HEXAFLUORIDE,
    name: 'Unenriched Uranium Hexafluoride',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.FLUORIDE,
    massPerUnit: 1000,
    volumePerUnit: 327,
    isAtomic: false
  },
  [IDS.HIGHLY_ENRICHED_URANIUM_HEXAFLUORIDE]: {
    i: IDS.HIGHLY_ENRICHED_URANIUM_HEXAFLUORIDE,
    name: 'Highly Enriched Uranium Hexafluoride',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.FLUORIDE,
    massPerUnit: 1000,
    volumePerUnit: 327,
    isAtomic: false
  },
  [IDS.ND_YAG_LASER]: {
    i: IDS.ND_YAG_LASER,
    name: 'Nd:YAG Laser',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRO_OPTICAL,
    massPerUnit: 1000,
    volumePerUnit: 385,
    isAtomic: false
  },
  [IDS.THIN_FILM_RESISTOR]: {
    i: IDS.THIN_FILM_RESISTOR,
    name: 'Thin-film Resistor',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 1000,
    volumePerUnit: 179,
    isAtomic: false
  },
  [IDS.HIGHLY_ENRICHED_URANIUM_POWDER]: {
    i: IDS.HIGHLY_ENRICHED_URANIUM_POWDER,
    name: 'Highly Enriched Uranium Powder',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_FISSILE,
    massPerUnit: 1000,
    volumePerUnit: 96,
    isAtomic: false
  },
  [IDS.LEACHED_FELDSPAR]: {
    i: IDS.LEACHED_FELDSPAR,
    name: 'Leached Feldspar',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SEMI_REFINED,
    massPerUnit: 1000,
    volumePerUnit: 689,
    isAtomic: false
  },
  [IDS.ROASTED_RHABDITE]: {
    i: IDS.ROASTED_RHABDITE,
    name: 'Roasted Rhabdite',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SEMI_REFINED,
    massPerUnit: 1000,
    volumePerUnit: 321,
    isAtomic: false
  },
  [IDS.RHABDITE_SLAG]: {
    i: IDS.RHABDITE_SLAG,
    name: 'Rhabdite Slag',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.SEMI_REFINED,
    massPerUnit: 1000,
    volumePerUnit: 561,
    isAtomic: false
  },
  [IDS.POTASSIUM_CARBONATE]: {
    i: IDS.POTASSIUM_CARBONATE,
    name: 'Potassium Carbonate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.CARBONATE,
    massPerUnit: 1000,
    volumePerUnit: 686,
    isAtomic: false
  },
  [IDS.HYDROGEN_HEPTAFLUOROTANTALATE_AND_NIOBATE]: {
    i: IDS.HYDROGEN_HEPTAFLUOROTANTALATE_AND_NIOBATE,
    name: 'Hydrogen Heptafluorotantalate and Niobate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.FLUORIDE,
    massPerUnit: 1000,
    volumePerUnit: 397,
    isAtomic: false
  },
  [IDS.LEAD]: {
    i: IDS.LEAD,
    name: 'Lead',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 110,
    isAtomic: false
  },
  [IDS.POTASSIUM_FLUORIDE]: {
    i: IDS.POTASSIUM_FLUORIDE,
    name: 'Potassium Fluoride',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.FLUORIDE,
    massPerUnit: 1000,
    volumePerUnit: 672,
    isAtomic: false
  },
  [IDS.POTASSIUM_HEPTAFLUOROTANTALATE]: {
    i: IDS.POTASSIUM_HEPTAFLUOROTANTALATE,
    name: 'Potassium Heptafluorotantalate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.FLUORIDE,
    massPerUnit: 1000,
    volumePerUnit: 365,
    isAtomic: false
  },
  [IDS.DIEPOXY_PREPOLYMER_RESIN]: {
    i: IDS.DIEPOXY_PREPOLYMER_RESIN,
    name: 'Diepoxy Prepolymer Resin',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 833,
    isAtomic: false
  },
  [IDS.TANTALUM]: {
    i: IDS.TANTALUM,
    name: 'Tantalum',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_METAL,
    massPerUnit: 1000,
    volumePerUnit: 75,
    isAtomic: false
  },
  [IDS.PEDOT]: {
    i: IDS.PEDOT,
    name: 'PEDOT',
    classification: CLASSIFICATIONS.CROP,
    category: CATEGORIES.GROWN_ORGANIC,
    massPerUnit: 1000,
    volumePerUnit: 989,
    isAtomic: false
  },
  [IDS.POLYMER_TANTALUM_CAPACITOR]: {
    i: IDS.POLYMER_TANTALUM_CAPACITOR,
    name: 'Polymer Tantalum Capacitor',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 1000,
    volumePerUnit: 256,
    isAtomic: false
  },
  [IDS.SURFACE_MOUNT_DEVICE_REEL]: {
    i: IDS.SURFACE_MOUNT_DEVICE_REEL,
    name: 'Surface Mount Device Reel',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 5000,
    volumePerUnit: 8550,
    isAtomic: true
  },
  [IDS.CIRCUIT_BOARD]: {
    i: IDS.CIRCUIT_BOARD,
    name: 'Circuit Board',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 1000,
    volumePerUnit: 500,
    isAtomic: false
  },
  [IDS.BRUSHLESS_MOTOR_STATOR]: {
    i: IDS.BRUSHLESS_MOTOR_STATOR,
    name: 'Brushless Motor Stator',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTROMECHANICAL,
    massPerUnit: 3000,
    volumePerUnit: 906,
    isAtomic: true
  },
  [IDS.BRUSHLESS_MOTOR_ROTOR]: {
    i: IDS.BRUSHLESS_MOTOR_ROTOR,
    name: 'Brushless Motor Rotor',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTROMECHANICAL,
    massPerUnit: 3000,
    volumePerUnit: 1308,
    isAtomic: true
  },
  [IDS.BRUSHLESS_MOTOR]: {
    i: IDS.BRUSHLESS_MOTOR,
    name: 'Brushless Motor',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTROMECHANICAL,
    massPerUnit: 6000,
    volumePerUnit: 1572,
    isAtomic: true
  },
  [IDS.LANDING_LEG]: {
    i: IDS.LANDING_LEG,
    name: 'Landing Leg',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.SHIP_PART,
    massPerUnit: 816000,
    volumePerUnit: 1876800,
    isAtomic: true
  },
  [IDS.LANDING_AUGER]: {
    i: IDS.LANDING_AUGER,
    name: 'Landing Auger',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.SHIP_PART,
    massPerUnit: 144000,
    volumePerUnit: 982080,
    isAtomic: true
  },
  [IDS.PUMP]: {
    i: IDS.PUMP,
    name: 'Pump',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTROMECHANICAL,
    massPerUnit: 8000,
    volumePerUnit: 6624,
    isAtomic: true
  },
  [IDS.RADIO_ANTENNA]: {
    i: IDS.RADIO_ANTENNA,
    name: 'Radio Antenna',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTROMECHANICAL,
    massPerUnit: 75000,
    volumePerUnit: 12150000,
    isAtomic: true
  },
  [IDS.FIBER_OPTIC_GYROSCOPE]: {
    i: IDS.FIBER_OPTIC_GYROSCOPE,
    name: 'Fiber Optic Gyroscope',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRO_OPTICAL,
    massPerUnit: 2000,
    volumePerUnit: 118,
    isAtomic: true
  },
  [IDS.STAR_TRACKER]: {
    i: IDS.STAR_TRACKER,
    name: 'Star Tracker',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRO_OPTICAL,
    massPerUnit: 2000,
    volumePerUnit: 94200,
    isAtomic: true
  },
  [IDS.COMPUTER]: {
    i: IDS.COMPUTER,
    name: 'Computer',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTRONICS,
    massPerUnit: 1000,
    volumePerUnit: 333,
    isAtomic: false
  },
  [IDS.CONTROL_MOMENT_GYROSCOPE]: {
    i: IDS.CONTROL_MOMENT_GYROSCOPE,
    name: 'Control Moment Gyroscope',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTROMECHANICAL,
    massPerUnit: 160000,
    volumePerUnit: 808000,
    isAtomic: true
  },
  [IDS.ROBOTIC_ARM]: {
    i: IDS.ROBOTIC_ARM,
    name: 'Robotic Arm',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.ELECTROMECHANICAL,
    massPerUnit: 300000,
    volumePerUnit: 3600000,
    isAtomic: true
  },
  [IDS.BERYLLIUM_CARBONATE]: {
    i: IDS.BERYLLIUM_CARBONATE,
    name: 'Beryllium Carbonate',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.CARBONATE,
    massPerUnit: 1000,
    volumePerUnit: 833,
    isAtomic: false
  },
  [IDS.BERYLLIA]: {
    i: IDS.BERYLLIA,
    name: 'Beryllia',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.OXIDE,
    massPerUnit: 1000,
    volumePerUnit: 509,
    isAtomic: false
  },
  [IDS.BERYLLIA_CERAMIC]: {
    i: IDS.BERYLLIA_CERAMIC,
    name: 'Beryllia Ceramic',
    classification: CLASSIFICATIONS.MANUFACTURED_GOOD,
    category: CATEGORIES.CERAMIC,
    massPerUnit: 1000,
    volumePerUnit: 414,
    isAtomic: false
  },
  [IDS.NEON]: {
    i: IDS.NEON,
    name: 'Neon',
    classification: CLASSIFICATIONS.REFINED_MATERIAL,
    category: CATEGORIES.REFINED_VOLATILE,
    massPerUnit: 1000,
    volumePerUnit: 7410,
    isAtomic: false
  },
  [IDS.HEAT_EXCHANGER]: {
    i: IDS.HEAT_EXCHANGER,
    name: 'Heat Exchanger',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 40000,
    volumePerUnit: 25440,
    isAtomic: true
  },
  [IDS.TURBOPUMP]: {
    i: IDS.TURBOPUMP,
    name: 'Turbopump',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 290000,
    volumePerUnit: 220110,
    isAtomic: true
  },
  [IDS.NEON_FUEL_SEPARATOR_CENTRIFUGE]: {
    i: IDS.NEON_FUEL_SEPARATOR_CENTRIFUGE,
    name: 'Neon/Fuel Separator Centrifuge',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 190000,
    volumePerUnit: 63460,
    isAtomic: true
  },
  [IDS.FUEL_MAKE_UP_TANK]: {
    i: IDS.FUEL_MAKE_UP_TANK,
    name: 'Fuel Make-up Tank',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 100000,
    volumePerUnit: 23400,
    isAtomic: true
  },
  [IDS.NEON_MAKE_UP_TANK]: {
    i: IDS.NEON_MAKE_UP_TANK,
    name: 'Neon Make-up Tank',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 250000,
    volumePerUnit: 116750,
    isAtomic: true
  },
  [IDS.LIGHTBULB_END_MODERATORS]: {
    i: IDS.LIGHTBULB_END_MODERATORS,
    name: 'Lightbulb End Moderators',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 130000,
    volumePerUnit: 112580,
    isAtomic: true
  },
  [IDS.FUSED_QUARTZ_LIGHTBULB_TUBE]: {
    i: IDS.FUSED_QUARTZ_LIGHTBULB_TUBE,
    name: 'Fused Quartz Lightbulb Tube',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 50000,
    volumePerUnit: 396000,
    isAtomic: true
  },
  [IDS.REACTOR_PLUMBING_ASSEMBLY]: {
    i: IDS.REACTOR_PLUMBING_ASSEMBLY,
    name: 'Reactor Plumbing Assembly',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 1942000,
    volumePerUnit: 6991200,
    isAtomic: true
  },
  [IDS.FLOW_DIVIDER_MODERATOR]: {
    i: IDS.FLOW_DIVIDER_MODERATOR,
    name: 'Flow Divider Moderator',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 18700000,
    volumePerUnit: 18139000,
    isAtomic: true
  },
  [IDS.NUCLEAR_LIGHTBULB]: {
    i: IDS.NUCLEAR_LIGHTBULB,
    name: 'Nuclear Lightbulb',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 180000,
    volumePerUnit: 583200,
    isAtomic: true
  },
  [IDS.COMPOSITE_OVERWRAPPED_REACTOR_SHELL]: {
    i: IDS.COMPOSITE_OVERWRAPPED_REACTOR_SHELL,
    name: 'Composite-overwrapped Reactor Shell',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 6000000,
    volumePerUnit: 51600000,
    isAtomic: true
  },
  [IDS.CLOSED_CYCLE_GAS_CORE_NUCLEAR_REACTOR_ENGINE]: {
    i: IDS.CLOSED_CYCLE_GAS_CORE_NUCLEAR_REACTOR_ENGINE,
    name: 'Closed-cycle Gas Core Nuclear Reactor Engine',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.ENGINE_PART,
    massPerUnit: 30000000,
    volumePerUnit: 54600000,
    isAtomic: true
  },
  [IDS.HABITATION_MODULE]: {
    i: IDS.HABITATION_MODULE,
    name: 'Habitation Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.INTEGRATION_MODULE,
    massPerUnit: 2200000,
    volumePerUnit: 264000000,
    isAtomic: true
  },
  [IDS.MOBILITY_MODULE]: {
    i: IDS.MOBILITY_MODULE,
    name: 'Mobility Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.INTEGRATION_MODULE,
    massPerUnit: 2000000,
    volumePerUnit: 4860000,
    isAtomic: true
  },
  [IDS.FLUIDS_AUTOMATION_MODULE]: {
    i: IDS.FLUIDS_AUTOMATION_MODULE,
    name: 'Fluids Automation Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.INTEGRATION_MODULE,
    massPerUnit: 3600000,
    volumePerUnit: 399600000,
    isAtomic: true
  },
  [IDS.SOLIDS_AUTOMATION_MODULE]: {
    i: IDS.SOLIDS_AUTOMATION_MODULE,
    name: 'Solids Automation Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.INTEGRATION_MODULE,
    massPerUnit: 3600000,
    volumePerUnit: 11736000,
    isAtomic: true
  },
  [IDS.TERRAIN_INTERFACE_MODULE]: {
    i: IDS.TERRAIN_INTERFACE_MODULE,
    name: 'Terrain Interface Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.INTEGRATION_MODULE,
    massPerUnit: 960000,
    volumePerUnit: 2976000,
    isAtomic: true
  },
  [IDS.AVIONICS_MODULE]: {
    i: IDS.AVIONICS_MODULE,
    name: 'Avionics Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.INTEGRATION_MODULE,
    massPerUnit: 500000,
    volumePerUnit: 12200000,
    isAtomic: true
  },
  [IDS.ESCAPE_MODULE]: {
    i: IDS.ESCAPE_MODULE,
    name: 'Escape Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.INTEGRATION_MODULE,
    massPerUnit: 6665000,
    volumePerUnit: 339915000,
    isAtomic: true
  },
  [IDS.ATTITUDE_CONTROL_MODULE]: {
    i: IDS.ATTITUDE_CONTROL_MODULE,
    name: 'Attitude Control Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.INTEGRATION_MODULE,
    massPerUnit: 660000,
    volumePerUnit: 2976600,
    isAtomic: true
  },
  [IDS.POWER_MODULE]: {
    i: IDS.POWER_MODULE,
    name: 'Power Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.INTEGRATION_MODULE,
    massPerUnit: 1000000,
    volumePerUnit: 3800000,
    isAtomic: true
  },
  [IDS.THERMAL_MODULE]: {
    i: IDS.THERMAL_MODULE,
    name: 'Thermal Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.INTEGRATION_MODULE,
    massPerUnit: 1000000,
    volumePerUnit: 399000,
    isAtomic: true
  },
  [IDS.PROPULSION_MODULE]: {
    i: IDS.PROPULSION_MODULE,
    name: 'Propulsion Module',
    classification: CLASSIFICATIONS.ASSEMBLY,
    category: CATEGORIES.INTEGRATION_MODULE,
    massPerUnit: 32000000,
    volumePerUnit: 106560000,
    isAtomic: true
  }
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

const getListByCategory = (category) => {
  return Object.values(IDS)
    .filter((i) => TYPES[i].category === category);
};

const getListByClassification = (classification) => {
  return Object.values(IDS)
    .filter((i) => TYPES[i].classification === classification);
};

export default {
  CATEGORIES,
  CLASSIFICATIONS,
  IDS,
  TYPES,

  getListByCategory,
  getListByClassification,
  getType
};
