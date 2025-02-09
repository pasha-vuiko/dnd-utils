import { DiceType } from "../enums/dice-type.enum";
import { getRandInt } from "../../utils/get-rand-int";

export function rollDice(diceType: DiceType): number {
  return getRandInt(1, diceType);
}
