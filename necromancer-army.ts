import { Weapon } from "./shared/entities/weapon.entity";
import { DiceType } from "./shared/enums/dice-type.enum";
import { PhysicalDamageType } from "./shared/enums/physical-damage-type.enum";
import {
  DisplayAttachResultService,
  Skeleton,
  UndeadManager,
} from "./utils/undead-manager";
import { Unit } from "./shared/entities/unit.entity";
import { MagicalDamageType } from "./shared/enums/magical-damage-type.enum";
import {CharacteristicType} from "./shared/enums/characteristic-type.enum";

const arsenal = {
  shortsword: new Weapon({
    name: "Shortsword",
    physicalDiceCount: 1,
    physicalDiceType: DiceType.d6,
    physicalDamageType: PhysicalDamageType.Slashing,
    damageBonus: 0,
    attackBonus: 0,
  }),
  longbow: new Weapon({
    name: "Longbow",
    physicalDiceCount: 1,
    physicalDiceType: DiceType.d8,
    physicalDamageType: PhysicalDamageType.Piercing,
    damageBonus: 0,
    attackBonus: 0,
  }),

  rapier: new Weapon({
    name: "Rapier",
    physicalDiceCount: 1,
    physicalDiceType: DiceType.d8,
    physicalDamageType: PhysicalDamageType.Piercing,
    damageBonus: 0,
    attackBonus: 0,
  }),
  handCrossbow: new Weapon({
    name: "handCrossbow",
    physicalDiceCount: 1,
    physicalDiceType: DiceType.d6,
    physicalDamageType: PhysicalDamageType.Piercing,
    damageBonus: 0,
    attackBonus: 0,
  }),

  pirateRatSword: new Weapon({
    name: "PirateRatSword",
    physicalDamageType: PhysicalDamageType.Slashing,
    damageBonus: 3,
    magicalDamageType: MagicalDamageType.Lightning,
    attackBonus: 5,
    physicalDiceCount: 0,
    physicalDiceType: DiceType.d4,
    magicalDiceCount: 4,
    magicalDiceType: DiceType.d6,
  }),
  pirateRatPsyPistol: new Weapon({
    name: "PsyPistol",
    physicalDamageType: PhysicalDamageType.Piercing,
    damageBonus: 0,
    magicalDiceType: DiceType.d6,
    magicalDiceCount: 2,
    physicalDiceType: DiceType.d4,
    physicalDiceCount: 0,
    attackBonus: 5,
    magicalDamageType: MagicalDamageType.Psychic,
  }),
};

const undeads: Unit[] = [
  // new Skeleton(
  //   "Skeleton Nickita",
  //   {},
  //   arsenal.rapier,
  //   arsenal.handCrossbow,
  // ).receiveDamage(8),
  // new Skeleton(
  //   "Skeleton Stas",
  //   {},
  //   arsenal.rapier,
  //   arsenal.handCrossbow,
  // ).receiveDamage(6),
  // new Skeleton("Skeleton Gena", {}, arsenal.rapier, arsenal.handCrossbow),
  // new Skeleton("Skeleton Turbo", {}, arsenal.rapier, arsenal.handCrossbow),
  new Skeleton("Skeleton Diusha", {}, arsenal.rapier, arsenal.handCrossbow),
];

const undeadArmy = new UndeadManager({
  undeads,
  necromancerHealthBonus: 10,
  necromancerDamageBonus: 8,
  attackBonus: 4,
});



const meleeAttacks = undeadArmy.makeMeleeAttacks(8);
const rangeAttacks = undeadArmy.makeRangedAttacks(8);

// DisplayAttachResultService.displayAllSuccessful(meleeAttacks);
// DisplayAttachResultService.displayAllSuccessful(rangeAttacks);

DisplayAttachResultService.displayForArmorClassRange(meleeAttacks, 8, 23, 1, 'Melee attacks');
// DisplayAttachResultService.displayForArmorClassRange(rangeAttacks, 8, 23, 1, 'Range attacks');

// console.log(undeadArmy.makeSavingThrows(CharacteristicType.Wisdom, 17));
// console.log(undeadArmy.getAliveUndeads());
