// Keyed by capableType -> inventoryType
// Capacities are in tonnes and cubic meters
export const CAPACITIES = {
  1: {
    0: { name: 'Construction Site', mass: 0, volume: 0 },
    1: { name: 'Storage', mass: 1500000, volume: 75000 }
  },
  2: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  3: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  4: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  5: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  6: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  7: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  8: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  },
  9: {
    0: { name: 'Construction Site', mass: 0, volume: 0 }
  }
};

/**
 * Map of resourceIds to details
 * massPerUnit is in tonnes / unit
 * volumePerUnit is in cubic meters / unit
 */
export const RESOURCES = {
  1: { name: 'Water', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.00103, iconVersion: 1, modelVersion: 1 },
  2: { name: 'Hydrogen', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.014, iconVersion: 1, modelVersion: 1 },
  3: { name: 'Ammonia', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.0016, iconVersion: 1, modelVersion: 1 },
  4: { name: 'Nitrogen', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.0012, iconVersion: 1, modelVersion: 1 },
  5: { name: 'Sulfur Dioxide', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.00072, iconVersion: 1, modelVersion: 1 },
  6: { name: 'Carbon Dioxide', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.00064, iconVersion: 1, modelVersion: 1 },
  7: { name: 'Carbon Monoxide', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.00127, iconVersion: 1, modelVersion: 1 },
  8: { name: 'Methane', category: 'Volatile', massPerUnit: 0.001, volumePerUnit: 0.00235, iconVersion: 1, modelVersion: 1 },
  9: { name: 'Apatite', category: 'Organic', massPerUnit: 0.001, volumePerUnit: 0.00052, iconVersion: 1, modelVersion: 1 },
  10: { name: 'Bitumen', category: 'Organic', massPerUnit: 0.001, volumePerUnit: 0.0016, iconVersion: 1, modelVersion: 1 },
  11: { name: 'Calcite', category: 'Organic', massPerUnit: 0.001, volumePerUnit: 0.00062, iconVersion: 1, modelVersion: 1 },
  12: { name: 'Feldspar', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00065, iconVersion: 1, modelVersion: 1 },
  13: { name: 'Olivine', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00062, iconVersion: 1, modelVersion: 1 },
  14: { name: 'Pyroxene', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00048, iconVersion: 1, modelVersion: 1 },
  15: { name: 'Coffinite', category: 'Fissile', massPerUnit: 0.001, volumePerUnit: 0.0003, iconVersion: 1, modelVersion: 1 },
  16: { name: 'Merrillite', category: 'Rare Earth', massPerUnit: 0.001, volumePerUnit: 0.00053, iconVersion: 1, modelVersion: 1 },
  17: { name: 'Xenotime', category: 'Rare Earth', massPerUnit: 0.001, volumePerUnit: 0.00035, iconVersion: 1, modelVersion: 1 },
  18: { name: 'Rhabdite', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00023, iconVersion: 1, modelVersion: 1 },
  19: { name: 'Graphite', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00073, iconVersion: 1, modelVersion: 1 },
  20: { name: 'Taenite', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.0002, iconVersion: 1, modelVersion: 1 },
  21: { name: 'Troilite', category: 'Metal', massPerUnit: 0.001, volumePerUnit: 0.00037, iconVersion: 1, modelVersion: 1 },
  22: { name: 'Uraninite', category: 'Fissile', massPerUnit: 0.001, volumePerUnit: 0.000155, iconVersion: 1, modelVersion: 1 },
  23: { name: 'Oxygen', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  24: { name: 'Deionized Water', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  25: { name: 'Salts', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  26: { name: 'Silica', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  27: { name: 'Naphtha', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  28: { name: 'Sodium Bicarbonate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  29: { name: 'Iron', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  30: { name: 'Copper', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  31: { name: 'Nickel', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  32: { name: 'Quicklime', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  33: { name: 'Acetylene', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  34: { name: 'Ammonium Carbonate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  35: { name: 'Triple Superphosphate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  36: { name: 'Phosphate and Sulfate Salts', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  37: { name: 'Iron Sulfide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  38: { name: 'Lead Sulfide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  39: { name: 'Tin Sulfide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  40: { name: 'Molybdenum Disulfide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  41: { name: 'Fused Quartz', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  42: { name: 'Fiberglass', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  43: { name: 'Bare Copper Wire', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  44: { name: 'Concrete', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  45: { name: 'Sodium Chloride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  46: { name: 'Potassium Chloride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  47: { name: 'Borax', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  48: { name: 'Lithium Carbonate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  49: { name: 'Magnesium Chloride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  50: { name: 'Propylene', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  52: { name: 'Steel', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  53: { name: 'Silicon', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  54: { name: 'Nitric Acid', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  55: { name: 'Sulfuric Acid', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  56: { name: 'Soil', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  57: { name: 'Ferrosilicon', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  59: { name: 'Oxalic Acid', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  60: { name: 'Silver', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  61: { name: 'Gold', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  62: { name: 'Tin', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  63: { name: 'Iron Oxide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  64: { name: 'Spirulina and Chlorella Algae', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  65: { name: 'Molybdenum Trioxide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  66: { name: 'Silica Powder', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  67: { name: 'Solder', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  68: { name: 'Fiber Optic Cable', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  69: { name: 'Steel Beam', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  70: { name: 'Steel Sheet', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  71: { name: 'Steel Pipe', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  72: { name: 'Steel Wire', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  73: { name: 'Acrylonitrile', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  74: { name: 'Polypropylene', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  75: { name: 'Magnesium', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  76: { name: 'Chlorine', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  77: { name: 'Sodium Carbonate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  78: { name: 'Calcium Chloride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  79: { name: 'Boron Trioxide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  80: { name: 'Lithium Sulfate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  81: { name: 'Hydrochloric Acid', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  82: { name: 'Hydrofluoric Acid', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  83: { name: 'Phosphoric Acid', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  84: { name: 'Boric Acid', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  85: { name: 'Zinc Oxide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  86: { name: 'Nickel Oxide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  87: { name: 'Magnesium Oxide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  88: { name: 'Alumina', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  89: { name: 'Sodium Hydroxide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  90: { name: 'Potassium Hydroxide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  91: { name: 'Soybeans', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  92: { name: 'Potatoes', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  93: { name: 'Ammonium Oxalate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  94: { name: 'Rare Earth Sulfates', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  95: { name: 'Ferrochromium', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  96: { name: 'Yellowcake', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  97: { name: 'Alumina Ceramic', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  98: { name: 'Austenitic Nichrome', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  99: { name: 'Copper Wire', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  100: { name: 'Silicon Wafer', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  101: { name: 'Steel Cable', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  102: { name: 'Polyacrylonitrile', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  103: { name: 'Natural Flavorings', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  105: { name: 'Lithium Chloride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  106: { name: 'Zinc', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  107: { name: 'Epichlorohydrin', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  108: { name: 'Bisphenol A', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  109: { name: 'Rare Earth Oxides', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  110: { name: 'Ammonium Chloride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  111: { name: 'Aluminium', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  112: { name: 'Calcium', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  113: { name: 'Sodium Chromate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  115: { name: 'Uranyl Nitrate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  116: { name: 'Fluorine', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  117: { name: 'Sodium Tungstate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  118: { name: 'Ferrite', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  119: { name: 'Diode', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  120: { name: 'Laser Diode', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  121: { name: 'Ball Valve', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  122: { name: 'Aluminium Beam', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  123: { name: 'Aluminium Sheet', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  124: { name: 'Aluminium Pipe', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  125: { name: 'Polyacrylonitrile Fabric', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  126: { name: 'Cold Gas Thruster', massPerUnit: 0.003, iconVersion: 1, modelVersion: 1 },
  127: { name: 'Cold Gas Torque Thruster', massPerUnit: 0.003, iconVersion: 1, modelVersion: 1 },
  128: { name: 'Carbon Fiber', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  129: { name: 'Food', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  130: { name: 'Small Propellant Tank', massPerUnit: 0.006, iconVersion: 1, modelVersion: 1 },
  131: { name: 'Borosilicate Glass', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  132: { name: 'Ball Bearing', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  133: { name: 'Large Thrust Bearing', massPerUnit: 2, iconVersion: 1, modelVersion: 1 },
  134: { name: 'Boron', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  135: { name: 'Lithium', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  136: { name: 'Epoxy', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  137: { name: 'Neodymium Oxide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  138: { name: 'Yttrium Oxide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  139: { name: 'Sodium Dichromate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  140: { name: 'Novolak', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  141: { name: 'Ferromolybdenum', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  142: { name: 'Ammonium Diuranate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  143: { name: 'Ammonium Paratungstate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  144: { name: 'Engine Bell', massPerUnit: 0.3, iconVersion: 1, modelVersion: 1 },
  145: { name: 'Steel Truss', massPerUnit: 1.5, iconVersion: 1, modelVersion: 1 },
  146: { name: 'Aluminium Hull Plate', massPerUnit: 0.6, iconVersion: 1, modelVersion: 1 },
  147: { name: 'Aluminium Truss', massPerUnit: 1, iconVersion: 1, modelVersion: 1 },
  148: { name: 'Cargo Module', massPerUnit: 5, iconVersion: 1, modelVersion: 1 },
  149: { name: 'Pressure Vessel', massPerUnit: 1.85, iconVersion: 1, modelVersion: 1 },
  150: { name: 'Propellant Tank', massPerUnit: 3.5, iconVersion: 1, modelVersion: 1 },
  151: { name: 'Stainless Steel', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  152: { name: 'Bare Circuit Board', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  153: { name: 'Ferrite-bead Inductor', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  154: { name: 'Core Sampler Drill', massPerUnit: 0.002, iconVersion: 1, modelVersion: 1 },
  155: { name: 'Core Sampler Thruster', massPerUnit: 0.01, iconVersion: 1, modelVersion: 1 },
  156: { name: 'Parabolic Dish', massPerUnit: 0.072, iconVersion: 1, modelVersion: 1 },
  157: { name: 'Photovoltaic Panel', massPerUnit: 0.008, iconVersion: 1, modelVersion: 1 },
  158: { name: 'LiPo Battery', massPerUnit: 0.005, iconVersion: 1, modelVersion: 1 },
  159: { name: 'Neodymium Trichloride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  160: { name: 'Yttrium Fluoride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  161: { name: 'Chromia', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  162: { name: 'Photoresist Epoxy', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  163: { name: 'Uranium Dioxide', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  164: { name: 'Tungsten', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  165: { name: 'Shuttle Hull', massPerUnit: 44.6, iconVersion: 1, modelVersion: 1 },
  166: { name: 'Light Transport Hull', massPerUnit: 74.2, iconVersion: 1, modelVersion: 1 },
  167: { name: 'Cargo Ring', massPerUnit: 10, iconVersion: 1, modelVersion: 1 },
  168: { name: 'Heavy Transport Hull', massPerUnit: 480.4, iconVersion: 1, modelVersion: 1 },
  169: { name: 'Tungsten Powder', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  170: { name: 'Hydrogen Propellant', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  171: { name: 'Stainless Steel Sheet', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  172: { name: 'Stainless Steel Pipe', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  173: { name: 'CCD', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  174: { name: 'Computer Chip', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  175: { name: 'Core Sampler', category: 'Tool', massPerUnit: 0.03, volumePerUnit: 0.4, iconVersion: 1, modelVersion: 1 },
  176: { name: 'Neodymium', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  177: { name: 'Yttrium', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  178: { name: 'Chromium', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  179: { name: 'Uranium Tetrafluoride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  181: { name: 'Nd:YAG Laser Rod', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  182: { name: 'Nichrome', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  183: { name: 'Neodymium Magnet', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  184: { name: 'Unenriched Uranium Hexafluoride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  185: { name: 'Highly Enriched Uranium Hexafluoride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  186: { name: 'Nd:YAG Laser', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  187: { name: 'Thin-film Resistor', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  188: { name: 'Highly Enriched Uranium Powder', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  192: { name: 'Potassium Carbonate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  195: { name: 'Potassium Fluoride', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  196: { name: 'Hydrogen Heptafluorotantalate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  199: { name: 'Tantalum', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  200: { name: 'PEDOT', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  201: { name: 'Polymer Tantalum Capacitor', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  202: { name: 'Surface Mount Device Reel', massPerUnit: 0.005, iconVersion: 1, modelVersion: 1 },
  203: { name: 'Circuit Board', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  204: { name: 'Brushless Motor Stator', massPerUnit: 0.003, iconVersion: 1, modelVersion: 1 },
  205: { name: 'Brushless Motor Rotor', massPerUnit: 0.003, iconVersion: 1, modelVersion: 1 },
  206: { name: 'Brushless Motor', massPerUnit: 0.006, iconVersion: 1, modelVersion: 1 },
  207: { name: 'Landing Leg', massPerUnit: 0.816, iconVersion: 1, modelVersion: 1 },
  208: { name: 'Landing Auger', massPerUnit: 0.144, iconVersion: 1, modelVersion: 1 },
  209: { name: 'Pump', massPerUnit: 0.008, iconVersion: 1, modelVersion: 1 },
  210: { name: 'Radio Antenna', massPerUnit: 0.075, iconVersion: 1, modelVersion: 1 },
  211: { name: 'Fiber Optic Gyroscope', massPerUnit: 0.002, iconVersion: 1, modelVersion: 1 },
  212: { name: 'Star Tracker', massPerUnit: 0.002, iconVersion: 1, modelVersion: 1 },
  213: { name: 'Computer', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  214: { name: 'Control Moment Gyroscope', massPerUnit: 0.16, iconVersion: 1, modelVersion: 1 },
  215: { name: 'Robotic Arm', massPerUnit: 0.3, iconVersion: 1, modelVersion: 1 },
  217: { name: 'Beryllium Carbonate', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  218: { name: 'Beryllia', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  219: { name: 'Beryllia Ceramic', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  220: { name: 'Neon', massPerUnit: 0.001, iconVersion: 1, modelVersion: 1 },
  221: { name: 'Heat Exchanger', massPerUnit: 0.04, iconVersion: 1, modelVersion: 1 },
  222: { name: 'Turbopump', massPerUnit: 0.29, iconVersion: 1, modelVersion: 1 },
  224: { name: 'Neon/Fuel Separator Centrifuge', massPerUnit: 0.19, iconVersion: 1, modelVersion: 1 },
  225: { name: 'Fuel Make-up Tank', massPerUnit: 0.1, iconVersion: 1, modelVersion: 1 },
  226: { name: 'Neon Make-up Tank', massPerUnit: 0.25, iconVersion: 1, modelVersion: 1 },
  227: { name: 'Lightbulb Upper and Lower End Moderators', massPerUnit: 0.13, iconVersion: 1, modelVersion: 1 },
  229: { name: 'Fused Quartz Lightbulb Tube', massPerUnit: 0.05, iconVersion: 1, modelVersion: 1 },
  230: { name: 'Reactor Plumbing Assembly', massPerUnit: 1.942, iconVersion: 1, modelVersion: 1 },
  231: { name: 'Flow Divider Moderator', massPerUnit: 18.7, iconVersion: 1, modelVersion: 1 },
  232: { name: 'Nuclear Lightbulb', massPerUnit: 0.18, iconVersion: 1, modelVersion: 1 },
  233: { name: 'Composite-overwrapped Reactor Shell', massPerUnit: 6, iconVersion: 1, modelVersion: 1 },
  234: { name: 'Closed-cycle Gas Core Nuclear Reactor Engine', massPerUnit: 30, iconVersion: 1, modelVersion: 1 },
  235: { name: 'Habitation Module', massPerUnit: 2.2, iconVersion: 1, modelVersion: 1 },
  236: { name: 'Mobility Module', massPerUnit: 2, iconVersion: 1, modelVersion: 1 },
  237: { name: 'Fluids Automation Module', massPerUnit: 3.6, iconVersion: 1, modelVersion: 1 },
  238: { name: 'Solids Automation Module', massPerUnit: 3.6, iconVersion: 1, modelVersion: 1 },
  239: { name: 'Terrain Interface Module', massPerUnit: 0.96, iconVersion: 1, modelVersion: 1 },
  240: { name: 'Avionics Module', massPerUnit: 0.5, iconVersion: 1, modelVersion: 1 },
  241: { name: 'Escape Module', massPerUnit: 6.665, iconVersion: 1, modelVersion: 1 },
  242: { name: 'Attitude Control Module', massPerUnit: 0.66, iconVersion: 1, modelVersion: 1 },
  243: { name: 'Power Module', massPerUnit: 2, iconVersion: 1, modelVersion: 1 },
  244: { name: 'Thermal Module', massPerUnit: 1, iconVersion: 1, modelVersion: 1 },
  245: { name: 'Propulsion Module', massPerUnit: 32, iconVersion: 1, modelVersion: 1 }
};

export const getCapacities = (capableType, inventoryType) => {
  if (CAPACITIES[capableType]) {
    return CAPACITIES[capableType][inventoryType];
  } else {
    throw new Error('Capable type does not exist');
  }
};

/**
 * Converts a raw resourceIds / quantities array pair into a resource details set
 * @param {[integer]|object} resources Object with resourceId -> quantity OR array of resourceIds
 * @param {[integer]} quantities Array of quantities (required when resourcesSet is an array)
 * @returns An object with a set of resources and a total mass and volume (in tonnes and cubic meters)
 */
export const getContents = (resources, quantities = []) => {
  let resourceIds = resources;

  if (!Array.isArray(resources)) {
    resourceIds = Object.keys(resources);
    quantities = Object.values(resources);
  } else {
    if (resources.length !== quantities.length) throw new Error('Resources ids and quantities must match');
  }

  const resourceDetails = {};
  const totals = { mass: 0, volume: 0 };

  resourceIds.forEach((resourceId, index) => {
    const config = RESOURCES[Number(resourceId)];
    const quantity = quantities[index];
    const mass = quantity * config.massPerUnit;
    const volume = quantity * config.volumePerUnit;

    totals.mass += mass;
    totals.volume += volume;
    resourceDetails[Number(resourceId)] = {
      name: config.name, quantity, mass, massPerUnit: config.massPerUnit, volume, volumePerUnit: config.volumePerUnit
    };
  });

  return { resources: resourceDetails, totals };
};

/**
 * @param {integer} resourceId
 * @returns Details on the specific resource
 */
export const getResource = (resourceId) => {
  return RESOURCES[resourceId];
};

export default {
  RESOURCES,
  getContents,
  getResource
};
