import { rollDice } from "../utils/roll-dice.util";
import { DiceType } from "../enums/dice-type.enum";
import { PhysicalDamageType } from "../enums/physical-damage-type.enum";
import { MagicalDamageType } from "../enums/magical-damage-type.enum";

export class Weapon {
  constructor(private params: WeaponParams) {}

  attack(
    proficiencyBonus: number,
    abilityModifierBonus: number,
    characterAttackBonus = 0,
    characterDamageBonus = 0,
    magicDamageBonus = 0,
  ): WeaponAttackOutput {
    const {
      physicalDiceCount,
      physicalDiceType,
      physicalDamageType,
      magicalDiceCount = 0,
      magicalDiceType,
      magicalDamageType,
    } = this.params;
    const weaponAttackBonus = this.params.attackBonus;
    const weaponDamageBonus = this.params.damageBonus;

    const attackRoll = rollDice(DiceType.d20);

    const attack =
      attackRoll +
      proficiencyBonus +
      abilityModifierBonus +
      weaponAttackBonus +
      characterAttackBonus;

    let physicalDamage = 0;
    for (let i = 0; i < physicalDiceCount; i++) {
      physicalDamage += rollDice(physicalDiceType);
    }
    physicalDamage += characterDamageBonus + weaponDamageBonus;

    let magicalDamage = 0;

    if (magicalDiceCount) {
      for (let i = 0; i < magicalDiceCount; i++) {
        magicalDamage += rollDice(magicalDiceType);
      }
    }

    // if critical
    const isCritical = attackRoll === 20;

    if (isCritical) {
      physicalDamage += this.getPhysicalMaxDamage(characterDamageBonus);

      if (magicalDiceCount) {
        magicalDamage += this.getMagicalMaxDamage(magicDamageBonus);
      }
    }

    return {
      attack,
      rawAttackRoll: attackRoll,
      isCritical,

      physicalDamage,
      physicalDamageType,

      magicalDamage,
      magicalDamageType,

      totalDamage: physicalDamage + magicalDamage,
    };
  }

  clone(): Weapon {
    const { params } = this;

    return new Weapon({ ...params });
  }

  private getPhysicalMaxDamage(characterDamageBonus = 0): number {
    const weaponDamageBonus = this.params.damageBonus;
    const { physicalDiceCount, physicalDiceType } = this.params;

    return (
      physicalDiceCount * physicalDiceType +
      characterDamageBonus +
      weaponDamageBonus
    );
  }

  private getMagicalMaxDamage(magicDamageBonus = 0): number {
    const { magicalDiceCount, magicalDiceType } = this.params;

    return magicalDiceCount * magicalDiceType + magicDamageBonus;
  }
}

export interface WeaponParams {
  name: string;

  physicalDamageType: PhysicalDamageType;
  physicalDiceCount: number;
  physicalDiceType: DiceType;

  magicalDamageType?: MagicalDamageType;
  magicalDiceCount?: number;
  magicalDiceType?: DiceType;

  attackBonus: number;
  damageBonus: number;
}

export interface WeaponAttackOutput {
  rawAttackRoll: number;
  isCritical: boolean;
  attack: number;

  physicalDamage: number;
  physicalDamageType: PhysicalDamageType;

  magicalDamage: number;
  magicalDamageType?: MagicalDamageType;

  totalDamage: number;
}
