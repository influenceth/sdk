import Processor from './processor.js';
import Product from './product.js';

const IDS = {
  WATER_ELECTROLYSIS: 23,
  WATER_VACUUM_EVAPORATION_DESALINATION: 24,
  SABATIER_PROCESS: 25,
  OLIVINE_ENHANCED_WEATHERING: 26,
  BITUMEN_HYDRO_CRACKING: 27,
  TAENITE_ELECTROLYTIC_REFINING: 28,
  CALCITE_CALCINATION: 29,
  HUELS_PROCESS: 30,
  AMMONIA_CARBONATION: 31,
  SALT_SULFIDIZATION_AND_PHOSPHORIZATION: 32,
  BASIC_FOOD_COOKING_AND_PACKAGING: 33,
  TROILITE_CENTRIFUGAL_FROTH_FLOTATION: 34,
  SILICA_FUSING: 35,
  SILICA_PULTRUSION: 36,
  COPPER_WIRE_DRAWING: 37,
  SALTY_CEMENT_MIXING: 38,
  SALT_SELECTIVE_CRYSTALLIZATION: 39,
  NAPHTHA_STEAM_CRACKING: 40,
  STEEL_ALLOYING: 41,
  SILICA_CARBOTHERMIC_REDUCTION: 42,
  OSTWALD_PROCESS: 43,
  WET_SULFURIC_ACID_PROCESS: 44,
  FUNGAL_SOILBUILDING: 45,
  IRON_OXIDE_AND_SILICA_CARBOTHERMIC_REDUCTION: 46,
  METHANE_STEAM_REFORMING_AND_WATER_GAS_SHIFT: 47,
  ACETYLENE_OXALIC_ACID_PRODUCTION: 48,
  LEAD_SULFIDE_SMELTING: 49,
  TIN_SULFIDE_SMELTING: 50,
  IRON_SULFIDE_ROASTING: 51,
  HABER_BOSCH_PROCESS: 52,
  MOLYBDENUM_DISULFIDE_ROASTING: 53,
  SILICA_GAS_ATOMIZATION: 54,
  SOLDER_MANUFACTURING: 55,
  QUARTZ_FILAMENT_DRAWING_AND_WRAPPING: 56,
  STEEL_BEAM_ROLLING: 57,
  STEEL_SHEET_ROLLING: 58,
  STEEL_PIPE_ROLLING: 59,
  STEEL_WIRE_DRAWING: 60,
  PROPYLENE_AMMOXIDATION: 61,
  PROPYLENE_POLYMERIZATION: 62,
  MAGNESIUM_CHLORIDE_MOLTEN_SALT_ELECTROLYSIS: 63,
  SOLVAY_PROCESS: 64,
  BORIA_HYDRATION: 65,
  PYROXENE_ACID_LEACHING_DIGESTION_AND_ION_EXCHANGE: 66,
  APATITE_ACID_EXTRACTION: 67,
  HYDROGEN_COMBUSTION: 68,
  CARBON_MONOXIDE_COMBUSTION: 69,
  BORAX_ACID_EXTRACTION: 70,
  NITROGEN_CRYOCOOLING_AND_FRACTIONAL_DISTILLATION: 71,
  OLIVINE_ACID_LEACHING_AND_CALCINING: 72,
  ANORTHITE_FELDSPAR_ACID_LEACHING_AND_CARBONATION: 73,
  SODIUM_CHLORALKALI_PROCESS: 74,
  POTASSIUM_CHLORALKALI_PROCESS: 75,
  APATITE_ACID_RE_EXTRACTION: 76,
  AMMONIUM_CARBONATE_OXALATION: 77,
  XENOTIME_HOT_ACID_LEACHING: 78,
  MERRILLITE_HOT_ACID_LEACHING: 79,
  AMMONIA_CATALYTIC_CRACKING: 80,
  URANINITE_ACID_LEACHING_SOLVENT_EXTRACTION_AND_PRECIPITATION: 81,
  COFFINITE_ACID_LEACHING_SOLVENT_EXTRACTION_AND_PRECIPITATION: 82,
  ALUMINA_FORMING_AND_SINTERING: 83,
  AUSTENITIC_NICHROME_ALLOYING: 84,
  COPPER_WIRE_INSULATING: 85,
  SILICON_CZOCHRALSKI_PROCESS_AND_WAFER_SLICING: 86,
  STEEL_CABLE_LAYING: 87,
  ACRYLONITRILE_POLYMERIZATION: 88,
  SOYBEAN_GROWING: 89,
  BORIC_ACID_THERMAL_DECOMPOSITION: 90,
  LITHIUM_CARBONATE_CHLORINATION: 91,
  LITHIUM_SULFATE_CARBONATION: 92,
  IRON_OXIDE_DIRECT_REDUCTION: 93,
  ZINC_OXIDE_DIRECT_REDUCTION: 94,
  NICKEL_OXIDE_DIRECT_REDUCTION: 95,
  PIDGEON_PROCESS: 96,
  POLYPROPYLENE_CHLORINATION_AND_BASIFICATION: 97,
  POTATO_GROWING: 98,
  RARE_EARTH_SULFATES_OXALATION_AND_CALCINATION: 99,
  AMMONIA_CHLORINATION: 100,
  HALL_HEROULT_PROCESS: 101,
  CALCIUM_CHLORIDE_MOLTEN_SALT_ELECTROLYSIS: 102,
  CEMENT_MIXING: 103,
  NATURAL_FLAVORINGS_GROWING: 104,
  YELLOWCAKE_DIGESTION_SOLVENT_EXTRACTION_AND_PRECIPITATION: 105,
  HYDROFLUORIC_ACID_COLD_ELECTROLYSIS: 106,
  RHABDITE_ROASTING_AND_ACID_EXTRACTION: 107,
  FERRITE_SINTERING: 108,
  DIODE_DOPING_AND_ASSEMBLY: 109,
  BALL_VALVE_MACHINING: 110,
  ALUMINIUM_BEAM_ROLLING: 111,
  ALUMINIUM_SHEET_ROLLING: 112,
  ALUMINIUM_PIPE_ROLLING: 113,
  POLYACRYLONITRILE_WEAVING: 114,
  COLD_GAS_THRUSTER_PRINTING: 115,
  POLYACRYLONITRILE_OXIDATION_AND_CARBONIZATION: 116,
  ALUMINIUM_SMALL_PROPELLANT_TANK_ASSEMBLY: 117,
  BOROSILICATE_GLASSMAKING: 118,
  BALL_BEARING_MACHINING_AND_ASSEMBLY: 119,
  LARGE_THRUST_BEARING_MACHINING_AND_ASSEMBLY: 120,
  BORIA_MAGNESIOTHERMIC_REDUCTION: 121,
  LITHIUM_CHLORIDE_MOLTEN_SALT_ELECTROLYSIS: 122,
  DIEPOXY_STEP_GROWTH_POLYMERIZATION: 123,
  RARE_EARTH_OXIDES_ION_EXCHANGE: 124,
  CALCIUM_OXIDE_ALUMINOTHERMIC_REDUCTION: 125,
  SODIUM_CHROMATE_ACIDIFICATION_AND_CRYSTALLIZATION: 126,
  SULFURIC_ACID_HOT_CATALYTIC_REDUCTION: 127,
  MOLYBDENUM_TRIOXIDE_ALUMINOTHERMIC_REDUCTION_AND_ALLOYING: 128,
  URANYL_NITRATE_REDOX_AND_PRECIPITATION: 129,
  SODIUM_TUNGSTATE_ION_EXCHANGE_PRECIPITATION_AND_CRYSTALLIZATION: 130,
  STAINLESS_STEEL_ALLOYING: 131,
  BOARD_PRINTING: 132,
  FERRITE_BEAD_INDUCTOR_WINDING: 133,
  CORE_DRILL_BIT_MILLING: 134,
  CORE_DRILL_THRUSTER_ASSEMBLY: 135,
  PARABOLIC_DISH_ASSEMBLY: 136,
  PHOTOVOLTAIC_PANEL_AMORPHIZATION_AND_ASSEMBLY: 137,
  LIPO_BATTERY_ASSEMBLY: 138,
  NEODYMIUM_OXIDE_CHLORINATION: 139,
  SODIUM_DICHROMATE_HOT_SULFUR_REDUCTION: 141,
  PHOTORESIST_EPOXY_STOICHIOMETRY_AND_PACKAGING: 142,
  AMMONIUM_DIURANATE_CALCINATION_AND_HYDROGEN_REDUCTION: 143,
  AMMONIUM_PARATUNGSTATE_CALCINATION_AND_HYDROGEN_REDUCTION: 144,
  ENGINE_BELL_ADDITIVE_MANUFACTURING: 145,
  STEEL_TRUSS_CONSTRUCTION: 146,
  ALUMINIUM_HULL_PLATE_CONSTRUCTION: 147,
  ALUMINIUM_TRUSS_CONSTRUCTION: 148,
  CARGO_MODULE_CONSTRUCTION: 149,
  ALUMINIUM_PRESSURE_VESSEL_CONSTRUCTION: 150,
  ALUMINIUM_PROPELLANT_TANK_CONSTRUCTION: 151,
  SHUTTLE_HULL_CONSTRUCTION: 152,
  LIGHT_TRANSPORT_HULL_CONSTRUCTION: 153,
  CARGO_RING_CONSTRUCTION: 154,
  HEAVY_TRANSPORT_HULL_CONSTRUCTION: 155,
  TUNGSTEN_GAS_ATOMIZATION: 156,
  HYDROGEN_CRYOCOOLING_AND_REACTOR_CONSUMABLES_STOICHIOMETRY: 157,
  STAINLESS_STEEL_SHEET_ROLLING: 158,
  STAINLESS_STEEL_PIPE_ROLLING: 159,
  SILICON_WAFER_CPU_PHOTOLITHOGRAPHY_BALL_BONDING_AND_ENCAPSULATION: 160,
  CORE_DRILL_ASSEMBLY: 161,
  NEODYMIUM_TRICHLORIDE_VACUUM_CALCIOTHERMIC_REDUCTION: 162,
  NEODYMIUM_TRICHLORIDE_MOLTEN_SALT_ELECTROLYSIS: 163,
  CHROMIA_ALUMINOTHERMIC_REDUCTION: 165,
  URANIUM_DIOXIDE_OXIDATION: 166,
  LEACHED_COFFINITE_FROTH_FLOTATION_SOLVENT_EXTRACTION_AND_PRECIPITATION: 167,
  ND_YAG_CZOCHRALSKI_PROCESS: 168,
  NICHROME_ALLOYING: 169,
  MAGNET_SINTERING_AND_MAGNETIZATION: 170,
  URANIUM_TETRAFLUORIDE_OXIDATION: 171,
  URANIUM_HEXAFLUORIDE_CENTRIFUGE_CASCADE_ENRICHMENT: 172,
  ND_YAG_LASER_ASSEMBLY: 173,
  THIN_FILM_RESISTOR_SPUTTERING_AND_LASER_TRIMMING: 174,
  HEUF6_MAGNESIOTHERMIC_REDUCTION_AND_FINE_DIVISION: 175,
  SPIRULINA_AND_CHLORELLA_ALGAE_GROWING: 176,
  PEDOT_BACTERIA_CULTURING: 177,
  BPA_BACTERIA_CULTURING: 178,
  POTASSIUM_HYDROXIDE_CARBONATION: 179,
  NOVOLAK_BACTERIA_CULTURING: 180,
  FERROCHROMIUM_ALLOYING: 181,
  POTASSIUM_CARBONATE_OXIDATION: 182,
  RHABDITE_SLAG_ACID_LEACHING: 183,
  TANTALATE_NIOBATE_LIQUID_LIQUID_EXTRACTION_AND_REDOX: 184,
  CARBON_DIOXIDE_FERROCATALYSIS: 185,
  POTASSIUM_HEPTAFLUOROTANTALATE_SODIOTHERMIC_REDUCTION: 186,
  RHABDITE_CARBOTHERMIC_REDUCTION: 187,
  POLYMER_TANTALUM_CAPACITOR_ASSEMBLY: 188,
  SURFACE_MOUNT_DEVICE_REEL_ASSEMBLY: 189,
  PICK_AND_PLACE_BOARD_POPULATION: 190,
  MOTOR_STATOR_ASSEMBLY: 191,
  MOTOR_ROTOR_ASSEMBLY: 192,
  BRUSHLESS_MOTOR_ASSEMBLY: 193,
  LANDING_LEG_ASSEMBLY: 194,
  LANDING_AUGER_ASSEMBLY: 195,
  PUMP_ASSEMBLY: 196,
  ANTENNA_ASSEMBLY: 197,
  FIBER_OPTIC_GYROSCOPE_ASSEMBLY: 198,
  STAR_TRACKER_ASSEMBLY: 199,
  COMPUTER_ASSEMBLY: 200,
  CONTROL_MOMENT_GYROSCOPE_ASSEMBLY: 201,
  ROBOTIC_ARM_ASSEMBLY: 202,
  FELDSPAR_ALUMINIUM_HYDROXIDE_CALCINATION: 203,
  FERROCHROMIUM_ROASTING_AND_HOT_BASE_LEACHING: 204,
  BERYLLIUM_CARBONATE_CALCINATION: 205,
  BERYLLIA_FORMING_AND_SINTERING: 206,
  SILICON_WAFER_CCD_PHOTOLITHOGRAPHY_BALL_BONDING_AND_PACKAGING: 207,
  HEAT_EXCHANGER_ASSEMBLY: 208,
  TURBOPUMP_ASSEMBLY: 209,
  LASER_DIODE_DOPING_AMORPHIZATION_AND_ASSEMBLY: 210,
  SEPARATOR_CENTRIFUGE_ASSEMBLY: 211,
  FUEL_MAKE_UP_TANK_ASSEMBLY: 212,
  NEON_MAKE_UP_TANK_ASSEMBLY: 213,
  LIGHTBULB_END_MODERATORS_ASSEMBLY: 214,
  COLD_GAS_TORQUE_THRUSTER_PRINTING: 215,
  FUSED_QUARTZ_LIGHTBULB_ADDITIVE_SUBTRACTIVE_ASSEMBLY: 216,
  REACTOR_PLUMBING_ASSEMBLY_SQUARED: 217,
  FLOW_DIVIDER_MODERATOR_ASSEMBLY: 218,
  NUCLEAR_LIGHTBULB_ASSEMBLY: 219,
  REACTOR_SHELL_ASSEMBLY: 220,
  CLOSED_CYCLE_GAS_CORE_NUCLEAR_REACTOR_ENGINE_ASSEMBLY: 221,
  HABITATION_MODULE_ASSEMBLY: 222,
  MOBILITY_MODULE_ASSEMBLY: 223,
  FLUIDS_AUTOMATION_MODULE_ASSEMBLY: 224,
  SOLIDS_AUTOMATION_MODULE_ASSEMBLY: 225,
  TERRAIN_INTERFACE_MODULE_ASSEMBLY: 226,
  AVIONICS_MODULE_ASSEMBLY: 227,
  ESCAPE_MODULE_ASSEMBLY: 228,
  ATTITUDE_CONTROL_MODULE_ASSEMBLY: 229,
  POWER_MODULE_ASSEMBLY: 230,
  THERMAL_MODULE_ASSEMBLY: 231,
  PROPULSION_MODULE_ASSEMBLY: 232,
  SULFUR_DIOXIDE_PLASMA_CATALYSIS: 233,
  PARKES_PROCESS: 234,
  BICARBONATE_SOLVAY_PROCESS: 235,
  SOLVAY_HOU_PROCESS: 236,
  BICARBONATE_SOLVAY_HOU_PROCESS: 237,
  SODIUM_BICARBONATE_CALCINATION: 238,
  EPOXY_STOICHIOMETRY_AND_PACKAGING: 239,
  PEDOT_ALGAE_GROWING: 240,
  BPA_ALGAE_GROWING: 241,
  NOVOLAK_ALGAE_GROWING: 242,
  HYDROCHLORIC_REDOX: 243,
  HYDROFLUORIC_REDOX: 244,
  METHANE_COMBUSTION: 245,
  CARBON_MONOXIDE_ARC_DECOMPOSITION: 246,
  HYDROGEN_PROPELLANT_UNBUNDLING: 247
};

const TYPES = {
  [IDS.WATER_ELECTROLYSIS]: {
    i: IDS.WATER_ELECTROLYSIS,
    name: 'Water Electrolysis',
    processorType: Processor.IDS.REFINERY,
    setupTime: 7200,
    recipeTime: 18.72,
    batched: false,
    inputs: {
      [Product.IDS.DEIONIZED_WATER]: 9
    },
    outputs: {
      [Product.IDS.HYDROGEN]: 1,
      [Product.IDS.OXYGEN]: 8
    }
  },
  [IDS.WATER_VACUUM_EVAPORATION_DESALINATION]: {
    i: IDS.WATER_VACUUM_EVAPORATION_DESALINATION,
    name: 'Water Vacuum-evaporation Desalination',
    processorType: Processor.IDS.REFINERY,
    setupTime: 57600,
    recipeTime: 4.536,
    batched: false,
    inputs: {
      [Product.IDS.WATER]: 20
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 19,
      [Product.IDS.RAW_SALTS]: 1
    }
  },
  [IDS.SABATIER_PROCESS]: {
    i: IDS.SABATIER_PROCESS,
    name: 'Sabatier Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 86400,
    recipeTime: 3.744,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN]: 8,
      [Product.IDS.CARBON_DIOXIDE]: 44
    },
    outputs: {
      [Product.IDS.METHANE]: 16,
      [Product.IDS.DEIONIZED_WATER]: 36
    }
  },
  [IDS.OLIVINE_ENHANCED_WEATHERING]: {
    i: IDS.OLIVINE_ENHANCED_WEATHERING,
    name: 'Olivine Enhanced Weathering',
    processorType: Processor.IDS.REFINERY,
    setupTime: 1209600,
    recipeTime: 464.4,
    batched: false,
    inputs: {
      [Product.IDS.CARBON_DIOXIDE]: 1936,
      [Product.IDS.OLIVINE]: 4526
    },
    outputs: {
      [Product.IDS.SILICA]: 1322,
      [Product.IDS.WEATHERED_OLIVINE]: 5140
    }
  },
  [IDS.BITUMEN_HYDRO_CRACKING]: {
    i: IDS.BITUMEN_HYDRO_CRACKING,
    name: 'Bitumen Hydro-cracking',
    processorType: Processor.IDS.REFINERY,
    setupTime: 43200,
    recipeTime: 37.44,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN]: 7,
      [Product.IDS.BITUMEN]: 200
    },
    outputs: {
      [Product.IDS.NAPHTHA]: 60
    }
  },
  [IDS.TAENITE_ELECTROLYTIC_REFINING]: {
    i: IDS.TAENITE_ELECTROLYTIC_REFINING,
    name: 'Taenite Electrolytic Refining',
    processorType: Processor.IDS.REFINERY,
    setupTime: 86400,
    recipeTime: 27,
    batched: false,
    inputs: {
      [Product.IDS.TAENITE]: 20
    },
    outputs: {
      [Product.IDS.IRON]: 15,
      [Product.IDS.COPPER]: 1,
      [Product.IDS.NICKEL]: 3
    }
  },
  [IDS.CALCITE_CALCINATION]: {
    i: IDS.CALCITE_CALCINATION,
    name: 'Calcite Calcination',
    processorType: Processor.IDS.REFINERY,
    setupTime: 7200,
    recipeTime: 7.2,
    batched: false,
    inputs: {
      [Product.IDS.CALCITE]: 100
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.QUICKLIME]: 56
    }
  },
  [IDS.HUELS_PROCESS]: {
    i: IDS.HUELS_PROCESS,
    name: 'Huels Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 28800,
    recipeTime: 109.44,
    batched: false,
    inputs: {
      [Product.IDS.METHANE]: 16
    },
    outputs: {
      [Product.IDS.ACETYLENE]: 13
    }
  },
  [IDS.AMMONIA_CARBONATION]: {
    i: IDS.AMMONIA_CARBONATION,
    name: 'Ammonia Carbonation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 14400,
    recipeTime: 17.28,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 34,
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.DEIONIZED_WATER]: 18
    },
    outputs: {
      [Product.IDS.AMMONIUM_CARBONATE]: 96
    }
  },
  [IDS.SALT_SULFIDIZATION_AND_PHOSPHORIZATION]: {
    i: IDS.SALT_SULFIDIZATION_AND_PHOSPHORIZATION,
    name: 'Salt Sulfidization and Phosphorization',
    processorType: Processor.IDS.REFINERY,
    setupTime: 7200,
    recipeTime: 0.144,
    batched: false,
    inputs: {
      [Product.IDS.RAW_SALTS]: 8,
      [Product.IDS.IRON]: 2,
      [Product.IDS.SULFURIC_ACID]: 6,
      [Product.IDS.PHOSPHORIC_ACID]: 4
    },
    outputs: {
      [Product.IDS.PHOSPHATE_AND_SULFATE_SALTS]: 17
    }
  },
  [IDS.BASIC_FOOD_COOKING_AND_PACKAGING]: {
    i: IDS.BASIC_FOOD_COOKING_AND_PACKAGING,
    name: 'Basic Food Cooking and Packaging',
    processorType: Processor.IDS.FACTORY,
    setupTime: 144000,
    recipeTime: 86.4,
    batched: false,
    inputs: {
      [Product.IDS.SODIUM_CHLORIDE]: 1,
      [Product.IDS.SPIRULINA_AND_CHLORELLA_ALGAE]: 120,
      [Product.IDS.SOYBEANS]: 160,
      [Product.IDS.POTATOES]: 160,
      [Product.IDS.NATURAL_FLAVORINGS]: 39
    },
    outputs: {
      [Product.IDS.FOOD]: 480
    }
  },
  [IDS.TROILITE_CENTRIFUGAL_FROTH_FLOTATION]: {
    i: IDS.TROILITE_CENTRIFUGAL_FROTH_FLOTATION,
    name: 'Troilite Centrifugal Froth Flotation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 43200,
    recipeTime: 14.544,
    batched: false,
    inputs: {
      [Product.IDS.TROILITE]: 100,
      [Product.IDS.SULFURIC_ACID]: 10
    },
    outputs: {
      [Product.IDS.IRON_SULFIDE]: 80,
      [Product.IDS.LEAD_SULFIDE]: 8,
      [Product.IDS.TIN_SULFIDE]: 2,
      [Product.IDS.MOLYBDENUM_DISULFIDE]: 5
    }
  },
  [IDS.SILICA_FUSING]: {
    i: IDS.SILICA_FUSING,
    name: 'Silica Fusing',
    processorType: Processor.IDS.FACTORY,
    setupTime: 43200,
    recipeTime: 0.479,
    batched: false,
    inputs: {
      [Product.IDS.SILICA]: 1
    },
    outputs: {
      [Product.IDS.FUSED_QUARTZ]: 1
    }
  },
  [IDS.SILICA_PULTRUSION]: {
    i: IDS.SILICA_PULTRUSION,
    name: 'Silica Pultrusion',
    processorType: Processor.IDS.FACTORY,
    setupTime: 108000,
    recipeTime: 0.45,
    batched: false,
    inputs: {
      [Product.IDS.SILICA]: 1
    },
    outputs: {
      [Product.IDS.FIBERGLASS]: 1
    }
  },
  [IDS.COPPER_WIRE_DRAWING]: {
    i: IDS.COPPER_WIRE_DRAWING,
    name: 'Copper Wire Drawing',
    processorType: Processor.IDS.FACTORY,
    setupTime: 86400,
    recipeTime: 0.225,
    batched: false,
    inputs: {
      [Product.IDS.COPPER]: 1
    },
    outputs: {
      [Product.IDS.BARE_COPPER_WIRE]: 1
    }
  },
  [IDS.SALTY_CEMENT_MIXING]: {
    i: IDS.SALTY_CEMENT_MIXING,
    name: 'Salty Cement Mixing',
    processorType: Processor.IDS.REFINERY,
    setupTime: 21600,
    recipeTime: 0.297,
    batched: false,
    inputs: {
      [Product.IDS.WATER]: 5,
      [Product.IDS.QUICKLIME]: 3
    },
    outputs: {
      [Product.IDS.CEMENT]: 7
    }
  },
  [IDS.SALT_SELECTIVE_CRYSTALLIZATION]: {
    i: IDS.SALT_SELECTIVE_CRYSTALLIZATION,
    name: 'Salt Selective Crystallization',
    processorType: Processor.IDS.REFINERY,
    setupTime: 259200,
    recipeTime: 36,
    batched: false,
    inputs: {
      [Product.IDS.RAW_SALTS]: 100
    },
    outputs: {
      [Product.IDS.SODIUM_CHLORIDE]: 46,
      [Product.IDS.POTASSIUM_CHLORIDE]: 29,
      [Product.IDS.BORAX]: 2,
      [Product.IDS.LITHIUM_CARBONATE]: 13,
      [Product.IDS.MAGNESIUM_CHLORIDE]: 6,
      [Product.IDS.CALCIUM_CHLORIDE]: 5
    }
  },
  [IDS.NAPHTHA_STEAM_CRACKING]: {
    i: IDS.NAPHTHA_STEAM_CRACKING,
    name: 'Naphtha Steam-cracking',
    processorType: Processor.IDS.REFINERY,
    setupTime: 36000,
    recipeTime: 0.72,
    batched: false,
    inputs: {
      [Product.IDS.DEIONIZED_WATER]: 4,
      [Product.IDS.NAPHTHA]: 16
    },
    outputs: {
      [Product.IDS.PROPYLENE]: 3
    }
  },
  [IDS.STEEL_ALLOYING]: {
    i: IDS.STEEL_ALLOYING,
    name: 'Steel Alloying',
    processorType: Processor.IDS.REFINERY,
    setupTime: 86400,
    recipeTime: 162,
    batched: false,
    inputs: {
      [Product.IDS.GRAPHITE]: 5,
      [Product.IDS.IRON]: 994,
      [Product.IDS.CALCIUM]: 1
    },
    outputs: {
      [Product.IDS.STEEL]: 1000
    }
  },
  [IDS.SILICA_CARBOTHERMIC_REDUCTION]: {
    i: IDS.SILICA_CARBOTHERMIC_REDUCTION,
    name: 'Silica Carbothermic Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 43200,
    recipeTime: 110.88,
    batched: false,
    inputs: {
      [Product.IDS.GRAPHITE]: 24,
      [Product.IDS.SILICA]: 60
    },
    outputs: {
      [Product.IDS.CARBON_MONOXIDE]: 56,
      [Product.IDS.SILICON]: 28
    }
  },
  [IDS.OSTWALD_PROCESS]: {
    i: IDS.OSTWALD_PROCESS,
    name: 'Ostwald Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 54000,
    recipeTime: 10.8,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 17,
      [Product.IDS.OXYGEN]: 64,
      [Product.IDS.DEIONIZED_WATER]: 24
    },
    outputs: {
      [Product.IDS.NITRIC_ACID]: 87
    }
  },
  [IDS.WET_SULFURIC_ACID_PROCESS]: {
    i: IDS.WET_SULFURIC_ACID_PROCESS,
    name: 'Wet Sulfuric Acid Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 28800,
    recipeTime: 7.2,
    batched: false,
    inputs: {
      [Product.IDS.SULFUR_DIOXIDE]: 64,
      [Product.IDS.OXYGEN]: 16,
      [Product.IDS.DEIONIZED_WATER]: 18
    },
    outputs: {
      [Product.IDS.SULFURIC_ACID]: 98
    }
  },
  [IDS.FUNGAL_SOILBUILDING]: {
    i: IDS.FUNGAL_SOILBUILDING,
    name: 'Fungal Soilbuilding',
    processorType: Processor.IDS.BIOREACTOR,
    setupTime: 108000,
    recipeTime: 10368000,
    batched: true,
    inputs: {
      [Product.IDS.BITUMEN]: 300000,
      [Product.IDS.DEIONIZED_WATER]: 200000
    },
    outputs: {
      [Product.IDS.SOIL]: 500000
    }
  },
  [IDS.IRON_OXIDE_AND_SILICA_CARBOTHERMIC_REDUCTION]: {
    i: IDS.IRON_OXIDE_AND_SILICA_CARBOTHERMIC_REDUCTION,
    name: 'Iron Oxide and Silica Carbothermic Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 72000,
    recipeTime: 802.8,
    batched: false,
    inputs: {
      [Product.IDS.GRAPHITE]: 123,
      [Product.IDS.SILICA]: 320,
      [Product.IDS.IRON_OXIDE]: 232
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 451,
      [Product.IDS.FERROSILICON]: 224
    }
  },
  [IDS.METHANE_STEAM_REFORMING_AND_WATER_GAS_SHIFT]: {
    i: IDS.METHANE_STEAM_REFORMING_AND_WATER_GAS_SHIFT,
    name: 'Methane Steam Reforming and Water-gas Shift',
    processorType: Processor.IDS.REFINERY,
    setupTime: 86400,
    recipeTime: 7.344,
    batched: false,
    inputs: {
      [Product.IDS.METHANE]: 16,
      [Product.IDS.DEIONIZED_WATER]: 18
    },
    outputs: {
      [Product.IDS.HYDROGEN]: 6,
      [Product.IDS.CARBON_MONOXIDE]: 28
    }
  },
  [IDS.ACETYLENE_OXALIC_ACID_PRODUCTION]: {
    i: IDS.ACETYLENE_OXALIC_ACID_PRODUCTION,
    name: 'Acetylene Oxalic Acid Production',
    processorType: Processor.IDS.REFINERY,
    setupTime: 57600,
    recipeTime: 29.7,
    batched: false,
    inputs: {
      [Product.IDS.ACETYLENE]: 39,
      [Product.IDS.NITRIC_ACID]: 126
    },
    outputs: {
      [Product.IDS.OXALIC_ACID]: 135
    }
  },
  [IDS.LEAD_SULFIDE_SMELTING]: {
    i: IDS.LEAD_SULFIDE_SMELTING,
    name: 'Lead Sulfide Smelting',
    processorType: Processor.IDS.REFINERY,
    setupTime: 64800,
    recipeTime: 1224,
    batched: false,
    inputs: {
      [Product.IDS.CARBON_MONOXIDE]: 1344,
      [Product.IDS.OXYGEN]: 2304,
      [Product.IDS.LEAD_SULFIDE]: 11485
    },
    outputs: {
      [Product.IDS.SULFUR_DIOXIDE]: 3072,
      [Product.IDS.CARBON_DIOXIDE]: 2112,
      [Product.IDS.LEAD]: 10049
    }
  },
  [IDS.TIN_SULFIDE_SMELTING]: {
    i: IDS.TIN_SULFIDE_SMELTING,
    name: 'Tin Sulfide Smelting',
    processorType: Processor.IDS.REFINERY,
    setupTime: 79200,
    recipeTime: 59.4,
    batched: false,
    inputs: {
      [Product.IDS.CARBON_MONOXIDE]: 56,
      [Product.IDS.CALCITE]: 6,
      [Product.IDS.OXYGEN]: 108,
      [Product.IDS.TIN_SULFIDE]: 270
    },
    outputs: {
      [Product.IDS.SULFUR_DIOXIDE]: 128,
      [Product.IDS.CARBON_DIOXIDE]: 88,
      [Product.IDS.TIN]: 238
    }
  },
  [IDS.IRON_SULFIDE_ROASTING]: {
    i: IDS.IRON_SULFIDE_ROASTING,
    name: 'Iron Sulfide Roasting',
    processorType: Processor.IDS.REFINERY,
    setupTime: 72000,
    recipeTime: 38.16,
    batched: false,
    inputs: {
      [Product.IDS.OXYGEN]: 160,
      [Product.IDS.IRON_SULFIDE]: 264
    },
    outputs: {
      [Product.IDS.SULFUR_DIOXIDE]: 192,
      [Product.IDS.IRON_OXIDE]: 232
    }
  },
  [IDS.HABER_BOSCH_PROCESS]: {
    i: IDS.HABER_BOSCH_PROCESS,
    name: 'Haber-Bosch Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 50400,
    recipeTime: 78.48,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN]: 6,
      [Product.IDS.PURE_NITROGEN]: 28
    },
    outputs: {
      [Product.IDS.AMMONIA]: 34
    }
  },
  [IDS.MOLYBDENUM_DISULFIDE_ROASTING]: {
    i: IDS.MOLYBDENUM_DISULFIDE_ROASTING,
    name: 'Molybdenum Disulfide Roasting',
    processorType: Processor.IDS.REFINERY,
    setupTime: 86400,
    recipeTime: 58.68,
    batched: false,
    inputs: {
      [Product.IDS.OXYGEN]: 224,
      [Product.IDS.MOLYBDENUM_DISULFIDE]: 320
    },
    outputs: {
      [Product.IDS.SULFUR_DIOXIDE]: 256,
      [Product.IDS.MOLYBDENUM_TRIOXIDE]: 288
    }
  },
  [IDS.SILICA_GAS_ATOMIZATION]: {
    i: IDS.SILICA_GAS_ATOMIZATION,
    name: 'Silica Gas Atomization',
    processorType: Processor.IDS.FACTORY,
    setupTime: 28800,
    recipeTime: 0.288,
    batched: false,
    inputs: {
      [Product.IDS.SILICA]: 1
    },
    outputs: {
      [Product.IDS.SILICA_POWDER]: 1
    }
  },
  [IDS.SOLDER_MANUFACTURING]: {
    i: IDS.SOLDER_MANUFACTURING,
    name: 'Solder Manufacturing',
    processorType: Processor.IDS.FACTORY,
    setupTime: 72000,
    recipeTime: 108,
    batched: false,
    inputs: {
      [Product.IDS.COPPER]: 1,
      [Product.IDS.SILVER]: 6,
      [Product.IDS.TIN]: 143
    },
    outputs: {
      [Product.IDS.SOLDER]: 150
    }
  },
  [IDS.QUARTZ_FILAMENT_DRAWING_AND_WRAPPING]: {
    i: IDS.QUARTZ_FILAMENT_DRAWING_AND_WRAPPING,
    name: 'Quartz Filament Drawing and Wrapping',
    processorType: Processor.IDS.FACTORY,
    setupTime: 144000,
    recipeTime: 360,
    batched: false,
    inputs: {
      [Product.IDS.FUSED_QUARTZ]: 1,
      [Product.IDS.POLYPROPYLENE]: 4
    },
    outputs: {
      [Product.IDS.FIBER_OPTIC_CABLE]: 5
    }
  },
  [IDS.STEEL_BEAM_ROLLING]: {
    i: IDS.STEEL_BEAM_ROLLING,
    name: 'Steel Beam Rolling',
    processorType: Processor.IDS.FACTORY,
    setupTime: 90000,
    recipeTime: 0.083,
    batched: false,
    inputs: {
      [Product.IDS.STEEL]: 1
    },
    outputs: {
      [Product.IDS.STEEL_BEAM]: 1
    }
  },
  [IDS.STEEL_SHEET_ROLLING]: {
    i: IDS.STEEL_SHEET_ROLLING,
    name: 'Steel Sheet Rolling',
    processorType: Processor.IDS.FACTORY,
    setupTime: 79200,
    recipeTime: 0.09,
    batched: false,
    inputs: {
      [Product.IDS.STEEL]: 1
    },
    outputs: {
      [Product.IDS.STEEL_SHEET]: 1
    }
  },
  [IDS.STEEL_PIPE_ROLLING]: {
    i: IDS.STEEL_PIPE_ROLLING,
    name: 'Steel Pipe Rolling',
    processorType: Processor.IDS.FACTORY,
    setupTime: 97200,
    recipeTime: 0.103,
    batched: false,
    inputs: {
      [Product.IDS.STEEL]: 1
    },
    outputs: {
      [Product.IDS.STEEL_PIPE]: 1
    }
  },
  [IDS.STEEL_WIRE_DRAWING]: {
    i: IDS.STEEL_WIRE_DRAWING,
    name: 'Steel Wire Drawing',
    processorType: Processor.IDS.FACTORY,
    setupTime: 86400,
    recipeTime: 0.36,
    batched: false,
    inputs: {
      [Product.IDS.STEEL]: 1
    },
    outputs: {
      [Product.IDS.STEEL_WIRE]: 1
    }
  },
  [IDS.PROPYLENE_AMMOXIDATION]: {
    i: IDS.PROPYLENE_AMMOXIDATION,
    name: 'Propylene Ammoxidation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 100800,
    recipeTime: 327.24,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 374,
      [Product.IDS.OXYGEN]: 960,
      [Product.IDS.PROPYLENE]: 841,
      [Product.IDS.SULFURIC_ACID]: 98
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 1080,
      [Product.IDS.ACRYLONITRILE]: 796
    }
  },
  [IDS.PROPYLENE_POLYMERIZATION]: {
    i: IDS.PROPYLENE_POLYMERIZATION,
    name: 'Propylene Polymerization',
    processorType: Processor.IDS.REFINERY,
    setupTime: 108000,
    recipeTime: 0.072,
    batched: false,
    inputs: {
      [Product.IDS.PROPYLENE]: 1
    },
    outputs: {
      [Product.IDS.POLYPROPYLENE]: 1
    }
  },
  [IDS.MAGNESIUM_CHLORIDE_MOLTEN_SALT_ELECTROLYSIS]: {
    i: IDS.MAGNESIUM_CHLORIDE_MOLTEN_SALT_ELECTROLYSIS,
    name: 'Magnesium Chloride Molten Salt Electrolysis',
    processorType: Processor.IDS.REFINERY,
    setupTime: 172800,
    recipeTime: 378,
    batched: false,
    inputs: {
      [Product.IDS.MAGNESIUM_CHLORIDE]: 95
    },
    outputs: {
      [Product.IDS.MAGNESIUM]: 24,
      [Product.IDS.CHLORINE]: 71
    }
  },
  [IDS.SOLVAY_PROCESS]: {
    i: IDS.SOLVAY_PROCESS,
    name: 'Solvay Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 86400,
    recipeTime: 242.28,
    batched: false,
    inputs: {
      [Product.IDS.CALCITE]: 100,
      [Product.IDS.SODIUM_CHLORIDE]: 117
    },
    outputs: {
      [Product.IDS.SODIUM_CARBONATE]: 106,
      [Product.IDS.CALCIUM_CHLORIDE]: 111
    }
  },
  [IDS.BORIA_HYDRATION]: {
    i: IDS.BORIA_HYDRATION,
    name: 'Boria Hydration',
    processorType: Processor.IDS.REFINERY,
    setupTime: 36000,
    recipeTime: 44.64,
    batched: false,
    inputs: {
      [Product.IDS.DEIONIZED_WATER]: 54,
      [Product.IDS.BORIA]: 70
    },
    outputs: {
      [Product.IDS.BORIC_ACID]: 124
    }
  },
  [IDS.PYROXENE_ACID_LEACHING_DIGESTION_AND_ION_EXCHANGE]: {
    i: IDS.PYROXENE_ACID_LEACHING_DIGESTION_AND_ION_EXCHANGE,
    name: 'Pyroxene Acid Leaching, Digestion, and Ion Exchange',
    processorType: Processor.IDS.REFINERY,
    setupTime: 216000,
    recipeTime: 182.52,
    batched: false,
    inputs: {
      [Product.IDS.PYROXENE]: 2200,
      [Product.IDS.SULFURIC_ACID]: 294,
      [Product.IDS.SODIUM_HYDROXIDE]: 40
    },
    outputs: {
      [Product.IDS.LITHIUM_SULFATE]: 294,
      [Product.IDS.SODIUM_TUNGSTATE]: 110
    }
  },
  [IDS.APATITE_ACID_EXTRACTION]: {
    i: IDS.APATITE_ACID_EXTRACTION,
    name: 'Apatite Acid Extraction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 208800,
    recipeTime: 240.84,
    batched: false,
    inputs: {
      [Product.IDS.APATITE]: 2051,
      [Product.IDS.SULFURIC_ACID]: 1960
    },
    outputs: {
      [Product.IDS.HYDROCHLORIC_ACID]: 73,
      [Product.IDS.HYDROFLUORIC_ACID]: 40,
      [Product.IDS.PHOSPHORIC_ACID]: 1176
    }
  },
  [IDS.HYDROGEN_COMBUSTION]: {
    i: IDS.HYDROGEN_COMBUSTION,
    name: 'Hydrogen Combustion',
    processorType: Processor.IDS.REFINERY,
    setupTime: 21600,
    recipeTime: 0.324,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN]: 2,
      [Product.IDS.OXYGEN]: 16
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 18
    }
  },
  [IDS.CARBON_MONOXIDE_COMBUSTION]: {
    i: IDS.CARBON_MONOXIDE_COMBUSTION,
    name: 'Carbon Monoxide Combustion',
    processorType: Processor.IDS.REFINERY,
    setupTime: 28800,
    recipeTime: 2.114,
    batched: false,
    inputs: {
      [Product.IDS.CARBON_MONOXIDE]: 56,
      [Product.IDS.OXYGEN]: 32
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 88
    }
  },
  [IDS.BORAX_ACID_EXTRACTION]: {
    i: IDS.BORAX_ACID_EXTRACTION,
    name: 'Borax Acid Extraction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 172800,
    recipeTime: 21.852,
    batched: false,
    inputs: {
      [Product.IDS.DEIONIZED_WATER]: 90,
      [Product.IDS.BORAX]: 201,
      [Product.IDS.HYDROCHLORIC_ACID]: 73
    },
    outputs: {
      [Product.IDS.SODIUM_CHLORIDE]: 117,
      [Product.IDS.BORIC_ACID]: 247
    }
  },
  [IDS.NITROGEN_CRYOCOOLING_AND_FRACTIONAL_DISTILLATION]: {
    i: IDS.NITROGEN_CRYOCOOLING_AND_FRACTIONAL_DISTILLATION,
    name: 'Nitrogen Cryocooling and Fractional Distillation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 18000,
    recipeTime: 216.36,
    batched: false,
    inputs: {
      [Product.IDS.NITROGEN]: 1000,
      [Product.IDS.CALCIUM]: 2
    },
    outputs: {
      [Product.IDS.PURE_NITROGEN]: 950,
      [Product.IDS.NEON]: 5
    }
  },
  [IDS.OLIVINE_ACID_LEACHING_AND_CALCINING]: {
    i: IDS.OLIVINE_ACID_LEACHING_AND_CALCINING,
    name: 'Olivine Acid Leaching and Calcining',
    processorType: Processor.IDS.REFINERY,
    setupTime: 230400,
    recipeTime: 2041.2,
    batched: false,
    inputs: {
      [Product.IDS.SULFURIC_ACID]: 12946,
      [Product.IDS.WEATHERED_OLIVINE]: 15422
    },
    outputs: {
      [Product.IDS.SULFUR_DIOXIDE]: 8456,
      [Product.IDS.CARBON_DIOXIDE]: 5809,
      [Product.IDS.OXYGEN]: 1984,
      [Product.IDS.DEIONIZED_WATER]: 2378,
      [Product.IDS.IRON_OXIDE]: 1852,
      [Product.IDS.ZINC_OXIDE]: 488,
      [Product.IDS.NICKEL_OXIDE]: 448,
      [Product.IDS.MAGNESIA]: 3869
    }
  },
  [IDS.ANORTHITE_FELDSPAR_ACID_LEACHING_AND_CARBONATION]: {
    i: IDS.ANORTHITE_FELDSPAR_ACID_LEACHING_AND_CARBONATION,
    name: 'Anorthite Feldspar Acid Leaching and Carbonation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 302400,
    recipeTime: 125.568,
    batched: false,
    inputs: {
      [Product.IDS.FELDSPAR]: 1096,
      [Product.IDS.AMMONIUM_CARBONATE]: 96,
      [Product.IDS.SULFURIC_ACID]: 392,
      [Product.IDS.HYDROFLUORIC_ACID]: 80
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 144,
      [Product.IDS.LEACHED_FELDSPAR]: 624,
      [Product.IDS.BERYLLIUM_CARBONATE]: 69
    }
  },
  [IDS.SODIUM_CHLORALKALI_PROCESS]: {
    i: IDS.SODIUM_CHLORALKALI_PROCESS,
    name: 'Sodium Chloralkali Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 72000,
    recipeTime: 64.8,
    batched: false,
    inputs: {
      [Product.IDS.DEIONIZED_WATER]: 36,
      [Product.IDS.SODIUM_CHLORIDE]: 117
    },
    outputs: {
      [Product.IDS.HYDROGEN]: 2,
      [Product.IDS.CHLORINE]: 71,
      [Product.IDS.SODIUM_HYDROXIDE]: 80
    }
  },
  [IDS.POTASSIUM_CHLORALKALI_PROCESS]: {
    i: IDS.POTASSIUM_CHLORALKALI_PROCESS,
    name: 'Potassium Chloralkali Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 72000,
    recipeTime: 90.72,
    batched: false,
    inputs: {
      [Product.IDS.DEIONIZED_WATER]: 36,
      [Product.IDS.POTASSIUM_CHLORIDE]: 149
    },
    outputs: {
      [Product.IDS.HYDROGEN]: 2,
      [Product.IDS.CHLORINE]: 71,
      [Product.IDS.POTASSIUM_HYDROXIDE]: 112
    }
  },
  [IDS.APATITE_ACID_RE_EXTRACTION]: {
    i: IDS.APATITE_ACID_RE_EXTRACTION,
    name: 'Apatite Acid Re-extraction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 187200,
    recipeTime: 230.04,
    batched: false,
    inputs: {
      [Product.IDS.APATITE]: 2051,
      [Product.IDS.PHOSPHORIC_ACID]: 2743
    },
    outputs: {
      [Product.IDS.TRIPLE_SUPERPHOSPHATE]: 468,
      [Product.IDS.HYDROCHLORIC_ACID]: 73,
      [Product.IDS.HYDROFLUORIC_ACID]: 40
    }
  },
  [IDS.AMMONIUM_CARBONATE_OXALATION]: {
    i: IDS.AMMONIUM_CARBONATE_OXALATION,
    name: 'Ammonium Carbonate Oxalation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 28800,
    recipeTime: 44.64,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIUM_CARBONATE]: 96,
      [Product.IDS.OXALIC_ACID]: 90
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.DEIONIZED_WATER]: 18,
      [Product.IDS.AMMONIUM_OXALATE]: 124
    }
  },
  [IDS.XENOTIME_HOT_ACID_LEACHING]: {
    i: IDS.XENOTIME_HOT_ACID_LEACHING,
    name: 'Xenotime Hot Acid Leaching',
    processorType: Processor.IDS.REFINERY,
    setupTime: 93600,
    recipeTime: 446.4,
    batched: false,
    inputs: {
      [Product.IDS.XENOTIME]: 1614,
      [Product.IDS.SULFURIC_ACID]: 1176
    },
    outputs: {
      [Product.IDS.PHOSPHORIC_ACID]: 784,
      [Product.IDS.RARE_EARTH_SULFATES]: 2006
    }
  },
  [IDS.MERRILLITE_HOT_ACID_LEACHING]: {
    i: IDS.MERRILLITE_HOT_ACID_LEACHING,
    name: 'Merrillite Hot Acid Leaching',
    processorType: Processor.IDS.REFINERY,
    setupTime: 100800,
    recipeTime: 1674,
    batched: false,
    inputs: {
      [Product.IDS.MERRILLITE]: 4623,
      [Product.IDS.SULFURIC_ACID]: 1176,
      [Product.IDS.HYDROCHLORIC_ACID]: 2625
    },
    outputs: {
      [Product.IDS.CALCIUM_CHLORIDE]: 3996,
      [Product.IDS.PHOSPHORIC_ACID]: 2744,
      [Product.IDS.RARE_EARTH_SULFATES]: 2006
    }
  },
  [IDS.AMMONIA_CATALYTIC_CRACKING]: {
    i: IDS.AMMONIA_CATALYTIC_CRACKING,
    name: 'Ammonia Catalytic Cracking',
    processorType: Processor.IDS.REFINERY,
    setupTime: 79200,
    recipeTime: 97.56,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 40
    },
    outputs: {
      [Product.IDS.HYDROGEN]: 6,
      [Product.IDS.PURE_NITROGEN]: 34
    }
  },
  [IDS.URANINITE_ACID_LEACHING_SOLVENT_EXTRACTION_AND_PRECIPITATION]: {
    i: IDS.URANINITE_ACID_LEACHING_SOLVENT_EXTRACTION_AND_PRECIPITATION,
    name: 'Uraninite Acid Leaching, Solvent Extraction, and Precipitation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 288000,
    recipeTime: 453.6,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 204,
      [Product.IDS.URANINITE]: 855,
      [Product.IDS.OXYGEN]: 32,
      [Product.IDS.SULFURIC_ACID]: 588
    },
    outputs: {
      [Product.IDS.YELLOWCAKE]: 887
    }
  },
  [IDS.COFFINITE_ACID_LEACHING_SOLVENT_EXTRACTION_AND_PRECIPITATION]: {
    i: IDS.COFFINITE_ACID_LEACHING_SOLVENT_EXTRACTION_AND_PRECIPITATION,
    name: 'Coffinite Acid Leaching, Solvent Extraction, and Precipitation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 273600,
    recipeTime: 1054.8,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 408,
      [Product.IDS.COFFINITE]: 2544,
      [Product.IDS.OXYGEN]: 64,
      [Product.IDS.SULFURIC_ACID]: 1176
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 108,
      [Product.IDS.SILICA]: 180,
      [Product.IDS.YELLOWCAKE]: 1774,
      [Product.IDS.LEACHED_COFFINITE]: 556
    }
  },
  [IDS.ALUMINA_FORMING_AND_SINTERING]: {
    i: IDS.ALUMINA_FORMING_AND_SINTERING,
    name: 'Alumina Forming and Sintering',
    processorType: Processor.IDS.FACTORY,
    setupTime: 64800,
    recipeTime: 0.8,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINA]: 1
    },
    outputs: {
      [Product.IDS.ALUMINA_CERAMIC]: 1
    }
  },
  [IDS.AUSTENITIC_NICHROME_ALLOYING]: {
    i: IDS.AUSTENITIC_NICHROME_ALLOYING,
    name: 'Austenitic Nichrome Alloying',
    processorType: Processor.IDS.REFINERY,
    setupTime: 50400,
    recipeTime: 2.16,
    batched: false,
    inputs: {
      [Product.IDS.NICKEL]: 15,
      [Product.IDS.FERROCHROMIUM]: 4,
      [Product.IDS.CHROMIUM]: 1
    },
    outputs: {
      [Product.IDS.AUSTENITIC_NICHROME]: 20
    }
  },
  [IDS.COPPER_WIRE_INSULATING]: {
    i: IDS.COPPER_WIRE_INSULATING,
    name: 'Copper Wire Insulating',
    processorType: Processor.IDS.FACTORY,
    setupTime: 72000,
    recipeTime: 14.4,
    batched: false,
    inputs: {
      [Product.IDS.BARE_COPPER_WIRE]: 17,
      [Product.IDS.POLYPROPYLENE]: 3
    },
    outputs: {
      [Product.IDS.COPPER_WIRE]: 20
    }
  },
  [IDS.SILICON_CZOCHRALSKI_PROCESS_AND_WAFER_SLICING]: {
    i: IDS.SILICON_CZOCHRALSKI_PROCESS_AND_WAFER_SLICING,
    name: 'Silicon Czochralski Process and Wafer Slicing',
    processorType: Processor.IDS.FACTORY,
    setupTime: 288000,
    recipeTime: 6480000,
    batched: false,
    inputs: {
      [Product.IDS.SILICON]: 720000,
      [Product.IDS.PHOSPHORIC_ACID]: 1
    },
    outputs: {
      [Product.IDS.SILICON_WAFER]: 432000
    }
  },
  [IDS.STEEL_CABLE_LAYING]: {
    i: IDS.STEEL_CABLE_LAYING,
    name: 'Steel Cable Laying',
    processorType: Processor.IDS.FACTORY,
    setupTime: 72000,
    recipeTime: 0.3,
    batched: false,
    inputs: {
      [Product.IDS.STEEL_WIRE]: 1
    },
    outputs: {
      [Product.IDS.STEEL_CABLE]: 1
    }
  },
  [IDS.ACRYLONITRILE_POLYMERIZATION]: {
    i: IDS.ACRYLONITRILE_POLYMERIZATION,
    name: 'Acrylonitrile Polymerization',
    processorType: Processor.IDS.REFINERY,
    setupTime: 86400,
    recipeTime: 9.18,
    batched: false,
    inputs: {
      [Product.IDS.SULFUR_DIOXIDE]: 1,
      [Product.IDS.ACRYLONITRILE]: 50
    },
    outputs: {
      [Product.IDS.POLYACRYLONITRILE]: 50
    }
  },
  [IDS.SOYBEAN_GROWING]: {
    i: IDS.SOYBEAN_GROWING,
    name: 'Soybean Growing',
    processorType: Processor.IDS.BIOREACTOR,
    setupTime: 115200,
    recipeTime: 6480000,
    batched: true,
    inputs: {
      [Product.IDS.AMMONIA]: 2600,
      [Product.IDS.CARBON_DIOXIDE]: 52000,
      [Product.IDS.DEIONIZED_WATER]: 2200,
      [Product.IDS.TRIPLE_SUPERPHOSPHATE]: 640,
      [Product.IDS.PHOSPHATE_AND_SULFATE_SALTS]: 400,
      [Product.IDS.POTASSIUM_CHLORIDE]: 840
    },
    outputs: {
      [Product.IDS.SOYBEANS]: 26000
    }
  },
  [IDS.BORIC_ACID_THERMAL_DECOMPOSITION]: {
    i: IDS.BORIC_ACID_THERMAL_DECOMPOSITION,
    name: 'Boric Acid Thermal Decomposition',
    processorType: Processor.IDS.REFINERY,
    setupTime: 21600,
    recipeTime: 0.206,
    batched: false,
    inputs: {
      [Product.IDS.BORIC_ACID]: 124
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 54,
      [Product.IDS.BORIA]: 70
    }
  },
  [IDS.LITHIUM_CARBONATE_CHLORINATION]: {
    i: IDS.LITHIUM_CARBONATE_CHLORINATION,
    name: 'Lithium Carbonate Chlorination',
    processorType: Processor.IDS.REFINERY,
    setupTime: 25200,
    recipeTime: 66.24,
    batched: false,
    inputs: {
      [Product.IDS.LITHIUM_CARBONATE]: 74,
      [Product.IDS.HYDROCHLORIC_ACID]: 73
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.DEIONIZED_WATER]: 18,
      [Product.IDS.LITHIUM_CHLORIDE]: 85
    }
  },
  [IDS.LITHIUM_SULFATE_CARBONATION]: {
    i: IDS.LITHIUM_SULFATE_CARBONATION,
    name: 'Lithium Sulfate Carbonation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 18000,
    recipeTime: 77.76,
    batched: false,
    inputs: {
      [Product.IDS.SODIUM_CARBONATE]: 106,
      [Product.IDS.LITHIUM_SULFATE]: 110
    },
    outputs: {
      [Product.IDS.LITHIUM_CARBONATE]: 74
    }
  },
  [IDS.IRON_OXIDE_DIRECT_REDUCTION]: {
    i: IDS.IRON_OXIDE_DIRECT_REDUCTION,
    name: 'Iron Oxide Direct Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 28800,
    recipeTime: 40.32,
    batched: false,
    inputs: {
      [Product.IDS.CARBON_MONOXIDE]: 112,
      [Product.IDS.IRON_OXIDE]: 232
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 176,
      [Product.IDS.IRON]: 168
    }
  },
  [IDS.ZINC_OXIDE_DIRECT_REDUCTION]: {
    i: IDS.ZINC_OXIDE_DIRECT_REDUCTION,
    name: 'Zinc Oxide Direct Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 43200,
    recipeTime: 11.772,
    batched: false,
    inputs: {
      [Product.IDS.CARBON_MONOXIDE]: 28,
      [Product.IDS.ZINC_OXIDE]: 81
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.ZINC]: 65
    }
  },
  [IDS.NICKEL_OXIDE_DIRECT_REDUCTION]: {
    i: IDS.NICKEL_OXIDE_DIRECT_REDUCTION,
    name: 'Nickel Oxide Direct Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 57600,
    recipeTime: 12.24,
    batched: false,
    inputs: {
      [Product.IDS.CARBON_MONOXIDE]: 28,
      [Product.IDS.NICKEL_OXIDE]: 75
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.NICKEL]: 59
    }
  },
  [IDS.PIDGEON_PROCESS]: {
    i: IDS.PIDGEON_PROCESS,
    name: 'Pidgeon Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 28800,
    recipeTime: 345.6,
    batched: false,
    inputs: {
      [Product.IDS.FERROSILICON]: 28,
      [Product.IDS.MAGNESIA]: 20
    },
    outputs: {
      [Product.IDS.SILICA]: 15,
      [Product.IDS.IRON]: 21,
      [Product.IDS.MAGNESIUM]: 12
    }
  },
  [IDS.POLYPROPYLENE_CHLORINATION_AND_BASIFICATION]: {
    i: IDS.POLYPROPYLENE_CHLORINATION_AND_BASIFICATION,
    name: 'Polypropylene Chlorination and Basification',
    processorType: Processor.IDS.REFINERY,
    setupTime: 54000,
    recipeTime: 0.76,
    batched: false,
    inputs: {
      [Product.IDS.POLYPROPYLENE]: 42,
      [Product.IDS.CHLORINE]: 142,
      [Product.IDS.SODIUM_HYDROXIDE]: 80
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 18,
      [Product.IDS.SODIUM_CHLORIDE]: 117,
      [Product.IDS.HYDROCHLORIC_ACID]: 36,
      [Product.IDS.EPICHLOROHYDRIN]: 93
    }
  },
  [IDS.POTATO_GROWING]: {
    i: IDS.POTATO_GROWING,
    name: 'Potato Growing',
    processorType: Processor.IDS.BIOREACTOR,
    setupTime: 129600,
    recipeTime: 7776000,
    batched: true,
    inputs: {
      [Product.IDS.AMMONIA]: 590,
      [Product.IDS.CARBON_DIOXIDE]: 22000,
      [Product.IDS.DEIONIZED_WATER]: 60000,
      [Product.IDS.TRIPLE_SUPERPHOSPHATE]: 290,
      [Product.IDS.PHOSPHATE_AND_SULFATE_SALTS]: 100,
      [Product.IDS.POTASSIUM_CHLORIDE]: 830
    },
    outputs: {
      [Product.IDS.POTATOES]: 75600
    }
  },
  [IDS.RARE_EARTH_SULFATES_OXALATION_AND_CALCINATION]: {
    i: IDS.RARE_EARTH_SULFATES_OXALATION_AND_CALCINATION,
    name: 'Rare Earth Sulfates Oxalation and Calcination',
    processorType: Processor.IDS.REFINERY,
    setupTime: 21600,
    recipeTime: 392.4,
    batched: false,
    inputs: {
      [Product.IDS.SODIUM_HYDROXIDE]: 960,
      [Product.IDS.AMMONIUM_OXALATE]: 1488,
      [Product.IDS.RARE_EARTH_SULFATES]: 2078
    },
    outputs: {
      [Product.IDS.AMMONIA]: 408,
      [Product.IDS.CARBON_DIOXIDE]: 528,
      [Product.IDS.CARBON_MONOXIDE]: 336,
      [Product.IDS.DEIONIZED_WATER]: 432,
      [Product.IDS.RARE_EARTH_OXIDES]: 1118
    }
  },
  [IDS.AMMONIA_CHLORINATION]: {
    i: IDS.AMMONIA_CHLORINATION,
    name: 'Ammonia Chlorination',
    processorType: Processor.IDS.REFINERY,
    setupTime: 28800,
    recipeTime: 0.458,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 17,
      [Product.IDS.HYDROCHLORIC_ACID]: 36
    },
    outputs: {
      [Product.IDS.AMMONIUM_CHLORIDE]: 53
    }
  },
  [IDS.HALL_HEROULT_PROCESS]: {
    i: IDS.HALL_HEROULT_PROCESS,
    name: 'Hall–Heroult Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 79200,
    recipeTime: 97.2,
    batched: false,
    inputs: {
      [Product.IDS.GRAPHITE]: 36,
      [Product.IDS.ALUMINA]: 102
    },
    outputs: {
      [Product.IDS.CARBON_MONOXIDE]: 84,
      [Product.IDS.ALUMINIUM]: 54
    }
  },
  [IDS.CALCIUM_CHLORIDE_MOLTEN_SALT_ELECTROLYSIS]: {
    i: IDS.CALCIUM_CHLORIDE_MOLTEN_SALT_ELECTROLYSIS,
    name: 'Calcium Chloride Molten Salt Electrolysis',
    processorType: Processor.IDS.REFINERY,
    setupTime: 72000,
    recipeTime: 319.68,
    batched: false,
    inputs: {
      [Product.IDS.CALCIUM_CHLORIDE]: 111
    },
    outputs: {
      [Product.IDS.CHLORINE]: 71,
      [Product.IDS.CALCIUM]: 40
    }
  },
  [IDS.CEMENT_MIXING]: {
    i: IDS.CEMENT_MIXING,
    name: 'Cement Mixing',
    processorType: Processor.IDS.FACTORY,
    setupTime: 14400,
    recipeTime: 0.36,
    batched: false,
    inputs: {
      [Product.IDS.DEIONIZED_WATER]: 5,
      [Product.IDS.QUICKLIME]: 3
    },
    outputs: {
      [Product.IDS.CEMENT]: 8
    }
  },
  [IDS.NATURAL_FLAVORINGS_GROWING]: {
    i: IDS.NATURAL_FLAVORINGS_GROWING,
    name: 'Natural Flavorings Growing',
    processorType: Processor.IDS.BIOREACTOR,
    setupTime: 288000,
    recipeTime: 31464000,
    batched: true,
    inputs: {
      [Product.IDS.AMMONIA]: 580,
      [Product.IDS.CARBON_DIOXIDE]: 23000,
      [Product.IDS.DEIONIZED_WATER]: 8100,
      [Product.IDS.TRIPLE_SUPERPHOSPHATE]: 220,
      [Product.IDS.PHOSPHATE_AND_SULFATE_SALTS]: 350,
      [Product.IDS.POTASSIUM_CHLORIDE]: 290
    },
    outputs: {
      [Product.IDS.NATURAL_FLAVORINGS]: 15500
    }
  },
  [IDS.YELLOWCAKE_DIGESTION_SOLVENT_EXTRACTION_AND_PRECIPITATION]: {
    i: IDS.YELLOWCAKE_DIGESTION_SOLVENT_EXTRACTION_AND_PRECIPITATION,
    name: 'Yellowcake Digestion, Solvent Extraction, and Precipitation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 194400,
    recipeTime: 177.48,
    batched: false,
    inputs: {
      [Product.IDS.NITRIC_ACID]: 504,
      [Product.IDS.YELLOWCAKE]: 887
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 72,
      [Product.IDS.URANYL_NITRATE]: 1182
    }
  },
  [IDS.HYDROFLUORIC_ACID_COLD_ELECTROLYSIS]: {
    i: IDS.HYDROFLUORIC_ACID_COLD_ELECTROLYSIS,
    name: 'Hydrofluoric Acid Cold Electrolysis',
    processorType: Processor.IDS.REFINERY,
    setupTime: 172800,
    recipeTime: 182.52,
    batched: false,
    inputs: {
      [Product.IDS.HYDROFLUORIC_ACID]: 20,
      [Product.IDS.POTASSIUM_FLUORIDE]: 58
    },
    outputs: {
      [Product.IDS.HYDROGEN]: 1,
      [Product.IDS.FLUORINE]: 38
    }
  },
  [IDS.RHABDITE_ROASTING_AND_ACID_EXTRACTION]: {
    i: IDS.RHABDITE_ROASTING_AND_ACID_EXTRACTION,
    name: 'Rhabdite Roasting and Acid Extraction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 43200,
    recipeTime: 3506.4,
    batched: false,
    inputs: {
      [Product.IDS.RHABDITE]: 21958,
      [Product.IDS.OXYGEN]: 12896,
      [Product.IDS.DEIONIZED_WATER]: 4104
    },
    outputs: {
      [Product.IDS.PHOSPHORIC_ACID]: 14890,
      [Product.IDS.ROASTED_RHABDITE]: 24068
    }
  },
  [IDS.FERRITE_SINTERING]: {
    i: IDS.FERRITE_SINTERING,
    name: 'Ferrite Sintering',
    processorType: Processor.IDS.REFINERY,
    setupTime: 79200,
    recipeTime: 1285.2,
    batched: false,
    inputs: {
      [Product.IDS.OXYGEN]: 32,
      [Product.IDS.IRON_OXIDE]: 926,
      [Product.IDS.ZINC_OXIDE]: 244,
      [Product.IDS.NICKEL_OXIDE]: 224
    },
    outputs: {
      [Product.IDS.FERRITE]: 1426
    }
  },
  [IDS.DIODE_DOPING_AND_ASSEMBLY]: {
    i: IDS.DIODE_DOPING_AND_ASSEMBLY,
    name: 'Diode Doping and Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 172800,
    recipeTime: 37800,
    batched: false,
    inputs: {
      [Product.IDS.POLYPROPYLENE]: 70,
      [Product.IDS.BORIC_ACID]: 1,
      [Product.IDS.SILICON_WAFER]: 350
    },
    outputs: {
      [Product.IDS.DIODE]: 420
    }
  },
  [IDS.BALL_VALVE_MACHINING]: {
    i: IDS.BALL_VALVE_MACHINING,
    name: 'Ball Valve Machining',
    processorType: Processor.IDS.FACTORY,
    setupTime: 100800,
    recipeTime: 1.8,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 1
    },
    outputs: {
      [Product.IDS.BALL_VALVE]: 1
    }
  },
  [IDS.ALUMINIUM_BEAM_ROLLING]: {
    i: IDS.ALUMINIUM_BEAM_ROLLING,
    name: 'Aluminium Beam Rolling',
    processorType: Processor.IDS.FACTORY,
    setupTime: 108000,
    recipeTime: 0.144,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 1
    },
    outputs: {
      [Product.IDS.ALUMINIUM_BEAM]: 1
    }
  },
  [IDS.ALUMINIUM_SHEET_ROLLING]: {
    i: IDS.ALUMINIUM_SHEET_ROLLING,
    name: 'Aluminium Sheet Rolling',
    processorType: Processor.IDS.FACTORY,
    setupTime: 100800,
    recipeTime: 0.164,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 1
    },
    outputs: {
      [Product.IDS.ALUMINIUM_SHEET]: 1
    }
  },
  [IDS.ALUMINIUM_PIPE_ROLLING]: {
    i: IDS.ALUMINIUM_PIPE_ROLLING,
    name: 'Aluminium Pipe Rolling',
    processorType: Processor.IDS.FACTORY,
    setupTime: 111600,
    recipeTime: 18,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 1
    },
    outputs: {
      [Product.IDS.ALUMINIUM_PIPE]: 1
    }
  },
  [IDS.POLYACRYLONITRILE_WEAVING]: {
    i: IDS.POLYACRYLONITRILE_WEAVING,
    name: 'Polyacrylonitrile Weaving',
    processorType: Processor.IDS.FACTORY,
    setupTime: 72000,
    recipeTime: 1.8,
    batched: false,
    inputs: {
      [Product.IDS.POLYACRYLONITRILE]: 1
    },
    outputs: {
      [Product.IDS.POLYACRYLONITRILE_FABRIC]: 1
    }
  },
  [IDS.COLD_GAS_THRUSTER_PRINTING]: {
    i: IDS.COLD_GAS_THRUSTER_PRINTING,
    name: 'Cold Gas Thruster Printing',
    processorType: Processor.IDS.FACTORY,
    setupTime: 57600,
    recipeTime: 14.4,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 3
    },
    outputs: {
      [Product.IDS.COLD_GAS_THRUSTER]: 1
    }
  },
  [IDS.POLYACRYLONITRILE_OXIDATION_AND_CARBONIZATION]: {
    i: IDS.POLYACRYLONITRILE_OXIDATION_AND_CARBONIZATION,
    name: 'Polyacrylonitrile Oxidation and Carbonization',
    processorType: Processor.IDS.REFINERY,
    setupTime: 57600,
    recipeTime: 4.716,
    batched: false,
    inputs: {
      [Product.IDS.OXYGEN]: 224,
      [Product.IDS.POLYACRYLONITRILE]: 212
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 108,
      [Product.IDS.CARBON_FIBER]: 144
    }
  },
  [IDS.ALUMINIUM_SMALL_PROPELLANT_TANK_ASSEMBLY]: {
    i: IDS.ALUMINIUM_SMALL_PROPELLANT_TANK_ASSEMBLY,
    name: 'Aluminium Small Propellant Tank Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 64800,
    recipeTime: 7.2,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 6
    },
    outputs: {
      [Product.IDS.SMALL_PROPELLANT_TANK]: 1
    }
  },
  [IDS.BOROSILICATE_GLASSMAKING]: {
    i: IDS.BOROSILICATE_GLASSMAKING,
    name: 'Borosilicate Glassmaking',
    processorType: Processor.IDS.REFINERY,
    setupTime: 86400,
    recipeTime: 6.624,
    batched: false,
    inputs: {
      [Product.IDS.SILICA]: 15,
      [Product.IDS.SODIUM_CARBONATE]: 2,
      [Product.IDS.BORIA]: 2,
      [Product.IDS.ALUMINA]: 1
    },
    outputs: {
      [Product.IDS.BOROSILICATE_GLASS]: 20
    }
  },
  [IDS.BALL_BEARING_MACHINING_AND_ASSEMBLY]: {
    i: IDS.BALL_BEARING_MACHINING_AND_ASSEMBLY,
    name: 'Ball Bearing Machining and Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 129600,
    recipeTime: 658.8,
    batched: false,
    inputs: {
      [Product.IDS.STEEL]: 53,
      [Product.IDS.POLYACRYLONITRILE]: 2
    },
    outputs: {
      [Product.IDS.BALL_BEARING]: 55
    }
  },
  [IDS.LARGE_THRUST_BEARING_MACHINING_AND_ASSEMBLY]: {
    i: IDS.LARGE_THRUST_BEARING_MACHINING_AND_ASSEMBLY,
    name: 'Large Thrust Bearing Machining and Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 144000,
    recipeTime: 450,
    batched: false,
    inputs: {
      [Product.IDS.STEEL]: 2000
    },
    outputs: {
      [Product.IDS.LARGE_THRUST_BEARING]: 1
    }
  },
  [IDS.BORIA_MAGNESIOTHERMIC_REDUCTION]: {
    i: IDS.BORIA_MAGNESIOTHERMIC_REDUCTION,
    name: 'Boria Magnesiothermic Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 57600,
    recipeTime: 39.6,
    batched: false,
    inputs: {
      [Product.IDS.MAGNESIUM]: 73,
      [Product.IDS.BORIA]: 70
    },
    outputs: {
      [Product.IDS.MAGNESIA]: 121,
      [Product.IDS.BORON]: 22
    }
  },
  [IDS.LITHIUM_CHLORIDE_MOLTEN_SALT_ELECTROLYSIS]: {
    i: IDS.LITHIUM_CHLORIDE_MOLTEN_SALT_ELECTROLYSIS,
    name: 'Lithium Chloride Molten Salt Electrolysis',
    processorType: Processor.IDS.REFINERY,
    setupTime: 144000,
    recipeTime: 277.92,
    batched: false,
    inputs: {
      [Product.IDS.POTASSIUM_CHLORIDE]: 75,
      [Product.IDS.LITHIUM_CHLORIDE]: 42
    },
    outputs: {
      [Product.IDS.CHLORINE]: 71,
      [Product.IDS.LITHIUM]: 7
    }
  },
  [IDS.DIEPOXY_STEP_GROWTH_POLYMERIZATION]: {
    i: IDS.DIEPOXY_STEP_GROWTH_POLYMERIZATION,
    name: 'Diepoxy Step Growth Polymerization',
    processorType: Processor.IDS.REFINERY,
    setupTime: 108000,
    recipeTime: 323.64,
    batched: false,
    inputs: {
      [Product.IDS.SODIUM_HYDROXIDE]: 120,
      [Product.IDS.EPICHLOROHYDRIN]: 278,
      [Product.IDS.BISPHENOL_A]: 456
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 54,
      [Product.IDS.SODIUM_CHLORIDE]: 175,
      [Product.IDS.DIEPOXY_PREPOLYMER_RESIN]: 625
    }
  },
  [IDS.RARE_EARTH_OXIDES_ION_EXCHANGE]: {
    i: IDS.RARE_EARTH_OXIDES_ION_EXCHANGE,
    name: 'Rare Earth Oxides Ion Exchange',
    processorType: Processor.IDS.REFINERY,
    setupTime: 172800,
    recipeTime: 20.124,
    batched: false,
    inputs: {
      [Product.IDS.RARE_EARTH_OXIDES]: 1118
    },
    outputs: {
      [Product.IDS.NEODYMIUM_OXIDE]: 336,
      [Product.IDS.YTTRIA]: 452
    }
  },
  [IDS.CALCIUM_OXIDE_ALUMINOTHERMIC_REDUCTION]: {
    i: IDS.CALCIUM_OXIDE_ALUMINOTHERMIC_REDUCTION,
    name: 'Calcium Oxide Aluminothermic Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 50400,
    recipeTime: 57.24,
    batched: false,
    inputs: {
      [Product.IDS.QUICKLIME]: 168,
      [Product.IDS.ALUMINIUM]: 54
    },
    outputs: {
      [Product.IDS.ALUMINA]: 102,
      [Product.IDS.CALCIUM]: 120
    }
  },
  [IDS.SODIUM_CHROMATE_ACIDIFICATION_AND_CRYSTALLIZATION]: {
    i: IDS.SODIUM_CHROMATE_ACIDIFICATION_AND_CRYSTALLIZATION,
    name: 'Sodium Chromate Acidification and Crystallization',
    processorType: Processor.IDS.REFINERY,
    setupTime: 180000,
    recipeTime: 194.4,
    batched: false,
    inputs: {
      [Product.IDS.HYDROCHLORIC_ACID]: 73,
      [Product.IDS.SODIUM_CHROMATE]: 324
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 18,
      [Product.IDS.SODIUM_CHLORIDE]: 117,
      [Product.IDS.SODIUM_DICHROMATE]: 262
    }
  },
  [IDS.SULFURIC_ACID_HOT_CATALYTIC_REDUCTION]: {
    i: IDS.SULFURIC_ACID_HOT_CATALYTIC_REDUCTION,
    name: 'Sulfuric Acid Hot Catalytic Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 72000,
    recipeTime: 2.117,
    batched: false,
    inputs: {
      [Product.IDS.SULFURIC_ACID]: 98
    },
    outputs: {
      [Product.IDS.SULFUR_DIOXIDE]: 64,
      [Product.IDS.OXYGEN]: 16,
      [Product.IDS.DEIONIZED_WATER]: 18
    }
  },
  [IDS.MOLYBDENUM_TRIOXIDE_ALUMINOTHERMIC_REDUCTION_AND_ALLOYING]: {
    i: IDS.MOLYBDENUM_TRIOXIDE_ALUMINOTHERMIC_REDUCTION_AND_ALLOYING,
    name: 'Molybdenum Trioxide Aluminothermic Reduction and Alloying',
    processorType: Processor.IDS.REFINERY,
    setupTime: 54000,
    recipeTime: 3672,
    batched: false,
    inputs: {
      [Product.IDS.IRON]: 2401,
      [Product.IDS.MOLYBDENUM_TRIOXIDE]: 7198,
      [Product.IDS.ALUMINIUM]: 2698
    },
    outputs: {
      [Product.IDS.ALUMINA]: 5098,
      [Product.IDS.FERROMOLYBDENUM]: 7199
    }
  },
  [IDS.URANYL_NITRATE_REDOX_AND_PRECIPITATION]: {
    i: IDS.URANYL_NITRATE_REDOX_AND_PRECIPITATION,
    name: 'Uranyl Nitrate Redox and Precipitation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 100800,
    recipeTime: 3513.6,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 324,
      [Product.IDS.DEIONIZED_WATER]: 18,
      [Product.IDS.URANYL_NITRATE]: 5516
    },
    outputs: {
      [Product.IDS.AMMONIUM_DIURANATE]: 4369
    }
  },
  [IDS.SODIUM_TUNGSTATE_ION_EXCHANGE_PRECIPITATION_AND_CRYSTALLIZATION]: {
    i: IDS.SODIUM_TUNGSTATE_ION_EXCHANGE_PRECIPITATION_AND_CRYSTALLIZATION,
    name: 'Sodium Tungstate Ion Exchange, Precipitation, and Crystallization',
    processorType: Processor.IDS.REFINERY,
    setupTime: 172800,
    recipeTime: 70.56,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 170,
      [Product.IDS.DEIONIZED_WATER]: 396,
      [Product.IDS.SODIUM_TUNGSTATE]: 3526
    },
    outputs: {
      [Product.IDS.SODIUM_HYDROXIDE]: 960,
      [Product.IDS.AMMONIUM_PARATUNGSTATE]: 3132
    }
  },
  [IDS.STAINLESS_STEEL_ALLOYING]: {
    i: IDS.STAINLESS_STEEL_ALLOYING,
    name: 'Stainless Steel Alloying',
    processorType: Processor.IDS.REFINERY,
    setupTime: 86400,
    recipeTime: 34.56,
    batched: false,
    inputs: {
      [Product.IDS.IRON]: 99,
      [Product.IDS.NICKEL]: 16,
      [Product.IDS.FERROCHROMIUM]: 76,
      [Product.IDS.FERROMOLYBDENUM]: 9
    },
    outputs: {
      [Product.IDS.STAINLESS_STEEL]: 200
    }
  },
  [IDS.BOARD_PRINTING]: {
    i: IDS.BOARD_PRINTING,
    name: 'Board Printing',
    processorType: Processor.IDS.FACTORY,
    setupTime: 216000,
    recipeTime: 1198.8,
    batched: false,
    inputs: {
      [Product.IDS.COPPER]: 20,
      [Product.IDS.FIBERGLASS]: 108,
      [Product.IDS.GOLD]: 1,
      [Product.IDS.EPOXY]: 71
    },
    outputs: {
      [Product.IDS.BARE_CIRCUIT_BOARD]: 200
    }
  },
  [IDS.FERRITE_BEAD_INDUCTOR_WINDING]: {
    i: IDS.FERRITE_BEAD_INDUCTOR_WINDING,
    name: 'Ferrite-bead Inductor Winding',
    processorType: Processor.IDS.FACTORY,
    setupTime: 194400,
    recipeTime: 119.88,
    batched: false,
    inputs: {
      [Product.IDS.COPPER_WIRE]: 1,
      [Product.IDS.FERRITE]: 8,
      [Product.IDS.EPOXY]: 1
    },
    outputs: {
      [Product.IDS.FERRITE_BEAD_INDUCTOR]: 10
    }
  },
  [IDS.CORE_DRILL_BIT_MILLING]: {
    i: IDS.CORE_DRILL_BIT_MILLING,
    name: 'Core Drill Bit Milling',
    processorType: Processor.IDS.FACTORY,
    setupTime: 57600,
    recipeTime: 90,
    batched: false,
    inputs: {
      [Product.IDS.STEEL_PIPE]: 2
    },
    outputs: {
      [Product.IDS.CORE_DRILL_BIT]: 1
    }
  },
  [IDS.CORE_DRILL_THRUSTER_ASSEMBLY]: {
    i: IDS.CORE_DRILL_THRUSTER_ASSEMBLY,
    name: 'Core Drill Thruster Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 43200,
    recipeTime: 299.88,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM_PIPE]: 5,
      [Product.IDS.COLD_GAS_TORQUE_THRUSTER]: 5,
      [Product.IDS.SMALL_PROPELLANT_TANK]: 5,
      [Product.IDS.BALL_BEARING]: 1
    },
    outputs: {
      [Product.IDS.CORE_DRILL_THRUSTER]: 5
    }
  },
  [IDS.PARABOLIC_DISH_ASSEMBLY]: {
    i: IDS.PARABOLIC_DISH_ASSEMBLY,
    name: 'Parabolic Dish Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 115200,
    recipeTime: 360,
    batched: false,
    inputs: {
      [Product.IDS.COPPER_WIRE]: 7,
      [Product.IDS.ALUMINIUM_BEAM]: 20,
      [Product.IDS.CARBON_FIBER]: 27,
      [Product.IDS.EPOXY]: 18
    },
    outputs: {
      [Product.IDS.PARABOLIC_DISH]: 1
    }
  },
  [IDS.PHOTOVOLTAIC_PANEL_AMORPHIZATION_AND_ASSEMBLY]: {
    i: IDS.PHOTOVOLTAIC_PANEL_AMORPHIZATION_AND_ASSEMBLY,
    name: 'Photovoltaic Panel Amorphization and Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 115200,
    recipeTime: 180,
    batched: false,
    inputs: {
      [Product.IDS.COPPER_WIRE]: 1,
      [Product.IDS.SILICON_WAFER]: 4,
      [Product.IDS.ALUMINIUM_SHEET]: 2,
      [Product.IDS.BOROSILICATE_GLASS]: 1
    },
    outputs: {
      [Product.IDS.PHOTOVOLTAIC_PANEL]: 5
    }
  },
  [IDS.LIPO_BATTERY_ASSEMBLY]: {
    i: IDS.LIPO_BATTERY_ASSEMBLY,
    name: 'LiPo Battery Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 129600,
    recipeTime: 450,
    batched: false,
    inputs: {
      [Product.IDS.COPPER]: 1,
      [Product.IDS.POLYACRYLONITRILE]: 28,
      [Product.IDS.ALUMINIUM]: 1,
      [Product.IDS.LITHIUM]: 20
    },
    outputs: {
      [Product.IDS.LIPO_BATTERY]: 10
    }
  },
  [IDS.NEODYMIUM_OXIDE_CHLORINATION]: {
    i: IDS.NEODYMIUM_OXIDE_CHLORINATION,
    name: 'Neodymium Oxide Chlorination',
    processorType: Processor.IDS.REFINERY,
    setupTime: 43200,
    recipeTime: 4.716,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIUM_CHLORIDE]: 321,
      [Product.IDS.NEODYMIUM_OXIDE]: 336
    },
    outputs: {
      [Product.IDS.AMMONIA]: 102,
      [Product.IDS.DEIONIZED_WATER]: 54,
      [Product.IDS.NEODYMIUM_TRICHLORIDE]: 501
    }
  },
  [IDS.SODIUM_DICHROMATE_HOT_SULFUR_REDUCTION]: {
    i: IDS.SODIUM_DICHROMATE_HOT_SULFUR_REDUCTION,
    name: 'Sodium Dichromate Hot Sulfur Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 108000,
    recipeTime: 36,
    batched: false,
    inputs: {
      [Product.IDS.SULFUR]: 32,
      [Product.IDS.SODIUM_DICHROMATE]: 262
    },
    outputs: {
      [Product.IDS.CHROMIA]: 152
    }
  },
  [IDS.PHOTORESIST_EPOXY_STOICHIOMETRY_AND_PACKAGING]: {
    i: IDS.PHOTORESIST_EPOXY_STOICHIOMETRY_AND_PACKAGING,
    name: 'Photoresist Epoxy Stoichiometry and Packaging',
    processorType: Processor.IDS.FACTORY,
    setupTime: 57600,
    recipeTime: 3.6,
    batched: false,
    inputs: {
      [Product.IDS.NOVOLAK_PREPOLYMER_RESIN]: 2
    },
    outputs: {
      [Product.IDS.PHOTORESIST_EPOXY]: 1
    }
  },
  [IDS.AMMONIUM_DIURANATE_CALCINATION_AND_HYDROGEN_REDUCTION]: {
    i: IDS.AMMONIUM_DIURANATE_CALCINATION_AND_HYDROGEN_REDUCTION,
    name: 'Ammonium Diuranate Calcination and Hydrogen Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 100800,
    recipeTime: 63.36,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN]: 4,
      [Product.IDS.AMMONIUM_DIURANATE]: 624
    },
    outputs: {
      [Product.IDS.AMMONIA]: 34,
      [Product.IDS.DEIONIZED_WATER]: 54,
      [Product.IDS.URANIUM_DIOXIDE]: 540
    }
  },
  [IDS.AMMONIUM_PARATUNGSTATE_CALCINATION_AND_HYDROGEN_REDUCTION]: {
    i: IDS.AMMONIUM_PARATUNGSTATE_CALCINATION_AND_HYDROGEN_REDUCTION,
    name: 'Ammonium Paratungstate Calcination and Hydrogen Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 57600,
    recipeTime: 317.16,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN]: 72,
      [Product.IDS.AMMONIUM_PARATUNGSTATE]: 3132
    },
    outputs: {
      [Product.IDS.AMMONIA]: 170,
      [Product.IDS.DEIONIZED_WATER]: 828,
      [Product.IDS.TUNGSTEN]: 2206
    }
  },
  [IDS.ENGINE_BELL_ADDITIVE_MANUFACTURING]: {
    i: IDS.ENGINE_BELL_ADDITIVE_MANUFACTURING,
    name: 'Engine Bell Additive Manufacturing',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 345600,
    recipeTime: 61200,
    batched: false,
    inputs: {
      [Product.IDS.AUSTENITIC_NICHROME]: 300
    },
    outputs: {
      [Product.IDS.ENGINE_BELL]: 1
    }
  },
  [IDS.STEEL_TRUSS_CONSTRUCTION]: {
    i: IDS.STEEL_TRUSS_CONSTRUCTION,
    name: 'Steel Truss Construction',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 151200,
    recipeTime: 43200,
    batched: false,
    inputs: {
      [Product.IDS.STEEL_BEAM]: 1500
    },
    outputs: {
      [Product.IDS.STEEL_TRUSS]: 1
    }
  },
  [IDS.ALUMINIUM_HULL_PLATE_CONSTRUCTION]: {
    i: IDS.ALUMINIUM_HULL_PLATE_CONSTRUCTION,
    name: 'Aluminium Hull Plate Construction',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 172800,
    recipeTime: 28800,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM_SHEET]: 600
    },
    outputs: {
      [Product.IDS.ALUMINIUM_HULL_PLATE]: 1
    }
  },
  [IDS.ALUMINIUM_TRUSS_CONSTRUCTION]: {
    i: IDS.ALUMINIUM_TRUSS_CONSTRUCTION,
    name: 'Aluminium Truss Construction',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 180000,
    recipeTime: 39600,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM_BEAM]: 1000
    },
    outputs: {
      [Product.IDS.ALUMINIUM_TRUSS]: 1
    }
  },
  [IDS.CARGO_MODULE_CONSTRUCTION]: {
    i: IDS.CARGO_MODULE_CONSTRUCTION,
    name: 'Cargo Module Construction',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 288000,
    recipeTime: 50400,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM_BEAM]: 3000,
      [Product.IDS.ALUMINIUM_SHEET]: 2000
    },
    outputs: {
      [Product.IDS.CARGO_MODULE]: 1
    }
  },
  [IDS.ALUMINIUM_PRESSURE_VESSEL_CONSTRUCTION]: {
    i: IDS.ALUMINIUM_PRESSURE_VESSEL_CONSTRUCTION,
    name: 'Aluminium Pressure Vessel Construction',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 576000,
    recipeTime: 79200,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM_SHEET]: 1850
    },
    outputs: {
      [Product.IDS.PRESSURE_VESSEL]: 1
    }
  },
  [IDS.ALUMINIUM_PROPELLANT_TANK_CONSTRUCTION]: {
    i: IDS.ALUMINIUM_PROPELLANT_TANK_CONSTRUCTION,
    name: 'Aluminium Propellant Tank Construction',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 302400,
    recipeTime: 57600,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM_SHEET]: 3500
    },
    outputs: {
      [Product.IDS.PROPELLANT_TANK]: 1
    }
  },
  [IDS.SHUTTLE_HULL_CONSTRUCTION]: {
    i: IDS.SHUTTLE_HULL_CONSTRUCTION,
    name: 'Shuttle Hull Construction',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 518400,
    recipeTime: 518400,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM_HULL_PLATE]: 10,
      [Product.IDS.ALUMINIUM_TRUSS]: 4,
      [Product.IDS.PROPELLANT_TANK]: 8,
      [Product.IDS.HABITATION_MODULE]: 3
    },
    outputs: {
      [Product.IDS.SHUTTLE_HULL]: 1
    }
  },
  [IDS.LIGHT_TRANSPORT_HULL_CONSTRUCTION]: {
    i: IDS.LIGHT_TRANSPORT_HULL_CONSTRUCTION,
    name: 'Light Transport Hull Construction',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 691200,
    recipeTime: 691200,
    batched: false,
    inputs: {
      [Product.IDS.STEEL_TRUSS]: 6,
      [Product.IDS.ALUMINIUM_HULL_PLATE]: 8,
      [Product.IDS.PROPELLANT_TANK]: 16,
      [Product.IDS.HABITATION_MODULE]: 2
    },
    outputs: {
      [Product.IDS.LIGHT_TRANSPORT_HULL]: 1
    }
  },
  [IDS.CARGO_RING_CONSTRUCTION]: {
    i: IDS.CARGO_RING_CONSTRUCTION,
    name: 'Cargo Ring Construction',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 576000,
    recipeTime: 158400,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM_BEAM]: 8000,
      [Product.IDS.LARGE_THRUST_BEARING]: 1
    },
    outputs: {
      [Product.IDS.CARGO_RING]: 1
    }
  },
  [IDS.HEAVY_TRANSPORT_HULL_CONSTRUCTION]: {
    i: IDS.HEAVY_TRANSPORT_HULL_CONSTRUCTION,
    name: 'Heavy Transport Hull Construction',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 1728000,
    recipeTime: 1728000,
    batched: false,
    inputs: {
      [Product.IDS.STEEL_TRUSS]: 32,
      [Product.IDS.ALUMINIUM_HULL_PLATE]: 96,
      [Product.IDS.PROPELLANT_TANK]: 96,
      [Product.IDS.CARGO_RING]: 3,
      [Product.IDS.HABITATION_MODULE]: 4
    },
    outputs: {
      [Product.IDS.HEAVY_TRANSPORT_HULL]: 1
    }
  },
  [IDS.TUNGSTEN_GAS_ATOMIZATION]: {
    i: IDS.TUNGSTEN_GAS_ATOMIZATION,
    name: 'Tungsten Gas Atomization',
    processorType: Processor.IDS.FACTORY,
    setupTime: 57600,
    recipeTime: 4.5,
    batched: false,
    inputs: {
      [Product.IDS.TUNGSTEN]: 1
    },
    outputs: {
      [Product.IDS.TUNGSTEN_POWDER]: 1
    }
  },
  [IDS.HYDROGEN_CRYOCOOLING_AND_REACTOR_CONSUMABLES_STOICHIOMETRY]: {
    i: IDS.HYDROGEN_CRYOCOOLING_AND_REACTOR_CONSUMABLES_STOICHIOMETRY,
    name: 'Hydrogen Cryocooling and Reactor Consumables Stoichiometry',
    processorType: Processor.IDS.REFINERY,
    setupTime: 28800,
    recipeTime: 72,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN]: 97,
      [Product.IDS.SILICA_POWDER]: 2,
      [Product.IDS.TUNGSTEN_POWDER]: 1
    },
    outputs: {
      [Product.IDS.HYDROGEN_PROPELLANT]: 100
    }
  },
  [IDS.STAINLESS_STEEL_SHEET_ROLLING]: {
    i: IDS.STAINLESS_STEEL_SHEET_ROLLING,
    name: 'Stainless Steel Sheet Rolling',
    processorType: Processor.IDS.FACTORY,
    setupTime: 115200,
    recipeTime: 0.18,
    batched: false,
    inputs: {
      [Product.IDS.STAINLESS_STEEL]: 1
    },
    outputs: {
      [Product.IDS.STAINLESS_STEEL_SHEET]: 1
    }
  },
  [IDS.STAINLESS_STEEL_PIPE_ROLLING]: {
    i: IDS.STAINLESS_STEEL_PIPE_ROLLING,
    name: 'Stainless Steel Pipe Rolling',
    processorType: Processor.IDS.FACTORY,
    setupTime: 115200,
    recipeTime: 0.18,
    batched: false,
    inputs: {
      [Product.IDS.STAINLESS_STEEL]: 1
    },
    outputs: {
      [Product.IDS.STAINLESS_STEEL_PIPE]: 1
    }
  },
  [IDS.SILICON_WAFER_CPU_PHOTOLITHOGRAPHY_BALL_BONDING_AND_ENCAPSULATION]: {
    i: IDS.SILICON_WAFER_CPU_PHOTOLITHOGRAPHY_BALL_BONDING_AND_ENCAPSULATION,
    name: 'Silicon Wafer CPU Photolithography, Ball Bonding, and Encapsulation',
    processorType: Processor.IDS.FACTORY,
    setupTime: 302400,
    recipeTime: 3672000,
    batched: false,
    inputs: {
      [Product.IDS.GOLD]: 14000,
      [Product.IDS.POLYPROPYLENE]: 120000,
      [Product.IDS.PHOSPHORIC_ACID]: 3,
      [Product.IDS.BORIC_ACID]: 2,
      [Product.IDS.POTASSIUM_HYDROXIDE]: 48000,
      [Product.IDS.SILICON_WAFER]: 140000,
      [Product.IDS.PHOTORESIST_EPOXY]: 95000
    },
    outputs: {
      [Product.IDS.COMPUTER_CHIP]: 101500
    }
  },
  [IDS.CORE_DRILL_ASSEMBLY]: {
    i: IDS.CORE_DRILL_ASSEMBLY,
    name: 'Core Drill Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 21600,
    recipeTime: 119.88,
    batched: false,
    inputs: {
      [Product.IDS.CORE_DRILL_BIT]: 1,
      [Product.IDS.CORE_DRILL_THRUSTER]: 1,
      [Product.IDS.PURE_NITROGEN]: 18
    },
    outputs: {
      [Product.IDS.CORE_DRILL]: 1
    }
  },
  [IDS.NEODYMIUM_TRICHLORIDE_VACUUM_CALCIOTHERMIC_REDUCTION]: {
    i: IDS.NEODYMIUM_TRICHLORIDE_VACUUM_CALCIOTHERMIC_REDUCTION,
    name: 'Neodymium Trichloride Vacuum Calciothermic Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 64800,
    recipeTime: 248.4,
    batched: false,
    inputs: {
      [Product.IDS.CALCIUM]: 120,
      [Product.IDS.NEODYMIUM_TRICHLORIDE]: 501
    },
    outputs: {
      [Product.IDS.CALCIUM_CHLORIDE]: 333,
      [Product.IDS.NEODYMIUM]: 288
    }
  },
  [IDS.NEODYMIUM_TRICHLORIDE_MOLTEN_SALT_ELECTROLYSIS]: {
    i: IDS.NEODYMIUM_TRICHLORIDE_MOLTEN_SALT_ELECTROLYSIS,
    name: 'Neodymium Trichloride Molten Salt Electrolysis',
    processorType: Processor.IDS.REFINERY,
    setupTime: 79200,
    recipeTime: 1112.4,
    batched: false,
    inputs: {
      [Product.IDS.SODIUM_CHLORIDE]: 58,
      [Product.IDS.NEODYMIUM_TRICHLORIDE]: 251
    },
    outputs: {
      [Product.IDS.CHLORINE]: 142,
      [Product.IDS.NEODYMIUM]: 144
    }
  },
  [IDS.CHROMIA_ALUMINOTHERMIC_REDUCTION]: {
    i: IDS.CHROMIA_ALUMINOTHERMIC_REDUCTION,
    name: 'Chromia Aluminothermic Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 50400,
    recipeTime: 61.92,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 54,
      [Product.IDS.CHROMIA]: 152
    },
    outputs: {
      [Product.IDS.ALUMINA]: 102,
      [Product.IDS.CHROMIUM]: 104
    }
  },
  [IDS.URANIUM_DIOXIDE_OXIDATION]: {
    i: IDS.URANIUM_DIOXIDE_OXIDATION,
    name: 'Uranium Dioxide Oxidation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 57600,
    recipeTime: 5.04,
    batched: false,
    inputs: {
      [Product.IDS.HYDROFLUORIC_ACID]: 80,
      [Product.IDS.URANIUM_DIOXIDE]: 270
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 36,
      [Product.IDS.URANIUM_TETRAFLUORIDE]: 314
    }
  },
  [IDS.LEACHED_COFFINITE_FROTH_FLOTATION_SOLVENT_EXTRACTION_AND_PRECIPITATION]: {
    i: IDS.LEACHED_COFFINITE_FROTH_FLOTATION_SOLVENT_EXTRACTION_AND_PRECIPITATION,
    name: 'Leached Coffinite Froth Flotation, Solvent Extraction, and Precipitation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 129600,
    recipeTime: 84960,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN]: 4,
      [Product.IDS.NITRIC_ACID]: 252,
      [Product.IDS.AMMONIUM_CHLORIDE]: 107,
      [Product.IDS.LEACHED_COFFINITE]: 424320
    },
    outputs: {
      [Product.IDS.AMMONIA]: 34,
      [Product.IDS.DEIONIZED_WATER]: 72,
      [Product.IDS.HYDROCHLORIC_ACID]: 73,
      [Product.IDS.PLATINUM]: 195
    }
  },
  [IDS.ND_YAG_CZOCHRALSKI_PROCESS]: {
    i: IDS.ND_YAG_CZOCHRALSKI_PROCESS,
    name: 'Nd:YAG Czochralski Process',
    processorType: Processor.IDS.FACTORY,
    setupTime: 288000,
    recipeTime: 1947600,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINA]: 50981,
      [Product.IDS.NEODYMIUM_OXIDE]: 1009,
      [Product.IDS.YTTRIA]: 67066
    },
    outputs: {
      [Product.IDS.ND_YAG_LASER_ROD]: 119056
    }
  },
  [IDS.NICHROME_ALLOYING]: {
    i: IDS.NICHROME_ALLOYING,
    name: 'Nichrome Alloying',
    processorType: Processor.IDS.REFINERY,
    setupTime: 93600,
    recipeTime: 0.72,
    batched: false,
    inputs: {
      [Product.IDS.NICKEL]: 4,
      [Product.IDS.CHROMIUM]: 1
    },
    outputs: {
      [Product.IDS.NICHROME]: 5
    }
  },
  [IDS.MAGNET_SINTERING_AND_MAGNETIZATION]: {
    i: IDS.MAGNET_SINTERING_AND_MAGNETIZATION,
    name: 'Magnet Sintering and Magnetization',
    processorType: Processor.IDS.FACTORY,
    setupTime: 86400,
    recipeTime: 119.88,
    batched: false,
    inputs: {
      [Product.IDS.IRON]: 72,
      [Product.IDS.BORON]: 1,
      [Product.IDS.NEODYMIUM]: 27
    },
    outputs: {
      [Product.IDS.NEODYMIUM_MAGNET]: 100
    }
  },
  [IDS.URANIUM_TETRAFLUORIDE_OXIDATION]: {
    i: IDS.URANIUM_TETRAFLUORIDE_OXIDATION,
    name: 'Uranium Tetrafluoride Oxidation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 129600,
    recipeTime: 1.52,
    batched: false,
    inputs: {
      [Product.IDS.FLUORINE]: 38,
      [Product.IDS.URANIUM_TETRAFLUORIDE]: 314
    },
    outputs: {
      [Product.IDS.UNENRICHED_URANIUM_HEXAFLUORIDE]: 352
    }
  },
  [IDS.URANIUM_HEXAFLUORIDE_CENTRIFUGE_CASCADE_ENRICHMENT]: {
    i: IDS.URANIUM_HEXAFLUORIDE_CENTRIFUGE_CASCADE_ENRICHMENT,
    name: 'Uranium Hexafluoride Centrifuge Cascade Enrichment',
    processorType: Processor.IDS.REFINERY,
    setupTime: 432000,
    recipeTime: 6480000,
    batched: false,
    inputs: {
      [Product.IDS.UNENRICHED_URANIUM_HEXAFLUORIDE]: 530694
    },
    outputs: {
      [Product.IDS.HIGHLY_ENRICHED_URANIUM_HEXAFLUORIDE]: 2672
    }
  },
  [IDS.ND_YAG_LASER_ASSEMBLY]: {
    i: IDS.ND_YAG_LASER_ASSEMBLY,
    name: 'Nd:YAG Laser Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 180000,
    recipeTime: 2055.6,
    batched: false,
    inputs: {
      [Product.IDS.COPPER_WIRE]: 1,
      [Product.IDS.ALUMINIUM]: 8,
      [Product.IDS.LASER_DIODE]: 1,
      [Product.IDS.ND_YAG_LASER_ROD]: 10
    },
    outputs: {
      [Product.IDS.ND_YAG_LASER]: 20
    }
  },
  [IDS.THIN_FILM_RESISTOR_SPUTTERING_AND_LASER_TRIMMING]: {
    i: IDS.THIN_FILM_RESISTOR_SPUTTERING_AND_LASER_TRIMMING,
    name: 'Thin-film Resistor Sputtering and Laser-trimming',
    processorType: Processor.IDS.FACTORY,
    setupTime: 158400,
    recipeTime: 299880,
    batched: false,
    inputs: {
      [Product.IDS.POLYPROPYLENE]: 2500,
      [Product.IDS.ALUMINA_CERAMIC]: 12500,
      [Product.IDS.NICHROME]: 1
    },
    outputs: {
      [Product.IDS.THIN_FILM_RESISTOR]: 15000
    }
  },
  [IDS.HEUF6_MAGNESIOTHERMIC_REDUCTION_AND_FINE_DIVISION]: {
    i: IDS.HEUF6_MAGNESIOTHERMIC_REDUCTION_AND_FINE_DIVISION,
    name: 'HEUF6 Magnesiothermic Reduction and Fine Division',
    processorType: Processor.IDS.REFINERY,
    setupTime: 180000,
    recipeTime: 759.6,
    batched: false,
    inputs: {
      [Product.IDS.MAGNESIUM]: 73,
      [Product.IDS.HIGHLY_ENRICHED_URANIUM_HEXAFLUORIDE]: 349
    },
    outputs: {
      [Product.IDS.HIGHLY_ENRICHED_URANIUM_POWDER]: 235
    }
  },
  [IDS.SPIRULINA_AND_CHLORELLA_ALGAE_GROWING]: {
    i: IDS.SPIRULINA_AND_CHLORELLA_ALGAE_GROWING,
    name: 'Spirulina and Chlorella Algae Growing',
    processorType: Processor.IDS.BIOREACTOR,
    setupTime: 86400,
    recipeTime: 306000,
    batched: true,
    inputs: {
      [Product.IDS.AMMONIA]: 550,
      [Product.IDS.CARBON_DIOXIDE]: 5900,
      [Product.IDS.DEIONIZED_WATER]: 1300,
      [Product.IDS.SODIUM_BICARBONATE]: 150,
      [Product.IDS.TRIPLE_SUPERPHOSPHATE]: 170,
      [Product.IDS.PHOSPHATE_AND_SULFATE_SALTS]: 70,
      [Product.IDS.POTASSIUM_CHLORIDE]: 110
    },
    outputs: {
      [Product.IDS.SPIRULINA_AND_CHLORELLA_ALGAE]: 4000
    }
  },
  [IDS.PEDOT_BACTERIA_CULTURING]: {
    i: IDS.PEDOT_BACTERIA_CULTURING,
    name: 'PEDOT Bacteria Culturing',
    processorType: Processor.IDS.BIOREACTOR,
    setupTime: 86400,
    recipeTime: 54000,
    batched: true,
    inputs: {
      [Product.IDS.METHANE]: 280,
      [Product.IDS.OXYGEN]: 320,
      [Product.IDS.PHOSPHATE_AND_SULFATE_SALTS]: 740
    },
    outputs: {
      [Product.IDS.PEDOT]: 410
    }
  },
  [IDS.BPA_BACTERIA_CULTURING]: {
    i: IDS.BPA_BACTERIA_CULTURING,
    name: 'BPA Bacteria Culturing',
    processorType: Processor.IDS.BIOREACTOR,
    setupTime: 79200,
    recipeTime: 93600,
    batched: true,
    inputs: {
      [Product.IDS.METHANE]: 430,
      [Product.IDS.OXYGEN]: 690
    },
    outputs: {
      [Product.IDS.BISPHENOL_A]: 410
    }
  },
  [IDS.POTASSIUM_HYDROXIDE_CARBONATION]: {
    i: IDS.POTASSIUM_HYDROXIDE_CARBONATION,
    name: 'Potassium Hydroxide Carbonation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 28800,
    recipeTime: 0.843,
    batched: false,
    inputs: {
      [Product.IDS.CARBON_DIOXIDE]: 112,
      [Product.IDS.POTASSIUM_HYDROXIDE]: 44
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 18,
      [Product.IDS.POTASSIUM_CARBONATE]: 138
    }
  },
  [IDS.NOVOLAK_BACTERIA_CULTURING]: {
    i: IDS.NOVOLAK_BACTERIA_CULTURING,
    name: 'Novolak Bacteria Culturing',
    processorType: Processor.IDS.BIOREACTOR,
    setupTime: 115200,
    recipeTime: 108000,
    batched: true,
    inputs: {
      [Product.IDS.METHANE]: 410,
      [Product.IDS.OXYGEN]: 670
    },
    outputs: {
      [Product.IDS.NOVOLAK_PREPOLYMER_RESIN]: 410
    }
  },
  [IDS.FERROCHROMIUM_ALLOYING]: {
    i: IDS.FERROCHROMIUM_ALLOYING,
    name: 'Ferrochromium Alloying',
    processorType: Processor.IDS.REFINERY,
    setupTime: 86400,
    recipeTime: 0.339,
    batched: false,
    inputs: {
      [Product.IDS.IRON]: 1,
      [Product.IDS.CHROMIUM]: 1
    },
    outputs: {
      [Product.IDS.FERROCHROMIUM]: 2
    }
  },
  [IDS.POTASSIUM_CARBONATE_OXIDATION]: {
    i: IDS.POTASSIUM_CARBONATE_OXIDATION,
    name: 'Potassium Carbonate Oxidation',
    processorType: Processor.IDS.REFINERY,
    setupTime: 36000,
    recipeTime: 0.641,
    batched: false,
    inputs: {
      [Product.IDS.HYDROFLUORIC_ACID]: 40,
      [Product.IDS.POTASSIUM_CARBONATE]: 138
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.DEIONIZED_WATER]: 18,
      [Product.IDS.POTASSIUM_FLUORIDE]: 116
    }
  },
  [IDS.RHABDITE_SLAG_ACID_LEACHING]: {
    i: IDS.RHABDITE_SLAG_ACID_LEACHING,
    name: 'Rhabdite Slag Acid Leaching',
    processorType: Processor.IDS.REFINERY,
    setupTime: 129600,
    recipeTime: 435.6,
    batched: false,
    inputs: {
      [Product.IDS.HYDROFLUORIC_ACID]: 520,
      [Product.IDS.RHABDITE_SLAG]: 1416
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 180,
      [Product.IDS.HYDROGEN_HEPTAFLUOROTANTALATE_AND_NIOBATE]: 1048
    }
  },
  [IDS.TANTALATE_NIOBATE_LIQUID_LIQUID_EXTRACTION_AND_REDOX]: {
    i: IDS.TANTALATE_NIOBATE_LIQUID_LIQUID_EXTRACTION_AND_REDOX,
    name: 'Tantalate-Niobate Liquid-Liquid Extraction and Redox',
    processorType: Processor.IDS.REFINERY,
    setupTime: 86400,
    recipeTime: 698.4,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN_HEPTAFLUOROTANTALATE_AND_NIOBATE]: 544,
      [Product.IDS.POTASSIUM_FLUORIDE]: 232
    },
    outputs: {
      [Product.IDS.HYDROFLUORIC_ACID]: 80,
      [Product.IDS.POTASSIUM_HEPTAFLUOROTANTALATE]: 392
    }
  },
  [IDS.CARBON_DIOXIDE_FERROCATALYSIS]: {
    i: IDS.CARBON_DIOXIDE_FERROCATALYSIS,
    name: 'Carbon Dioxide Ferrocatalysis',
    processorType: Processor.IDS.REFINERY,
    setupTime: 21600,
    recipeTime: 15.84,
    batched: false,
    inputs: {
      [Product.IDS.CARBON_DIOXIDE]: 11
    },
    outputs: {
      [Product.IDS.CARBON_MONOXIDE]: 7,
      [Product.IDS.OXYGEN]: 4
    }
  },
  [IDS.POTASSIUM_HEPTAFLUOROTANTALATE_SODIOTHERMIC_REDUCTION]: {
    i: IDS.POTASSIUM_HEPTAFLUOROTANTALATE_SODIOTHERMIC_REDUCTION,
    name: 'Potassium Heptafluorotantalate Sodiothermic Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 108000,
    recipeTime: 493.2,
    batched: false,
    inputs: {
      [Product.IDS.SODIUM_CHLORIDE]: 292,
      [Product.IDS.POTASSIUM_HEPTAFLUOROTANTALATE]: 392
    },
    outputs: {
      [Product.IDS.CHLORINE]: 177,
      [Product.IDS.POTASSIUM_FLUORIDE]: 116,
      [Product.IDS.TANTALUM]: 181
    }
  },
  [IDS.RHABDITE_CARBOTHERMIC_REDUCTION]: {
    i: IDS.RHABDITE_CARBOTHERMIC_REDUCTION,
    name: 'Rhabdite Carbothermic Reduction',
    processorType: Processor.IDS.REFINERY,
    setupTime: 72000,
    recipeTime: 1368,
    batched: false,
    inputs: {
      [Product.IDS.GRAPHITE]: 2556,
      [Product.IDS.ROASTED_RHABDITE]: 24076
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 9372,
      [Product.IDS.FERROCHROMIUM]: 16153,
      [Product.IDS.RHABDITE_SLAG]: 1107
    }
  },
  [IDS.POLYMER_TANTALUM_CAPACITOR_ASSEMBLY]: {
    i: IDS.POLYMER_TANTALUM_CAPACITOR_ASSEMBLY,
    name: 'Polymer Tantalum Capacitor Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 259200,
    recipeTime: 225000,
    batched: false,
    inputs: {
      [Product.IDS.GRAPHITE]: 1,
      [Product.IDS.SULFURIC_ACID]: 2900,
      [Product.IDS.SILVER]: 19,
      [Product.IDS.EPOXY]: 1000,
      [Product.IDS.TANTALUM]: 8000,
      [Product.IDS.PEDOT]: 1000
    },
    outputs: {
      [Product.IDS.POLYMER_TANTALUM_CAPACITOR]: 10000
    }
  },
  [IDS.SURFACE_MOUNT_DEVICE_REEL_ASSEMBLY]: {
    i: IDS.SURFACE_MOUNT_DEVICE_REEL_ASSEMBLY,
    name: 'Surface Mount Device Reel Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 172800,
    recipeTime: 4.5,
    batched: false,
    inputs: {
      [Product.IDS.DIODE]: 1,
      [Product.IDS.FERRITE_BEAD_INDUCTOR]: 2,
      [Product.IDS.THIN_FILM_RESISTOR]: 1,
      [Product.IDS.POLYMER_TANTALUM_CAPACITOR]: 1
    },
    outputs: {
      [Product.IDS.SURFACE_MOUNT_DEVICE_REEL]: 1
    }
  },
  [IDS.PICK_AND_PLACE_BOARD_POPULATION]: {
    i: IDS.PICK_AND_PLACE_BOARD_POPULATION,
    name: 'Pick-and-place Board Population',
    processorType: Processor.IDS.FACTORY,
    setupTime: 288000,
    recipeTime: 47.88,
    batched: false,
    inputs: {
      [Product.IDS.SOLDER]: 8,
      [Product.IDS.BARE_CIRCUIT_BOARD]: 10,
      [Product.IDS.SURFACE_MOUNT_DEVICE_REEL]: 2
    },
    outputs: {
      [Product.IDS.CIRCUIT_BOARD]: 20
    }
  },
  [IDS.MOTOR_STATOR_ASSEMBLY]: {
    i: IDS.MOTOR_STATOR_ASSEMBLY,
    name: 'Motor Stator Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 144000,
    recipeTime: 180,
    batched: false,
    inputs: {
      [Product.IDS.COPPER_WIRE]: 15,
      [Product.IDS.ALUMINIUM]: 5,
      [Product.IDS.FERRITE]: 9,
      [Product.IDS.CIRCUIT_BOARD]: 1
    },
    outputs: {
      [Product.IDS.BRUSHLESS_MOTOR_STATOR]: 10
    }
  },
  [IDS.MOTOR_ROTOR_ASSEMBLY]: {
    i: IDS.MOTOR_ROTOR_ASSEMBLY,
    name: 'Motor Rotor Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 108000,
    recipeTime: 45,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 5,
      [Product.IDS.BALL_BEARING]: 1,
      [Product.IDS.NEODYMIUM_MAGNET]: 9
    },
    outputs: {
      [Product.IDS.BRUSHLESS_MOTOR_ROTOR]: 5
    }
  },
  [IDS.BRUSHLESS_MOTOR_ASSEMBLY]: {
    i: IDS.BRUSHLESS_MOTOR_ASSEMBLY,
    name: 'Brushless Motor Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 86400,
    recipeTime: 7.2,
    batched: false,
    inputs: {
      [Product.IDS.BRUSHLESS_MOTOR_STATOR]: 1,
      [Product.IDS.BRUSHLESS_MOTOR_ROTOR]: 1
    },
    outputs: {
      [Product.IDS.BRUSHLESS_MOTOR]: 1
    }
  },
  [IDS.LANDING_LEG_ASSEMBLY]: {
    i: IDS.LANDING_LEG_ASSEMBLY,
    name: 'Landing Leg Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 288000,
    recipeTime: 28800,
    batched: false,
    inputs: {
      [Product.IDS.SOLDER]: 4,
      [Product.IDS.STEEL_BEAM]: 500,
      [Product.IDS.STEEL_SHEET]: 296,
      [Product.IDS.COPPER_WIRE]: 4,
      [Product.IDS.BRUSHLESS_MOTOR]: 2
    },
    outputs: {
      [Product.IDS.LANDING_LEG]: 1
    }
  },
  [IDS.LANDING_AUGER_ASSEMBLY]: {
    i: IDS.LANDING_AUGER_ASSEMBLY,
    name: 'Landing Auger Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 108000,
    recipeTime: 7200,
    batched: false,
    inputs: {
      [Product.IDS.STEEL_SHEET]: 80,
      [Product.IDS.STEEL_PIPE]: 40,
      [Product.IDS.COPPER_WIRE]: 6,
      [Product.IDS.BRUSHLESS_MOTOR]: 3
    },
    outputs: {
      [Product.IDS.LANDING_AUGER]: 1
    }
  },
  [IDS.PUMP_ASSEMBLY]: {
    i: IDS.PUMP_ASSEMBLY,
    name: 'Pump Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 72000,
    recipeTime: 119.88,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 9,
      [Product.IDS.BALL_BEARING]: 1,
      [Product.IDS.BRUSHLESS_MOTOR]: 5
    },
    outputs: {
      [Product.IDS.PUMP]: 5
    }
  },
  [IDS.ANTENNA_ASSEMBLY]: {
    i: IDS.ANTENNA_ASSEMBLY,
    name: 'Antenna Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 129600,
    recipeTime: 2401.2,
    batched: false,
    inputs: {
      [Product.IDS.SOLDER]: 1,
      [Product.IDS.COPPER_WIRE]: 29,
      [Product.IDS.PARABOLIC_DISH]: 10,
      [Product.IDS.CIRCUIT_BOARD]: 1
    },
    outputs: {
      [Product.IDS.RADIO_ANTENNA]: 10
    }
  },
  [IDS.FIBER_OPTIC_GYROSCOPE_ASSEMBLY]: {
    i: IDS.FIBER_OPTIC_GYROSCOPE_ASSEMBLY,
    name: 'Fiber Optic Gyroscope Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 216000,
    recipeTime: 2998.8,
    batched: false,
    inputs: {
      [Product.IDS.FIBER_OPTIC_CABLE]: 17,
      [Product.IDS.ND_YAG_LASER]: 2,
      [Product.IDS.CIRCUIT_BOARD]: 1
    },
    outputs: {
      [Product.IDS.FIBER_OPTIC_GYROSCOPE]: 10
    }
  },
  [IDS.STAR_TRACKER_ASSEMBLY]: {
    i: IDS.STAR_TRACKER_ASSEMBLY,
    name: 'Star Tracker Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 144000,
    recipeTime: 18000,
    batched: false,
    inputs: {
      [Product.IDS.BOROSILICATE_GLASS]: 92,
      [Product.IDS.CCD]: 1,
      [Product.IDS.COMPUTER_CHIP]: 2,
      [Product.IDS.CIRCUIT_BOARD]: 5
    },
    outputs: {
      [Product.IDS.STAR_TRACKER]: 50
    }
  },
  [IDS.COMPUTER_ASSEMBLY]: {
    i: IDS.COMPUTER_ASSEMBLY,
    name: 'Computer Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 72000,
    recipeTime: 7200,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 36,
      [Product.IDS.COMPUTER_CHIP]: 4,
      [Product.IDS.CIRCUIT_BOARD]: 10
    },
    outputs: {
      [Product.IDS.COMPUTER]: 50
    }
  },
  [IDS.CONTROL_MOMENT_GYROSCOPE_ASSEMBLY]: {
    i: IDS.CONTROL_MOMENT_GYROSCOPE_ASSEMBLY,
    name: 'Control Moment Gyroscope Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 259200,
    recipeTime: 18000,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 1475,
      [Product.IDS.BALL_BEARING]: 4,
      [Product.IDS.CIRCUIT_BOARD]: 1,
      [Product.IDS.BRUSHLESS_MOTOR]: 20
    },
    outputs: {
      [Product.IDS.CONTROL_MOMENT_GYROSCOPE]: 10
    }
  },
  [IDS.ROBOTIC_ARM_ASSEMBLY]: {
    i: IDS.ROBOTIC_ARM_ASSEMBLY,
    name: 'Robotic Arm Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 172800,
    recipeTime: 299.88,
    batched: false,
    inputs: {
      [Product.IDS.SOLDER]: 1,
      [Product.IDS.STEEL_BEAM]: 250,
      [Product.IDS.POLYPROPYLENE]: 19,
      [Product.IDS.COPPER_WIRE]: 3,
      [Product.IDS.BRUSHLESS_MOTOR]: 5,
      [Product.IDS.COMPUTER]: 1
    },
    outputs: {
      [Product.IDS.ROBOTIC_ARM]: 1
    }
  },
  [IDS.FELDSPAR_ALUMINIUM_HYDROXIDE_CALCINATION]: {
    i: IDS.FELDSPAR_ALUMINIUM_HYDROXIDE_CALCINATION,
    name: 'Feldspar Aluminium Hydroxide Calcination',
    processorType: Processor.IDS.REFINERY,
    setupTime: 14400,
    recipeTime: 11.232,
    batched: false,
    inputs: {
      [Product.IDS.LEACHED_FELDSPAR]: 156
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 54,
      [Product.IDS.ALUMINA]: 102
    }
  },
  [IDS.FERROCHROMIUM_ROASTING_AND_HOT_BASE_LEACHING]: {
    i: IDS.FERROCHROMIUM_ROASTING_AND_HOT_BASE_LEACHING,
    name: 'Ferrochromium Roasting and Hot Base Leaching',
    processorType: Processor.IDS.REFINERY,
    setupTime: 72000,
    recipeTime: 5436,
    batched: false,
    inputs: {
      [Product.IDS.OXYGEN]: 5280,
      [Product.IDS.SODIUM_CARBONATE]: 8267,
      [Product.IDS.FERROCHROMIUM]: 8076
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 3432,
      [Product.IDS.IRON_OXIDE]: 5557,
      [Product.IDS.SODIUM_CHROMATE]: 12634
    }
  },
  [IDS.BERYLLIUM_CARBONATE_CALCINATION]: {
    i: IDS.BERYLLIUM_CARBONATE_CALCINATION,
    name: 'Beryllium Carbonate Calcination',
    processorType: Processor.IDS.REFINERY,
    setupTime: 43200,
    recipeTime: 2.736,
    batched: false,
    inputs: {
      [Product.IDS.BERYLLIUM_CARBONATE]: 69
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.BERYLLIA]: 25
    }
  },
  [IDS.BERYLLIA_FORMING_AND_SINTERING]: {
    i: IDS.BERYLLIA_FORMING_AND_SINTERING,
    name: 'Beryllia Forming and Sintering',
    processorType: Processor.IDS.FACTORY,
    setupTime: 216000,
    recipeTime: 2.002,
    batched: false,
    inputs: {
      [Product.IDS.BERYLLIA]: 1
    },
    outputs: {
      [Product.IDS.BERYLLIA_CERAMIC]: 1
    }
  },
  [IDS.SILICON_WAFER_CCD_PHOTOLITHOGRAPHY_BALL_BONDING_AND_PACKAGING]: {
    i: IDS.SILICON_WAFER_CCD_PHOTOLITHOGRAPHY_BALL_BONDING_AND_PACKAGING,
    name: 'Silicon Wafer CCD Photolithography, Ball Bonding, and Packaging',
    processorType: Processor.IDS.FACTORY,
    setupTime: 345600,
    recipeTime: 2250000,
    batched: false,
    inputs: {
      [Product.IDS.GOLD]: 2250,
      [Product.IDS.POLYPROPYLENE]: 37000,
      [Product.IDS.PHOSPHORIC_ACID]: 1,
      [Product.IDS.BORIC_ACID]: 2,
      [Product.IDS.POTASSIUM_HYDROXIDE]: 31000,
      [Product.IDS.SILICON_WAFER]: 90000,
      [Product.IDS.PHOTORESIST_EPOXY]: 61000
    },
    outputs: {
      [Product.IDS.CCD]: 62500
    }
  },
  [IDS.HEAT_EXCHANGER_ASSEMBLY]: {
    i: IDS.HEAT_EXCHANGER_ASSEMBLY,
    name: 'Heat Exchanger Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 252000,
    recipeTime: 25200,
    batched: false,
    inputs: {
      [Product.IDS.STAINLESS_STEEL]: 10,
      [Product.IDS.STAINLESS_STEEL_PIPE]: 30
    },
    outputs: {
      [Product.IDS.HEAT_EXCHANGER]: 1
    }
  },
  [IDS.TURBOPUMP_ASSEMBLY]: {
    i: IDS.TURBOPUMP_ASSEMBLY,
    name: 'Turbopump Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 576000,
    recipeTime: 720000,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINA_CERAMIC]: 400,
      [Product.IDS.BALL_VALVE]: 5,
      [Product.IDS.BALL_BEARING]: 2,
      [Product.IDS.STAINLESS_STEEL]: 2000,
      [Product.IDS.STAINLESS_STEEL_PIPE]: 500
    },
    outputs: {
      [Product.IDS.TURBOPUMP]: 10
    }
  },
  [IDS.LASER_DIODE_DOPING_AMORPHIZATION_AND_ASSEMBLY]: {
    i: IDS.LASER_DIODE_DOPING_AMORPHIZATION_AND_ASSEMBLY,
    name: 'Laser Diode Doping, Amorphization, and Assembly',
    processorType: Processor.IDS.FACTORY,
    setupTime: 216000,
    recipeTime: 5868000,
    batched: false,
    inputs: {
      [Product.IDS.GOLD]: 308,
      [Product.IDS.PHOSPHORIC_ACID]: 7,
      [Product.IDS.BORIC_ACID]: 22,
      [Product.IDS.SILICON_WAFER]: 3080,
      [Product.IDS.ALUMINIUM]: 61600
    },
    outputs: {
      [Product.IDS.LASER_DIODE]: 65000
    }
  },
  [IDS.SEPARATOR_CENTRIFUGE_ASSEMBLY]: {
    i: IDS.SEPARATOR_CENTRIFUGE_ASSEMBLY,
    name: 'Separator Centrifuge Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 410400,
    recipeTime: 57600,
    batched: false,
    inputs: {
      [Product.IDS.COPPER_WIRE]: 2,
      [Product.IDS.BORON]: 140,
      [Product.IDS.STAINLESS_STEEL]: 32,
      [Product.IDS.STAINLESS_STEEL_PIPE]: 14,
      [Product.IDS.NICHROME]: 2
    },
    outputs: {
      [Product.IDS.NEON_FUEL_SEPARATOR_CENTRIFUGE]: 1
    }
  },
  [IDS.FUEL_MAKE_UP_TANK_ASSEMBLY]: {
    i: IDS.FUEL_MAKE_UP_TANK_ASSEMBLY,
    name: 'Fuel Make-up Tank Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 288000,
    recipeTime: 43200,
    batched: false,
    inputs: {
      [Product.IDS.BALL_VALVE]: 3,
      [Product.IDS.BORON]: 140,
      [Product.IDS.STAINLESS_STEEL_SHEET]: 20,
      [Product.IDS.STAINLESS_STEEL_PIPE]: 4,
      [Product.IDS.HIGHLY_ENRICHED_URANIUM_POWDER]: 33
    },
    outputs: {
      [Product.IDS.FUEL_MAKE_UP_TANK]: 2
    }
  },
  [IDS.NEON_MAKE_UP_TANK_ASSEMBLY]: {
    i: IDS.NEON_MAKE_UP_TANK_ASSEMBLY,
    name: 'Neon Make-up Tank Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 144000,
    recipeTime: 21600,
    batched: false,
    inputs: {
      [Product.IDS.BALL_VALVE]: 1,
      [Product.IDS.STAINLESS_STEEL_SHEET]: 10,
      [Product.IDS.STAINLESS_STEEL_PIPE]: 2,
      [Product.IDS.NEON]: 487
    },
    outputs: {
      [Product.IDS.NEON_MAKE_UP_TANK]: 2
    }
  },
  [IDS.LIGHTBULB_END_MODERATORS_ASSEMBLY]: {
    i: IDS.LIGHTBULB_END_MODERATORS_ASSEMBLY,
    name: 'Lightbulb End Moderators Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 360000,
    recipeTime: 57600,
    batched: false,
    inputs: {
      [Product.IDS.GRAPHITE]: 54,
      [Product.IDS.STAINLESS_STEEL_PIPE]: 2,
      [Product.IDS.BERYLLIA_CERAMIC]: 74
    },
    outputs: {
      [Product.IDS.LIGHTBULB_END_MODERATORS]: 1
    }
  },
  [IDS.COLD_GAS_TORQUE_THRUSTER_PRINTING]: {
    i: IDS.COLD_GAS_TORQUE_THRUSTER_PRINTING,
    name: 'Cold Gas Torque Thruster Printing',
    processorType: Processor.IDS.FACTORY,
    setupTime: 57600,
    recipeTime: 14.4,
    batched: false,
    inputs: {
      [Product.IDS.ALUMINIUM]: 3
    },
    outputs: {
      [Product.IDS.COLD_GAS_TORQUE_THRUSTER]: 1
    }
  },
  [IDS.FUSED_QUARTZ_LIGHTBULB_ADDITIVE_SUBTRACTIVE_ASSEMBLY]: {
    i: IDS.FUSED_QUARTZ_LIGHTBULB_ADDITIVE_SUBTRACTIVE_ASSEMBLY,
    name: 'Fused Quartz Lightbulb Additive/Subtractive Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 432000,
    recipeTime: 57600,
    batched: false,
    inputs: {
      [Product.IDS.FUSED_QUARTZ]: 50
    },
    outputs: {
      [Product.IDS.FUSED_QUARTZ_LIGHTBULB_TUBE]: 1
    }
  },
  [IDS.REACTOR_PLUMBING_ASSEMBLY_SQUARED]: {
    i: IDS.REACTOR_PLUMBING_ASSEMBLY_SQUARED,
    name: 'Reactor Plumbing Assembly Squared',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 900000,
    recipeTime: 201600,
    batched: false,
    inputs: {
      [Product.IDS.SOLDER]: 4,
      [Product.IDS.COPPER_WIRE]: 46,
      [Product.IDS.BALL_VALVE]: 35,
      [Product.IDS.PUMP]: 7,
      [Product.IDS.COMPUTER]: 1,
      [Product.IDS.HEAT_EXCHANGER]: 8,
      [Product.IDS.TURBOPUMP]: 1,
      [Product.IDS.NEON_FUEL_SEPARATOR_CENTRIFUGE]: 1,
      [Product.IDS.FUEL_MAKE_UP_TANK]: 3,
      [Product.IDS.NEON_MAKE_UP_TANK]: 3
    },
    outputs: {
      [Product.IDS.REACTOR_PLUMBING_ASSEMBLY]: 1
    }
  },
  [IDS.FLOW_DIVIDER_MODERATOR_ASSEMBLY]: {
    i: IDS.FLOW_DIVIDER_MODERATOR_ASSEMBLY,
    name: 'Flow Divider Moderator Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 864000,
    recipeTime: 172800,
    batched: false,
    inputs: {
      [Product.IDS.GRAPHITE]: 12000,
      [Product.IDS.STAINLESS_STEEL]: 200,
      [Product.IDS.BERYLLIA_CERAMIC]: 6500
    },
    outputs: {
      [Product.IDS.FLOW_DIVIDER_MODERATOR]: 1
    }
  },
  [IDS.NUCLEAR_LIGHTBULB_ASSEMBLY]: {
    i: IDS.NUCLEAR_LIGHTBULB_ASSEMBLY,
    name: 'Nuclear Lightbulb Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 316800,
    recipeTime: 46800,
    batched: false,
    inputs: {
      [Product.IDS.LIGHTBULB_END_MODERATORS]: 1,
      [Product.IDS.FUSED_QUARTZ_LIGHTBULB_TUBE]: 1
    },
    outputs: {
      [Product.IDS.NUCLEAR_LIGHTBULB]: 1
    }
  },
  [IDS.REACTOR_SHELL_ASSEMBLY]: {
    i: IDS.REACTOR_SHELL_ASSEMBLY,
    name: 'Reactor Shell Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 648000,
    recipeTime: 194400,
    batched: false,
    inputs: {
      [Product.IDS.FIBERGLASS]: 1000,
      [Product.IDS.STEEL_BEAM]: 1000,
      [Product.IDS.CARBON_FIBER]: 2000,
      [Product.IDS.EPOXY]: 1500,
      [Product.IDS.STAINLESS_STEEL_SHEET]: 450,
      [Product.IDS.STAINLESS_STEEL_PIPE]: 50
    },
    outputs: {
      [Product.IDS.COMPOSITE_OVERWRAPPED_REACTOR_SHELL]: 1
    }
  },
  [IDS.CLOSED_CYCLE_GAS_CORE_NUCLEAR_REACTOR_ENGINE_ASSEMBLY]: {
    i: IDS.CLOSED_CYCLE_GAS_CORE_NUCLEAR_REACTOR_ENGINE_ASSEMBLY,
    name: 'Closed-cycle Gas Core Nuclear Reactor Engine Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 1296000,
    recipeTime: 432000,
    batched: false,
    inputs: {
      [Product.IDS.ENGINE_BELL]: 7,
      [Product.IDS.REACTOR_PLUMBING_ASSEMBLY]: 1,
      [Product.IDS.FLOW_DIVIDER_MODERATOR]: 1,
      [Product.IDS.NUCLEAR_LIGHTBULB]: 7,
      [Product.IDS.COMPOSITE_OVERWRAPPED_REACTOR_SHELL]: 1
    },
    outputs: {
      [Product.IDS.CLOSED_CYCLE_GAS_CORE_NUCLEAR_REACTOR_ENGINE]: 1
    }
  },
  [IDS.HABITATION_MODULE_ASSEMBLY]: {
    i: IDS.HABITATION_MODULE_ASSEMBLY,
    name: 'Habitation Module Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 360000,
    recipeTime: 75600,
    batched: false,
    inputs: {
      [Product.IDS.OXYGEN]: 63,
      [Product.IDS.FUSED_QUARTZ]: 50,
      [Product.IDS.PRESSURE_VESSEL]: 1,
      [Product.IDS.PURE_NITROGEN]: 237
    },
    outputs: {
      [Product.IDS.HABITATION_MODULE]: 1
    }
  },
  [IDS.MOBILITY_MODULE_ASSEMBLY]: {
    i: IDS.MOBILITY_MODULE_ASSEMBLY,
    name: 'Mobility Module Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 396000,
    recipeTime: 54000,
    batched: false,
    inputs: {
      [Product.IDS.BALL_VALVE]: 10,
      [Product.IDS.COLD_GAS_THRUSTER]: 12,
      [Product.IDS.SMALL_PROPELLANT_TANK]: 74,
      [Product.IDS.STAINLESS_STEEL_PIPE]: 30,
      [Product.IDS.PURE_NITROGEN]: 1480
    },
    outputs: {
      [Product.IDS.MOBILITY_MODULE]: 1
    }
  },
  [IDS.FLUIDS_AUTOMATION_MODULE_ASSEMBLY]: {
    i: IDS.FLUIDS_AUTOMATION_MODULE_ASSEMBLY,
    name: 'Fluids Automation Module Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 518400,
    recipeTime: 36000,
    batched: false,
    inputs: {
      [Product.IDS.SOLDER]: 2,
      [Product.IDS.COPPER_WIRE]: 9,
      [Product.IDS.BALL_VALVE]: 20,
      [Product.IDS.STAINLESS_STEEL_SHEET]: 2490,
      [Product.IDS.STAINLESS_STEEL_PIPE]: 1000,
      [Product.IDS.PUMP]: 10,
      [Product.IDS.COMPUTER]: 1
    },
    outputs: {
      [Product.IDS.FLUIDS_AUTOMATION_MODULE]: 1
    }
  },
  [IDS.SOLIDS_AUTOMATION_MODULE_ASSEMBLY]: {
    i: IDS.SOLIDS_AUTOMATION_MODULE_ASSEMBLY,
    name: 'Solids Automation Module Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 576000,
    recipeTime: 43200,
    batched: false,
    inputs: {
      [Product.IDS.SOLDER]: 2,
      [Product.IDS.STEEL_BEAM]: 2000,
      [Product.IDS.STEEL_SHEET]: 910,
      [Product.IDS.COPPER_WIRE]: 10,
      [Product.IDS.BALL_BEARING]: 20,
      [Product.IDS.BRUSHLESS_MOTOR]: 10,
      [Product.IDS.ROBOTIC_ARM]: 2
    },
    outputs: {
      [Product.IDS.SOLIDS_AUTOMATION_MODULE]: 1
    }
  },
  [IDS.TERRAIN_INTERFACE_MODULE_ASSEMBLY]: {
    i: IDS.TERRAIN_INTERFACE_MODULE_ASSEMBLY,
    name: 'Terrain Interface Module Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 360000,
    recipeTime: 28800,
    batched: false,
    inputs: {
      [Product.IDS.LANDING_LEG]: 1,
      [Product.IDS.LANDING_AUGER]: 1
    },
    outputs: {
      [Product.IDS.TERRAIN_INTERFACE_MODULE]: 1
    }
  },
  [IDS.AVIONICS_MODULE_ASSEMBLY]: {
    i: IDS.AVIONICS_MODULE_ASSEMBLY,
    name: 'Avionics Module Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 648000,
    recipeTime: 43200,
    batched: false,
    inputs: {
      [Product.IDS.SOLDER]: 10,
      [Product.IDS.COPPER_WIRE]: 404,
      [Product.IDS.RADIO_ANTENNA]: 1,
      [Product.IDS.FIBER_OPTIC_GYROSCOPE]: 3,
      [Product.IDS.STAR_TRACKER]: 1,
      [Product.IDS.COMPUTER]: 3
    },
    outputs: {
      [Product.IDS.AVIONICS_MODULE]: 1
    }
  },
  [IDS.ESCAPE_MODULE_ASSEMBLY]: {
    i: IDS.ESCAPE_MODULE_ASSEMBLY,
    name: 'Escape Module Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 864000,
    recipeTime: 259200,
    batched: false,
    inputs: {
      [Product.IDS.DEIONIZED_WATER]: 124,
      [Product.IDS.FOOD]: 1800,
      [Product.IDS.PHOTOVOLTAIC_PANEL]: 2,
      [Product.IDS.LIPO_BATTERY]: 5,
      [Product.IDS.HABITATION_MODULE]: 1,
      [Product.IDS.MOBILITY_MODULE]: 1,
      [Product.IDS.AVIONICS_MODULE]: 1
    },
    outputs: {
      [Product.IDS.ESCAPE_MODULE]: 1
    }
  },
  [IDS.ATTITUDE_CONTROL_MODULE_ASSEMBLY]: {
    i: IDS.ATTITUDE_CONTROL_MODULE_ASSEMBLY,
    name: 'Attitude Control Module Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 417600,
    recipeTime: 86400,
    batched: false,
    inputs: {
      [Product.IDS.SOLDER]: 1,
      [Product.IDS.COPPER_WIRE]: 3,
      [Product.IDS.ALUMINIUM_BEAM]: 16,
      [Product.IDS.COMPUTER]: 1,
      [Product.IDS.CONTROL_MOMENT_GYROSCOPE]: 4
    },
    outputs: {
      [Product.IDS.ATTITUDE_CONTROL_MODULE]: 1
    }
  },
  [IDS.POWER_MODULE_ASSEMBLY]: {
    i: IDS.POWER_MODULE_ASSEMBLY,
    name: 'Power Module Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 345600,
    recipeTime: 36000,
    batched: false,
    inputs: {
      [Product.IDS.SOLDER]: 4,
      [Product.IDS.COPPER_WIRE]: 70,
      [Product.IDS.PHOTOVOLTAIC_PANEL]: 250,
      [Product.IDS.LIPO_BATTERY]: 585,
      [Product.IDS.CIRCUIT_BOARD]: 1
    },
    outputs: {
      [Product.IDS.POWER_MODULE]: 5
    }
  },
  [IDS.THERMAL_MODULE_ASSEMBLY]: {
    i: IDS.THERMAL_MODULE_ASSEMBLY,
    name: 'Thermal Module Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 345600,
    recipeTime: 32400,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 500,
      [Product.IDS.BALL_VALVE]: 10,
      [Product.IDS.STAINLESS_STEEL_PIPE]: 474,
      [Product.IDS.PUMP]: 2
    },
    outputs: {
      [Product.IDS.THERMAL_MODULE]: 1
    }
  },
  [IDS.PROPULSION_MODULE_ASSEMBLY]: {
    i: IDS.PROPULSION_MODULE_ASSEMBLY,
    name: 'Propulsion Module Assembly',
    processorType: Processor.IDS.SHIPYARD,
    setupTime: 720000,
    recipeTime: 345600,
    batched: false,
    inputs: {
      [Product.IDS.STEEL_BEAM]: 1500,
      [Product.IDS.COPPER_WIRE]: 5,
      [Product.IDS.ALUMINIUM_PIPE]: 495,
      [Product.IDS.CLOSED_CYCLE_GAS_CORE_NUCLEAR_REACTOR_ENGINE]: 1
    },
    outputs: {
      [Product.IDS.PROPULSION_MODULE]: 1
    }
  },
  [IDS.SULFUR_DIOXIDE_PLASMA_CATALYSIS]: {
    i: IDS.SULFUR_DIOXIDE_PLASMA_CATALYSIS,
    name: 'Sulfur Dioxide Plasma Catalysis',
    processorType: Processor.IDS.REFINERY,
    setupTime: 57600,
    recipeTime: 171.36,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN]: 4,
      [Product.IDS.SULFUR_DIOXIDE]: 64
    },
    outputs: {
      [Product.IDS.DEIONIZED_WATER]: 36,
      [Product.IDS.SULFUR]: 32
    }
  },
  [IDS.PARKES_PROCESS]: {
    i: IDS.PARKES_PROCESS,
    name: 'Parkes Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 79200,
    recipeTime: 1180.8,
    batched: false,
    inputs: {
      [Product.IDS.ZINC]: 189,
      [Product.IDS.LEAD]: 10049
    },
    outputs: {
      [Product.IDS.SILVER]: 99,
      [Product.IDS.GOLD]: 1
    }
  },
  [IDS.BICARBONATE_SOLVAY_PROCESS]: {
    i: IDS.BICARBONATE_SOLVAY_PROCESS,
    name: 'Bicarbonate Solvay Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 93600,
    recipeTime: 321.48,
    batched: false,
    inputs: {
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.CALCITE]: 100,
      [Product.IDS.DEIONIZED_WATER]: 18,
      [Product.IDS.SODIUM_CHLORIDE]: 117
    },
    outputs: {
      [Product.IDS.SODIUM_BICARBONATE]: 168,
      [Product.IDS.CALCIUM_CHLORIDE]: 111
    }
  },
  [IDS.SOLVAY_HOU_PROCESS]: {
    i: IDS.SOLVAY_HOU_PROCESS,
    name: 'Solvay-Hou Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 93600,
    recipeTime: 245.52,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 34,
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.DEIONIZED_WATER]: 18,
      [Product.IDS.SODIUM_CHLORIDE]: 117
    },
    outputs: {
      [Product.IDS.SODIUM_CARBONATE]: 106,
      [Product.IDS.AMMONIUM_CHLORIDE]: 107
    }
  },
  [IDS.BICARBONATE_SOLVAY_HOU_PROCESS]: {
    i: IDS.BICARBONATE_SOLVAY_HOU_PROCESS,
    name: 'Bicarbonate Solvay-Hou Process',
    processorType: Processor.IDS.REFINERY,
    setupTime: 100800,
    recipeTime: 326.88,
    batched: false,
    inputs: {
      [Product.IDS.AMMONIA]: 34,
      [Product.IDS.CARBON_DIOXIDE]: 88,
      [Product.IDS.DEIONIZED_WATER]: 36,
      [Product.IDS.SODIUM_CHLORIDE]: 117
    },
    outputs: {
      [Product.IDS.SODIUM_BICARBONATE]: 168,
      [Product.IDS.AMMONIUM_CHLORIDE]: 107
    }
  },
  [IDS.SODIUM_BICARBONATE_CALCINATION]: {
    i: IDS.SODIUM_BICARBONATE_CALCINATION,
    name: 'Sodium Bicarbonate Calcination',
    processorType: Processor.IDS.REFINERY,
    setupTime: 10800,
    recipeTime: 9.072,
    batched: false,
    inputs: {
      [Product.IDS.SODIUM_BICARBONATE]: 168
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.DEIONIZED_WATER]: 18,
      [Product.IDS.SODIUM_CARBONATE]: 106
    }
  },
  [IDS.EPOXY_STOICHIOMETRY_AND_PACKAGING]: {
    i: IDS.EPOXY_STOICHIOMETRY_AND_PACKAGING,
    name: 'Epoxy Stoichiometry and Packaging',
    processorType: Processor.IDS.FACTORY,
    setupTime: 43200,
    recipeTime: 1.44,
    batched: false,
    inputs: {
      [Product.IDS.DIEPOXY_PREPOLYMER_RESIN]: 2
    },
    outputs: {
      [Product.IDS.EPOXY]: 1
    }
  },
  [IDS.PEDOT_ALGAE_GROWING]: {
    i: IDS.PEDOT_ALGAE_GROWING,
    name: 'PEDOT Algae Growing',
    processorType: Processor.IDS.BIOREACTOR,
    setupTime: 93600,
    recipeTime: 378000,
    batched: true,
    inputs: {
      [Product.IDS.CARBON_DIOXIDE]: 740,
      [Product.IDS.DEIONIZED_WATER]: 150,
      [Product.IDS.PHOSPHATE_AND_SULFATE_SALTS]: 720
    },
    outputs: {
      [Product.IDS.PEDOT]: 400
    }
  },
  [IDS.BPA_ALGAE_GROWING]: {
    i: IDS.BPA_ALGAE_GROWING,
    name: 'BPA Algae Growing',
    processorType: Processor.IDS.BIOREACTOR,
    setupTime: 79200,
    recipeTime: 414000,
    batched: true,
    inputs: {
      [Product.IDS.CARBON_DIOXIDE]: 1150,
      [Product.IDS.DEIONIZED_WATER]: 250
    },
    outputs: {
      [Product.IDS.BISPHENOL_A]: 400
    }
  },
  [IDS.NOVOLAK_ALGAE_GROWING]: {
    i: IDS.NOVOLAK_ALGAE_GROWING,
    name: 'Novolak Algae Growing',
    processorType: Processor.IDS.BIOREACTOR,
    setupTime: 86400,
    recipeTime: 450000,
    batched: true,
    inputs: {
      [Product.IDS.CARBON_DIOXIDE]: 1100,
      [Product.IDS.DEIONIZED_WATER]: 250
    },
    outputs: {
      [Product.IDS.NOVOLAK_PREPOLYMER_RESIN]: 400
    }
  },
  [IDS.HYDROCHLORIC_REDOX]: {
    i: IDS.HYDROCHLORIC_REDOX,
    name: 'Hydrochloric Redox',
    processorType: Processor.IDS.REFINERY,
    setupTime: 28800,
    recipeTime: 3.6,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN]: 2,
      [Product.IDS.CHLORINE]: 71
    },
    outputs: {
      [Product.IDS.HYDROCHLORIC_ACID]: 73
    }
  },
  [IDS.HYDROFLUORIC_REDOX]: {
    i: IDS.HYDROFLUORIC_REDOX,
    name: 'Hydrofluoric Redox',
    processorType: Processor.IDS.REFINERY,
    setupTime: 115200,
    recipeTime: 3.6,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN]: 2,
      [Product.IDS.FLUORINE]: 38
    },
    outputs: {
      [Product.IDS.HYDROFLUORIC_ACID]: 40
    }
  },
  [IDS.METHANE_COMBUSTION]: {
    i: IDS.METHANE_COMBUSTION,
    name: 'Methane Combustion',
    processorType: Processor.IDS.REFINERY,
    setupTime: 14400,
    recipeTime: 1.8,
    batched: false,
    inputs: {
      [Product.IDS.METHANE]: 16,
      [Product.IDS.OXYGEN]: 64
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.DEIONIZED_WATER]: 36
    }
  },
  [IDS.CARBON_MONOXIDE_ARC_DECOMPOSITION]: {
    i: IDS.CARBON_MONOXIDE_ARC_DECOMPOSITION,
    name: 'Carbon Monoxide Arc Decomposition',
    processorType: Processor.IDS.REFINERY,
    setupTime: 93600,
    recipeTime: 428.4,
    batched: false,
    inputs: {
      [Product.IDS.CARBON_MONOXIDE]: 112
    },
    outputs: {
      [Product.IDS.CARBON_DIOXIDE]: 44,
      [Product.IDS.OXYGEN]: 32
    }
  },
  [IDS.HYDROGEN_PROPELLANT_UNBUNDLING]: {
    i: IDS.HYDROGEN_PROPELLANT_UNBUNDLING,
    name: 'Hydrogen Propellant Unbundling',
    processorType: Processor.IDS.REFINERY,
    setupTime: 7200,
    recipeTime: 144,
    batched: false,
    inputs: {
      [Product.IDS.HYDROGEN_PROPELLANT]: 100
    },
    outputs: {
      [Product.IDS.HYDROGEN]: 97,
      [Product.IDS.SILICA_POWDER]: 2,
      [Product.IDS.TUNGSTEN_POWDER]: 1
    }
  }
};

const getType = (type) => TYPES[type] ? { ...TYPES[type] } : null;

const getListByProcessorType = (processorType) => Object.values(TYPES).filter(type => type.processorType === processorType);

const getProcessingTime = (processId, recipes, totalBonus = 1) => {
  if (!TYPES[processId]) return 0;
  const recipeTimes = TYPES[processId].batched ? Math.ceil(recipes) : recipes;
  return recipeTimes * TYPES[processId].recipeTime / totalBonus;
}

// Calculates the units of each output for a process given a target product
const getOutputs = (processId, recipes, targetOuput = null, secondaryBonus = 1) => {
  if (!TYPES[processId]) return {};
  const process = TYPES[processId];
  const actualTarget = targetOuput || Object.keys(process.outputs)[0];
  const secondaryAdjust = Math.max(0, 1 - 0.375 / secondaryBonus);

  return Object.keys(process.outputs).map(outputId => {
    if (Number(actualTarget) === Number(outputId)) {
      return {
        id: Number(outputId),
        amount: Math.floor(process.outputs[outputId] * recipes)
      };
    } else {
      return {
        id: Number(outputId),
        amount: Math.floor(process.outputs[outputId] * recipes * secondaryAdjust)
      };
    }
  });
};

const getSetupTime = (processId, totalBonus = 1) => {
  if (!TYPES[processId]) return 0;
  return TYPES[processId].setupTime / totalBonus;
}

export default {
  IDS,
  TYPES,

  getListByProcessorType,
  getOutputs,
  getProcessingTime,
  getSetupTime,
  getType
};
