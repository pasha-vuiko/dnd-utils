import { Weapon, WeaponAttackOutput } from "./weapon.entity";
import { PhysicalDamageType } from "../enums/physical-damage-type.enum";

export abstract class Unit {
  public currHealth: number;
  public isAlive = true;

  constructor(
    public name: string,
    public statBlock: StatBlock,
    protected meleeWeapon: Weapon,
    protected rangeWeapon?: Weapon,
  ) {
    this.currHealth = statBlock.maxHealth;
  }

  receiveDamage(damage: number): Unit {
    this.currHealth -= damage;

    if (this.currHealth <= 0) {
      this.isAlive = false;

      console.log(`Unit '${this.name}' is killed`);
    }

    return this;
  }

  receiveHeal(heal: number): Unit {
    this.currHealth += heal;

    return this;
  }

  increaseMaxHealthBy(healthBy: number): Unit {
    this.currHealth += healthBy;
    this.statBlock.maxHealth += healthBy;

    return this;
  }

  protected calculateModifier(characteristic: number) {
    return Math.floor((characteristic - 10) / 2);
  }

  protected makeBasicAttack(
    attackCharacteristicValue: number,
    weaponType: "melee" | "ranged",
    additionalDamageBonus = 0,
    additionalAttackBonus = 0,
  ): WeaponAttackOutput {
    const { proficiencyBonus } = this.statBlock;
    const attackModifier = this.calculateModifier(attackCharacteristicValue);

    if (weaponType === "melee") {
      return this.meleeWeapon.attack(
        proficiencyBonus,
        attackModifier,
        additionalAttackBonus,
        additionalDamageBonus,
      );
    }

    if (!this.rangeWeapon) {
      console.log(`No ranged weapon for ${this.name}`);

      return {
        attack: 0,
        rawAttackRoll: 0,
        isCritical: false,
        magicalDamage: 0,
        physicalDamage: 0,
        totalDamage: 0,
        physicalDamageType: PhysicalDamageType.Slashing,
      };
    }

    return this.rangeWeapon.attack(
      proficiencyBonus,
      attackModifier,
      additionalAttackBonus,
      additionalDamageBonus,
    );
  }

  abstract makeMeleeAttack(
    additionalDamageBonus?: number,
    additionalAttackBonus?: number,
  ): WeaponAttackOutput;
  abstract makeRangedAttack(
    additionalDamageBonus?: number,
    additionalAttackBonus?: number,
  ): WeaponAttackOutput;
}

export interface StatBlock {
  maxHealth: number;
  proficiencyBonus: number;

  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}
