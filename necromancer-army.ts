import { Weapon } from "./shared/entities/weapon.entity";
import { DiceType } from "./shared/enums/dice-type.enum";
import { PhysicalDamageType } from "./shared/enums/physical-damage-type.enum";
import { Skeleton, UndeadManager } from "./utils/undead-manager";
import { Unit } from "./shared/entities/unit.entity";

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
};

const undeads: Unit[] = [
  new Skeleton("Zombie1", {}, arsenal.shortsword, arsenal.longbow),
  new Skeleton("Zombie2", {}, arsenal.shortsword, arsenal.longbow),
  new Skeleton("Zombie3", {}, arsenal.shortsword, arsenal.longbow),
  new Skeleton("Zombie4", {}, arsenal.shortsword, arsenal.longbow),
  new Skeleton("Zombie5", {}, arsenal.shortsword, arsenal.longbow),
];

const undeadArmy = new UndeadManager({
  undeads,
  necromancerHealthBonus: 10,
  necromancerDamageBonus: 8,
  attackBonus: 4,
});

// console.log(undeadArmy.makeMeleeAttacks(15));
console.log(undeadArmy.makeRangedAttacks(14));
// console.log(undeadArmy.getAliveUndeads());
