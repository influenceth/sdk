declare module 'influence-utils' {
  export const enum SpectralType {
    C = 'C',
    Cm = 'Cm',
    Ci = 'Ci',
    Cs = 'Cs',
    Cms = 'Cms',
    Cis = 'Cis',
    S = 'S',
    Sm = 'Sm',
    Si = 'Si',
    M = 'M',
    I = 'I',
  }

  export const enum Rarity {
    Common = 'Common',
    Uncommon = 'Uncommon',
    Rare = 'Rare',
    Superior = 'Superior',
    Exceptional = 'Exceptional',
    Incomparable = 'Incomparable',
  }

  export const enum Size {
    Small = 'Small',
    Medium = 'Medium',
    Large = 'Large',
    Huge = 'Huge',
  }

  export const enum BonusType {
    Yield = 'yield',
    Volantile = 'volatile',
    Metal = 'metal',
    Organic = 'organic',
    RareEarth = 'rareearth',
    Fissile = 'fissile',
  }

  export interface Bonus {
    position: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
    name: string;
    level: 1 | 2 | 3;
    modifier: number;
    type: BonusType;
  }

  export interface OrbitalElements {
    a: number;
    e: number;
    i: number;
    o: number;
    w: number;
    m: number;
  }

  export interface BonusMap {
    spectralTypes: number[];
    base: Omit<Bonus, 'position'>;
    bonuses: Bonus[];
  }

  export interface Point {
    x: number;
    y: number;
    z: number;
  }

  export const MASTER_SEED: number;
  export const START_TIMESTAMP: number;
  export const MAX_RADIUS: number;
  export const TOTAL_ASTEROIDS: number;
  export const BONUS_MAPS: BonusMap[];

  export function toBonus(num: number): Bonus | undefined;
  export function toBonuses(packed: number, spectralTypes: number): Bonus[];
  export function toRarity(bonuses: Bonus[]): Rarity;
  export function isScanned(packed: number): boolean;
  export function toSpectralType(num: number): SpectralType;
  export function toSize(radius: number): Size;

  export class KeplerianOrbit {
    constructor(elements: OrbitalElements);

    getRadius(t: number): number;
    getPosByAngle(t: number): Point;
    getSmoothOrbit(numPoints: number): Point[];
    getPeriod(): number;
    getPositionAtTime(elapsed: number): Point;
  }
}
