import {calculateFlameToungeDamage, calculateGreatswordDamage} from "./utils/calculate-greatsword-damage.js";
import { getRandomLoot } from "./utils/loot-generator/index.js";

// console.log(
//   "damage:",
//   calculateGreatswordDamage({
//     totalBonus: 4,
//     d6Amount: 2,
//     savageAttack: true,
//     greatWeaponFighting: true,
//     strongGreatWeaponMasterAttack: false,
//   }),
// );

// console.log(
//   "Flame tounge damage:",
//   calculateFlameToungeDamage({
//     totalBonus: 4,
//     physicalDamageD6Amount: 2,
//     flameDamageD6Amount: 2,
//     savageAttack: true,
//     strongGreatWeaponMasterAttack: true,
//   }),
// );

const loot = getRandomLoot(
  10,
  {
    common: { coefficient: 0.5 },
    consumables: { coefficient: 0.2 },
    magic: {
      coefficient: 0.3,
      rareness: {
        uncommon: { coefficient: 0.4 },
        rare: { coefficient: 0.3 },
        veryRare: { coefficient: 0.2 },
        legendary: { coefficient: 0.1 },
      },
    },
  },
  15,
);

console.log(
  "Loot:",
  loot.length ? loot : "No loot this time",
);
