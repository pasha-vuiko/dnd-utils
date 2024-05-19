import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { getRandInt } from "../get-rand-int.js";

const LOOT_FILES_DIR_PATH = path.resolve(import.meta.dirname, "assets");
const lootFilesPaths = {
  common: path.resolve(LOOT_FILES_DIR_PATH, "common.txt"),
  uncommon: path.resolve(LOOT_FILES_DIR_PATH, "uncommon.txt"),
  rare: path.resolve(LOOT_FILES_DIR_PATH, "rare.txt"),
  veryRare: path.resolve(LOOT_FILES_DIR_PATH, "rare.txt"),
  legendary: path.resolve(LOOT_FILES_DIR_PATH, "legendary.txt"),
};

const loot = {
  common: {
    coefficient: 0.6,
    items: fs
      .readFileSync(lootFilesPaths.common, "utf-8")
      .split(os.EOL)
      .filter((item) => item.trim() !== ""),
  },
  magic: {
    coefficient: 0.4,
    uncommon: {
      coefficient: 0.5,
      items: fs
        .readFileSync(lootFilesPaths.uncommon, "utf-8")
        .split(os.EOL)
        .filter((item) => item.trim() !== ""),
    },
    rare: {
      coefficient: 0.25,
      items: fs
        .readFileSync(lootFilesPaths.rare, "utf-8")
        .split(os.EOL)
        .filter((item) => item.trim() !== ""),
    },
    veryRare: {
      coefficient: 0.15,
      items: fs
        .readFileSync(lootFilesPaths.veryRare, "utf-8")
        .split(os.EOL)
        .filter((item) => item.trim() !== ""),
    },
    legendary: {
      coefficient: 0.1,
      items: fs
        .readFileSync(lootFilesPaths.legendary, "utf-8")
        .split(os.EOL)
        .filter((item) => item.trim() !== ""),
    },
  },
};

export function getRandomLoot(
  lootPoints,
  coefficients,
  successLootD20Threshold = 15,
) {
  const {
    common: { coefficient = 0.6 },
    magic: {
      coefficient: magicCoefficient = 0.4,
      rareness: {
        uncommon: { coefficient: uncommonCoefficient = 0.5 },
        rare: { coefficient: rareCoefficient = 0.25 },
        veryRare: { coefficient: veryRareCoefficient = 0.15 },
        legendary: { coefficient: legendaryCoefficient = 0.1 },
      },
    },
  } = coefficients;

  return new Array(lootPoints)
    .fill(0)
    .map(() => getRandInt(1, 20))
    .filter((roll) => roll >= successLootD20Threshold)
    .map(() => {
      const lootRoll = getRandInt(1, 100);
      const lootType = lootRoll <= magicCoefficient * 100 ? "magic" : "common";

      if (lootType === "common") {
        return {
          type: "common",
          item: loot.common.items[getRandInt(0, loot.common.items.length - 1)],
        };
      }

      const magicRoll = getRandInt(1, 100);
      const magicType =
        magicRoll <= uncommonCoefficient * 100
          ? "uncommon"
          : magicRoll <= (uncommonCoefficient + rareCoefficient) * 100
            ? "rare"
            : magicRoll <=
                (uncommonCoefficient + rareCoefficient + veryRareCoefficient) *
                  100
              ? "veryRare"
              : "legendary";

      const magicItems = loot.magic[magicType].items;

      return {
        type: magicType,
        item: magicItems[getRandInt(0, magicItems.length - 1)],
      };
    });
}
