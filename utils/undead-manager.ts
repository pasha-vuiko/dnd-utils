import { Weapon, WeaponAttackOutput } from "../shared/entities/weapon.entity";
import { StatBlock, Unit } from "../shared/entities/unit.entity";
import { CharacteristicType } from "../shared/enums/characteristic-type.enum";
import { rollDice } from "../shared/utils/roll-dice.util";
import { DiceType } from "../shared/enums/dice-type.enum";
import { calculateModifier } from "./calculate-modifier";
import { omitObjKeys } from "../shared/utils/omit-obj-keys.util";

export class UndeadManager {
  private undeads: Unit[];
  private necromancerHealthBonus = 10;
  private necromancerDamageBonus = 4;
  private attackBonus = 0;

  constructor(input: {
    undeads: Unit[];
    necromancerHealthBonus?: number;
    necromancerDamageBonus?: number;
    attackBonus?: number;
  }) {
    this.undeads = input.undeads;
    this.necromancerHealthBonus = input.necromancerHealthBonus;
    this.necromancerDamageBonus = input.necromancerDamageBonus;
    this.attackBonus = input.attackBonus;

    for (const undead of input.undeads) {
      undead.increaseMaxHealthBy(this.necromancerHealthBonus);
    }
  }

  makeMeleeAttacks(enemyArmorClass: number): UnitsAttackOutput {
    return this.makeAttacks(enemyArmorClass, "melee");
  }

  makeRangedAttacks(enemyArmorClass: number): UnitsAttackOutput {
    return this.makeAttacks(enemyArmorClass, "ranged");
  }

  makeSavingThrows(type: CharacteristicType, limit: number): number {
    const alive = this.undeads.filter((undead) => undead.isAlive);

    let successCount = 0;

    for (const undead of alive) {
      const { statBlock } = undead;

      const d20Roll = rollDice(DiceType.d20);
      const modifier = (() => {
        if (type === CharacteristicType.Strength)
          return calculateModifier(statBlock.strength);
        if (type === CharacteristicType.Dexterity)
          return calculateModifier(statBlock.dexterity);
        if (type === CharacteristicType.Constitution)
          return calculateModifier(statBlock.constitution);
        if (type === CharacteristicType.Intelligence)
          return calculateModifier(statBlock.intelligence);
        if (type === CharacteristicType.Wisdom)
          return calculateModifier(statBlock.wisdom);
        return calculateModifier(statBlock.charisma);
      })();

      if (d20Roll + modifier >= limit) {
        successCount++;
      }
    }

    return successCount;
  }

  getAliveUndeads(): AliveUndeadsStatistics {
    const alive = this.undeads.filter((undead) => undead.isAlive);
    const dead = this.undeads.filter((undead) => !undead.isAlive);

    return {
      totalAlive: alive.length,
      totalDead: dead.length,
      alive,
      dead,
    };
  }

  private makeAttacks(
    enemyArmorClass: number,
    attackType: "melee" | "ranged",
  ): UnitsAttackOutput {
    const allAttacks: WeaponAttackWithUnitName[] = this.undeads
      .filter((undead) => undead.isAlive)
      .map((undead) => {
        const attackOutput = (() => {
          if (attackType === "melee") {
            return undead.makeMeleeAttack(
              this.necromancerDamageBonus,
              this.attackBonus,
            );
          }

          return undead.makeRangedAttack(
            this.necromancerDamageBonus,
            this.attackBonus,
          );
        })();

        return {
          ...attackOutput,
          unitName: undead.name,
        };
      });
    const successfulAttacks = allAttacks.filter(
      ({ attack }) => attack >= enemyArmorClass,
    );

    let totalDamage = 0;
    let totalPhysicalDamage = 0;
    let totalMagicalDamage = 0;

    for (const attack of successfulAttacks) {
      totalDamage += attack.totalDamage;
      totalPhysicalDamage += attack.physicalDamage;
      totalMagicalDamage += attack.magicalDamage;
    }

    return {
      totalDamage,
      totalPhysicalDamage,
      totalMagicalDamage,

      successfulAttacksCount: successfulAttacks.length,
      successfulAttacks,

      allAttacks,
    };
  }
}

export class Zombie extends Unit {
  constructor(
    name: string,
    statBlock: Partial<StatBlock>,
    meleeWeapon: Weapon,
    rangeWeapon?: Weapon,
  ) {
    const {
      maxHealth = 22,
      proficiencyBonus = 2,

      strength = 13,
      dexterity = 6,
      constitution = 16,
      intelligence = 3,
      wisdom = 6,
      charisma = 5,
    } = statBlock;

    super(
      name,
      {
        maxHealth: maxHealth,
        proficiencyBonus,

        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
      },
      meleeWeapon,
      rangeWeapon,
    );
  }

  makeMeleeAttack(
    additionalDamageBonus = 0,
    additionalAttackBonus = 0,
  ): WeaponAttackOutput {
    const { strength } = this.statBlock;

    return this.makeBasicAttack(
      strength,
      "melee",
      additionalDamageBonus,
      additionalAttackBonus,
    );
  }

  makeRangedAttack(
    additionalDamageBonus = 0,
    additionalAttackBonus = 0,
  ): WeaponAttackOutput {
    const { dexterity } = this.statBlock;

    return this.makeBasicAttack(
      dexterity,
      "ranged",
      additionalDamageBonus,
      additionalAttackBonus,
    );
  }
}

export class Skeleton extends Unit {
  constructor(
    name: string,
    statBlock: Partial<StatBlock>,
    meleeWeapon: Weapon,
    rangeWeapon?: Weapon,
  ) {
    const {
      maxHealth = 13,
      proficiencyBonus = 2,

      strength = 10,
      dexterity = 14,
      constitution = 15,
      intelligence = 6,
      wisdom = 8,
      charisma = 5,
    } = statBlock;

    super(
      name,
      {
        maxHealth: maxHealth,
        proficiencyBonus,

        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
      },
      meleeWeapon,
      rangeWeapon,
    );
  }

  makeMeleeAttack(
    additionalDamageBonus = 0,
    additionalAttackBonus = 0,
  ): WeaponAttackOutput {
    const { dexterity } = this.statBlock;

    return this.makeBasicAttack(
      dexterity,
      "melee",
      additionalDamageBonus,
      additionalAttackBonus,
    );
  }

  makeRangedAttack(
    additionalDamageBonus = 0,
    additionalAttackBonus = 0,
  ): WeaponAttackOutput {
    const { dexterity } = this.statBlock;

    return this.makeBasicAttack(
      dexterity,
      "ranged",
      additionalDamageBonus,
      additionalAttackBonus,
    );
  }
}

export class DisplayAttachResultService {
  static displayAllSuccessful(result: UnitsAttackOutput) {
    console.log(omitObjKeys(result, "allAttacks"));
  }

  static displayForArmorClassRange(
    result: UnitsAttackOutput,
    armorClassRangeStart: number,
    armorClassRangeEnd: number,
    armorClassRangeStep = 1,
    description = "",
  ) {
    const { allAttacks } = result;

    const displayResult = [];

    let currArmorClass = armorClassRangeStart;

    while (currArmorClass <= armorClassRangeEnd) {
      let totalDamage = 0;
      let totalPhysicalDamage = 0;
      let totalMagicalDamage = 0;

      const successfulAttacks = allAttacks.filter(
        (attack) => attack.attack >= currArmorClass,
      );

      for (const attack of successfulAttacks) {
        totalDamage += attack.totalDamage;
        totalPhysicalDamage += attack.physicalDamage;
        totalMagicalDamage += attack.magicalDamage;
      }

      const attackRolls = successfulAttacks.map((attack) => attack.attack);
      const rewAttackRolls = successfulAttacks.map((attack) => attack.rawAttackRoll);

      displayResult.push({
        armorClass: currArmorClass,
        successfulAttacksCount: successfulAttacks.length,
        totalDamage,
        totalPhysicalDamage,
        totalMagicalDamage,
        attackRolls: `[${attackRolls.join(", ")}]`,
        rewAttackRolls: `[${rewAttackRolls.join(", ")}]`,
      });

      currArmorClass += armorClassRangeStep;
    }

    console.log(description);
    console.table(displayResult);
  }
}

export interface UnitsAttackOutput {
  totalDamage: number;
  totalPhysicalDamage: number;
  totalMagicalDamage: number;

  successfulAttacksCount: number;
  successfulAttacks: WeaponAttackWithUnitName[];
  allAttacks: WeaponAttackWithUnitName[];
}

export interface WeaponAttackWithUnitName extends WeaponAttackOutput {
  unitName: string;
}

export interface AliveUndeadsStatistics {
  totalAlive: number;
  totalDead: number;
  alive: Unit[];
  dead: Unit[];
}
