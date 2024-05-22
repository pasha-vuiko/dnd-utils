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
  2,
  {
    common: { coefficient: 0.6 },
    magic: {
      coefficient: 0.4,
      rareness: {
        uncommon: { coefficient: 0.94 },
        rare: { coefficient: 0.05 },
        veryRare: { coefficient: 0.01 },
        legendary: { coefficient: 0.0 },
      },
    },
  },
  12,
);

console.log(
  "Loot:",
  loot.length ? loot : "No loot this time",
);
