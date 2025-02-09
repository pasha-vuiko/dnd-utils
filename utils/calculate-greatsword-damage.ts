import { getRandInt } from "./get-rand-int.ts";

function getD6DamageRolls(d6Amount) {
  return new Array(d6Amount).fill(0).map(() => getRandInt(1, 6));
}

function reroll1sAnd2sIfGreatWeaponFighting(
  damageRoll,
  isGreatWeaponFightingActive,
) {
  if (!isGreatWeaponFightingActive) {
    return damageRoll;
  }
  if (damageRoll === 1 || damageRoll === 2) {
    return getRandInt(1, 6);
  }

  return damageRoll;
}

export function calculateGreatswordDamage({
  totalBonus,
  d6Amount,
  savageAttack = false,
  greatWeaponFighting = true,
  strongGreatWeaponMasterAttack = false,
}) {
  let damageRolls;

  if (!savageAttack) {
    // calculate array of d6 damage rolls
    damageRolls = getD6DamageRolls(d6Amount);
  } else {
    // calculate 1st array of d6 damage rolls
    const damageRolls1 = getD6DamageRolls(d6Amount);
    // calculate 2nd array of d6 damage rolls
    const damageRolls2 = getD6DamageRolls(d6Amount);

    // calculate total damage for each array
    const damage1 = damageRolls1.reduce((acc, curr) => acc + curr, 0);
    const damage2 = damageRolls2.reduce((acc, curr) => acc + curr, 0);

    // compare total damage for each array of rolls and choose the array with the highest total damage
    damageRolls = damage1 > damage2 ? damageRolls1 : damageRolls2;
  }

  const damage = damageRolls
    // reroll 1s and 2s if great weapon fighting is active
    .map((damageRoll) =>
      reroll1sAnd2sIfGreatWeaponFighting(damageRoll, greatWeaponFighting),
    )
    // calculate total damage by summing up all damage rolls
    .reduce((acc, curr) => acc + curr, 0);

  let totalDamage = damage + totalBonus;

  if (strongGreatWeaponMasterAttack) {
    totalDamage += 10;
  }

  return totalDamage;
}

export function calculateFlameToungeDamage({
  totalBonus,
  physicalDamageD6Amount,
  flameDamageD6Amount,
  savageAttack = false,
  greatWeaponFighting = true,
  strongGreatWeaponMasterAttack = false,
}) {
  let physicalDamageRolls;
  let flameDamageRolls;

  if (!savageAttack) {
    // calculate couple of arrays d6 damage rolls
    physicalDamageRolls = getD6DamageRolls(physicalDamageD6Amount);
    flameDamageRolls = getD6DamageRolls(flameDamageD6Amount);
  } else {
    // calculate 1st couple of arrays d6 damage rolls
    const physicalDamageRolls1 = getD6DamageRolls(physicalDamageD6Amount);
    const flameDamageRolls1 = getD6DamageRolls(flameDamageD6Amount);

    // calculate 2nd couple of array d6 damage rolls
    const physicalDamageRolls2 = getD6DamageRolls(physicalDamageD6Amount);
    const flameDamageRolls2 = getD6DamageRolls(flameDamageD6Amount);

    // calculate total damage for each couple of arrays
    const damage1 = physicalDamageRolls1
      .concat(physicalDamageRolls2)
      .reduce((acc, curr) => acc + curr, 0);
    const damage2 = flameDamageRolls1
      .concat(flameDamageRolls2)
      .reduce((acc, curr) => acc + curr, 0);

    if (damage1 > damage2) {
      physicalDamageRolls = physicalDamageRolls1;
      flameDamageRolls = flameDamageRolls1;
    } else {
      physicalDamageRolls = physicalDamageRolls2;
      flameDamageRolls = flameDamageRolls2;
    }
  }

  const physicalDamageWithoutBonus = physicalDamageRolls
    // reroll 1s and 2s if great weapon fighting is active
    .map((damageRoll) =>
      reroll1sAnd2sIfGreatWeaponFighting(damageRoll, greatWeaponFighting),
    )
    // calculate total damage by summing up all damage rolls
    .reduce((acc, curr) => acc + curr, 0);
  const flameDamage = flameDamageRolls
    // reroll 1s and 2s if great weapon fighting is active
    .map((damageRoll) =>
      reroll1sAnd2sIfGreatWeaponFighting(damageRoll, greatWeaponFighting),
    )
    // calculate total damage by summing up all damage rolls
    .reduce((acc, curr) => acc + curr, 0);

  let physicalDamage = physicalDamageWithoutBonus + totalBonus;

  if (strongGreatWeaponMasterAttack) {
    physicalDamage += 10;
  }

  const totalDamage = physicalDamage + flameDamage;

  return { totalDamage, physicalDamage, flameDamage };
}
