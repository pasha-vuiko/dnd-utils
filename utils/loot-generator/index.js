import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { getRandInt } from "../get-rand-int.js";

const LOOT_FILES_DIR_PATH = path.resolve(import.meta.dirname, "assets");
const lootFilesPaths = {
  common: path.resolve(LOOT_FILES_DIR_PATH, "common.txt"),
  consumables: path.resolve(LOOT_FILES_DIR_PATH, "consumables.txt"),
  uncommon: path.resolve(LOOT_FILES_DIR_PATH, "uncommon.txt"),
  rare: path.resolve(LOOT_FILES_DIR_PATH, "rare.txt"),
  veryRare: path.resolve(LOOT_FILES_DIR_PATH, "rare.txt"),
  legendary: path.resolve(LOOT_FILES_DIR_PATH, "legendary.txt"),
  blacklisted: path.resolve(LOOT_FILES_DIR_PATH, "blacklist.txt"),
};

const loot = {
  common: {
    items: fs
      .readFileSync(lootFilesPaths.common, "utf-8")
      .split(os.EOL)
      .filter((item) => item.trim() !== "")
      .map((item) => item.trim()),
  },
  consumables: {
    items: fs
      .readFileSync(lootFilesPaths.consumables, "utf-8")
      .split(os.EOL)
      .filter((item) => item.trim() !== "")
      .map((item) => item.trim()),
  },
  magic: {
    uncommon: {
      items: fs
        .readFileSync(lootFilesPaths.uncommon, "utf-8")
        .split(os.EOL)
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim()),
    },
    rare: {
      items: fs
        .readFileSync(lootFilesPaths.rare, "utf-8")
        .split(os.EOL)
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim()),
    },
    veryRare: {
      items: fs
        .readFileSync(lootFilesPaths.veryRare, "utf-8")
        .split(os.EOL)
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim()),
    },
    legendary: {
      items: fs
        .readFileSync(lootFilesPaths.legendary, "utf-8")
        .split(os.EOL)
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim()),
    },
  },
};

const blacklistedLoot = new Set(
  fs
    .readFileSync(lootFilesPaths.blacklisted, "utf-8")
    .split(os.EOL)
    .filter((item) => item.trim() !== "")
    .map((item) => item.trim()),
);

export function getRandomLoot(
  lootPoints,
  coefficients,
  successLootD20Threshold = 15,
) {
  const {
    common: { commonCoefficient = 0.5 },
    consumables: { coefficient: consumablesCoefficient = 0.2 },
    magic: {
      coefficient: magicCoefficient = 0.3,
      rareness: {
        uncommon: { coefficient: uncommonCoefficient = 0.4 },
        rare: { coefficient: rareCoefficient = 0.3 },
        veryRare: { coefficient: veryRareCoefficient = 0.2 },
        legendary: { coefficient: legendaryCoefficient = 0.1 },
      },
    },
  } = coefficients;

  if (commonCoefficient + consumablesCoefficient + magicCoefficient > 1) {
    throw new Error(
      "The sum of common, consumables and magic coefficients must be 1",
    );
  }

  if (
    uncommonCoefficient +
      rareCoefficient +
      veryRareCoefficient +
      legendaryCoefficient >
    1
  ) {
    throw new Error(
      "The sum of uncommon, rare, very rare and legendary coefficients must be 1",
    );
  }

  const isAllItemsBlacklisted =
    loot.common.items.concat(
      Object.values(loot.magic).flatMap(({ items }) => items),
    ).length === blacklistedLoot.size;

  if (isAllItemsBlacklisted) {
    // empty the blacklist
    fs.writeFileSync(lootFilesPaths.blacklisted, "", { flag: "w" });
  }

  return (
    new Array(lootPoints)
      .fill(0)
      .map(() => getRandInt(1, 20))
      .filter((roll) => roll >= successLootD20Threshold)
      .map(() => {
        const lootRoll = getRandInt(1, 100);
        const lootType =
          lootRoll <= commonCoefficient * 100
            ? "common"
            : lootRoll <= (commonCoefficient + consumablesCoefficient) * 100
              ? "consumables"
              : "magic";

        if (lootType === "common") {
          return {
            type: "common",
            item: loot.common.items[
              getRandInt(0, loot.common.items.length - 1)
            ],
          };
        }

        if (lootType === "consumables") {
          return {
            type: "consumables",
            item: loot.consumables.items[
              getRandInt(0, loot.consumables.items.length - 1)
            ],
          };
        }

        const magicRoll = getRandInt(1, 100);
        const magicType =
          magicRoll <= uncommonCoefficient * 100
            ? "uncommon"
            : magicRoll <= (uncommonCoefficient + rareCoefficient) * 100
              ? "rare"
              : magicRoll <=
                  (uncommonCoefficient +
                    rareCoefficient +
                    veryRareCoefficient) *
                    100
                ? "veryRare"
                : "legendary";

        const magicItems = loot.magic[magicType].items;

        return {
          type: magicType,
          item: magicItems[getRandInt(0, magicItems.length - 1)],
        };
      })
      .map(({ type, item }) => {
        if (blacklistedLoot.has(item)) {
          const sameTypeMagicItems = loot.magic[type].items.filter(
            (item) => !blacklistedLoot.has(item),
          );

          const isAllBlacklisted = sameTypeMagicItems.length === 0;

          if (isAllBlacklisted) {
            return null;
          }

          const newRerolledItem =
            sameTypeMagicItems[getRandInt(0, sameTypeMagicItems.length - 1)];

          return {
            type,
            item: newRerolledItem,
          };
        }

        return { type, item };
      })
      .filter(Boolean)
      // deduplicate
      .filter(({ type, item }, index, self) => {
        return (
          index === self.findIndex((t) => t.type === type && t.item === item)
        );
      })
      .map(({ type, item }) => {
        if (item && type !== "blacklisted" && type !== "common" && type !== "consumables") {
          fs.writeFileSync(lootFilesPaths.blacklisted, `${item}${os.EOL}`, {
            flag: "a",
          });
        }

        return { type, item };
      })
  );
}
