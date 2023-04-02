import { CardUtils } from "./card";
import { CardSet, CardSetUtils } from "./card-set";
import { Rank, ranksInPowerOrder, RankUtils } from "./rank";
import { suitsInOrder } from "./suit";

/**
 * A map of entries that consists of CardSet and respective probability in a hand range.
 */
export type HandRange = Map<CardSet, number> & {
  __HandRangeBrand: never;
};

export const HandRangeUtils = Object.freeze({
  /**
   * Transforms entries into HandRange.
   */
  create(entries: Iterable<readonly [CardSet, number]>): HandRange {
    const handRange = new Map() as HandRange;

    for (const [cardSet, probability] of entries) {
      if (CardSetUtils.size(cardSet) !== 2) {
        throw new Error(
          `${CardSetUtils.format(
            cardSet
          )} isn't a card pair (two-length card set).`
        );
      }

      if (handRange.has(cardSet)) {
        throw new Error(`${CardSetUtils.format(cardSet)} is duplicated.`);
      }

      handRange.set(cardSet, probability);
    }

    return handRange;
  },

  /**
   * Parses a string and creates a HandRange.
   */
  parse(value: string): HandRange {
    const handRange = new Map<CardSet, number>() as HandRange;

    if (value.replaceAll(/\s/g, "").length === 0) {
      return handRange;
    }

    const parts = value.replaceAll(/\s/g, "").split(",");

    for (const part of parts) {
      if (
        /^[AKQJT98765432]{2}-[AKQJT98765432]{2}(:[01](\.[0-9]+)?)?$/.test(
          part
        ) &&
        part[0] === part[1] &&
        part[3] === part[4]
      ) {
        const top = RankUtils.parse(part[0]!);
        const bottom = RankUtils.parse(part[3]!);
        const probability = parseProbability(part.substring(6));

        if (probability === 0) continue;

        for (
          let i = ranksInPowerOrder.indexOf(top);
          i <= ranksInPowerOrder.indexOf(bottom);
          ++i
        ) {
          for (const cardPair of pocketCardPairs(ranksInPowerOrder[i]!)) {
            handRange.set(cardPair, probability);
          }
        }

        continue;
      }

      if (
        /^[AKQJT98765432]{2}[so]-[AKQJT98765432]{2}[so](:[01](\.[0-9]+)?)?$/.test(
          part
        ) &&
        part[0] === part[4] &&
        part[1] !== part[5] &&
        part[2] === part[6]
      ) {
        const high = RankUtils.parse(part[0]!);
        const kickerTop = RankUtils.parse(part[1]!);
        const kickerBottom = RankUtils.parse(part[5]!);
        const probability = parseProbability(part.substring(8));

        if (probability === 0) continue;

        if (
          ranksInPowerOrder.indexOf(high) <
            ranksInPowerOrder.indexOf(kickerTop) &&
          ranksInPowerOrder.indexOf(kickerTop) <
            ranksInPowerOrder.indexOf(kickerBottom)
        ) {
          for (
            let i = ranksInPowerOrder.indexOf(kickerTop);
            i <= ranksInPowerOrder.indexOf(kickerBottom);
            ++i
          ) {
            if (part[2] == "s") {
              for (const cardPair of suitedCardPairs(
                high,
                ranksInPowerOrder[i]!
              )) {
                handRange.set(cardPair, probability);
              }
            } else {
              for (const cardPair of ofsuitCardPairs(
                high,
                ranksInPowerOrder[i]!
              )) {
                handRange.set(cardPair, probability);
              }
            }
          }

          continue;
        }
      }

      if (
        /^[AKQJT98765432]{2}\+(:[01](\.[0-9]+)?)?$/.test(part) &&
        part[0] === part[1]
      ) {
        const probability = parseProbability(part.substring(4));

        if (probability === 0) continue;

        for (
          let i = 0;
          i <= ranksInPowerOrder.indexOf(RankUtils.parse(part[0]!));
          ++i
        ) {
          for (const cardPair of pocketCardPairs(ranksInPowerOrder[i]!)) {
            handRange.set(cardPair, probability);
          }
        }

        continue;
      }

      if (
        /^[AKQJT98765432]{2}[so]\+(:[01](\.[0-9]+)?)?$/.test(part) &&
        part[0] !== part[1]
      ) {
        const high = RankUtils.parse(part[0]!);
        const kicker = RankUtils.parse(part[1]!);
        const probability = parseProbability(part.substring(5));

        if (probability === 0) continue;

        for (
          let i = ranksInPowerOrder.indexOf(high) + 1;
          i <= ranksInPowerOrder.indexOf(kicker);
          ++i
        ) {
          if (part[2] == "s") {
            for (const cardPair of suitedCardPairs(
              high,
              ranksInPowerOrder[i]!
            )) {
              handRange.set(cardPair, probability);
            }
          } else {
            for (const cardPair of ofsuitCardPairs(
              high,
              ranksInPowerOrder[i]!
            )) {
              handRange.set(cardPair, probability);
            }
          }
        }

        continue;
      }

      if (
        /^[AKQJT98765432]{2}(:[01](\.[0-9]+)?)?$/.test(part) &&
        part[0] === part[1]
      ) {
        const rank = RankUtils.parse(part[0]!);
        const probability = parseProbability(part.substring(3));

        if (probability === 0) continue;

        for (const cardPair of pocketCardPairs(rank)) {
          handRange.set(cardPair, probability);
        }

        continue;
      }

      if (
        /^[AKQJT98765432]{2}[so](:[01](\.[0-9]+)?)?$/.test(part) &&
        part[0] !== part[1]
      ) {
        const high = RankUtils.parse(part[0]!);
        const kicker = RankUtils.parse(part[1]!);
        const probability = parseProbability(part.substring(4));

        if (probability === 0) continue;

        if (part[2] == "s") {
          for (const cardPair of suitedCardPairs(high, kicker)) {
            handRange.set(cardPair, probability);
          }
        } else {
          for (const cardPair of ofsuitCardPairs(high, kicker)) {
            handRange.set(cardPair, probability);
          }
        }

        continue;
      }

      if (/^([AKQJT98765432][shdc]){2}(:[01](\.[0-9]+)?)?$/.test(part)) {
        const probability = parseProbability(part.substring(5));

        if (probability === 0) continue;

        handRange.set(CardSetUtils.parse(part.substring(0, 4)), probability);

        continue;
      }

      throw new Error(
        `${part} is invalid part of hand range string expression.`
      );
    }

    return handRange;
  },

  /**
   *
   */
  rankPairs(handRange: HandRange): Map<string, number> {
    const rankPairs = new Map<string, number>();

    for (const rank of ranksInPowerOrder) {
      const probability = handRange.get(pocketCardPairs(rank)[0]!);

      if (
        probability !== undefined &&
        pocketCardPairs(rank).every((cp) => handRange.get(cp) === probability)
      ) {
        rankPairs.set(`${rank}${rank}`, probability);
      }
    }

    for (const [i, hr] of ranksInPowerOrder.entries()) {
      for (const kr of ranksInPowerOrder.slice(i + 1)) {
        const suitedProbability = handRange.get(suitedCardPairs(hr, kr)[0]!);

        if (
          suitedProbability !== undefined &&
          suitedCardPairs(hr, kr).every(
            (cp) => handRange.get(cp) === suitedProbability
          )
        ) {
          rankPairs.set(`${hr}${kr}s`, suitedProbability);
        }

        const ofsuitProbability = handRange.get(ofsuitCardPairs(hr, kr)[0]!);

        if (
          ofsuitProbability !== undefined &&
          ofsuitCardPairs(hr, kr).every(
            (cp) => handRange.get(cp) === ofsuitProbability
          )
        ) {
          rankPairs.set(`${hr}${kr}o`, ofsuitProbability);
        }
      }
    }

    return rankPairs;
  },

  /**
   *
   */
  detachedCardPairs(handRange: HandRange): Map<CardSet, number> {
    const copy = new Map(handRange);
    const rankPairs = HandRangeUtils.rankPairs(handRange);

    for (const rankPair of rankPairs.keys()) {
      if (rankPair.endsWith("s")) {
        for (const cardPair of suitedCardPairs(
          RankUtils.parse(rankPair[0]!),
          RankUtils.parse(rankPair[1]!)
        )) {
          copy.delete(cardPair);
        }

        continue;
      }

      if (rankPair.endsWith("o")) {
        for (const cardPair of ofsuitCardPairs(
          RankUtils.parse(rankPair[0]!),
          RankUtils.parse(rankPair[1]!)
        )) {
          copy.delete(cardPair);
        }

        continue;
      }

      for (const cardPair of pocketCardPairs(RankUtils.parse(rankPair[0]!))) {
        copy.delete(cardPair);
      }
    }

    return copy;
  },

  /**
   *
   * @param handRange
   * @returns
   */
  format(handRange: HandRange): string {
    const rankPairs = HandRangeUtils.rankPairs(handRange);
    const detachedCardPairs = HandRangeUtils.detachedCardPairs(handRange);
    const parts = new Map<string, number>();

    let pocketStartRank: Rank | null = null;

    for (const [i, rank] of ranksInPowerOrder.entries()) {
      const prob = rankPairs.get(`${rank}${rank}`) ?? null;

      if (pocketStartRank !== null) {
        const startProb = rankPairs.get(
          `${pocketStartRank}${pocketStartRank}`
        )!;

        if (prob !== startProb) {
          const prevRank = ranksInPowerOrder[i - 1]!;

          if (
            pocketStartRank === ranksInPowerOrder[0] &&
            prevRank !== ranksInPowerOrder[0]
          ) {
            parts.set(`${prevRank}${prevRank}+`, startProb);
          } else if (pocketStartRank === prevRank) {
            parts.set(`${prevRank}${prevRank}`, startProb);
          } else {
            parts.set(
              `${pocketStartRank}${pocketStartRank}-${prevRank}${prevRank}`,
              startProb
            );
          }

          pocketStartRank = null;
        }
      }

      if (pocketStartRank === null && prob !== null) {
        pocketStartRank = rank;
      }
    }

    if (pocketStartRank !== null) {
      const lastRank = ranksInPowerOrder[ranksInPowerOrder.length - 1]!;
      const prob = rankPairs.get(`${pocketStartRank}${pocketStartRank}`)!;

      if (pocketStartRank === ranksInPowerOrder[0]) {
        parts.set(`${lastRank}${lastRank}+`, prob);
      } else if (pocketStartRank === lastRank) {
        parts.set(`${pocketStartRank}${pocketStartRank}`, prob);
      } else {
        parts.set(
          `${pocketStartRank}${pocketStartRank}-${lastRank}${lastRank}`,
          prob
        );
      }
    }

    for (const [hi, highRank] of ranksInPowerOrder.entries()) {
      const firstRank =
        ranksInPowerOrder[Math.min(hi + 1, ranksInPowerOrder.length - 1)];

      let suitedStartRank: Rank | null = null;

      for (const [ki, rank] of ranksInPowerOrder.entries()) {
        if (ki < hi + 1) continue;

        const prob = rankPairs.get(`${highRank}${rank}s`) ?? null;

        if (suitedStartRank !== null) {
          const startProb = rankPairs.get(`${highRank}${suitedStartRank}s`)!;

          if (prob !== startProb) {
            const prevRank = ranksInPowerOrder[ki - 1]!;

            if (suitedStartRank === firstRank && prevRank !== firstRank) {
              parts.set(`${highRank}${prevRank}s+`, startProb);
            } else if (suitedStartRank === prevRank) {
              parts.set(`${highRank}${prevRank}s`, startProb);
            } else {
              parts.set(
                `${highRank}${suitedStartRank}s-${highRank}${prevRank}s`,
                startProb
              );
            }

            suitedStartRank = null;
          }
        }

        if (suitedStartRank === null && prob !== null) {
          suitedStartRank = rank;
        }
      }

      if (suitedStartRank !== null) {
        const prob = rankPairs.get(`${highRank}${suitedStartRank}s`)!;
        const lastRank = ranksInPowerOrder[ranksInPowerOrder.length - 1]!;

        if (suitedStartRank === firstRank && lastRank !== firstRank) {
          parts.set(`${highRank}${lastRank}s+`, prob);
        } else if (suitedStartRank === lastRank) {
          parts.set(`${highRank}${suitedStartRank}s`, prob);
        } else {
          parts.set(
            `${highRank}${suitedStartRank}s-${highRank}${lastRank}s`,
            prob
          );
        }
      }

      let ofsuitStartRank: Rank | null = null;

      for (const [ki, rank] of ranksInPowerOrder.entries()) {
        if (ki < hi + 1) continue;

        const prob = rankPairs.get(`${highRank}${rank}o`) ?? null;

        if (ofsuitStartRank !== null) {
          const startProb = rankPairs.get(`${highRank}${ofsuitStartRank}o`)!;

          if (prob !== startProb) {
            const prevRank = ranksInPowerOrder[ki - 1]!;

            if (ofsuitStartRank === firstRank && prevRank !== firstRank) {
              parts.set(`${highRank}${prevRank}o+`, startProb);
            } else if (ofsuitStartRank === prevRank) {
              parts.set(`${highRank}${prevRank}o`, startProb);
            } else {
              parts.set(
                `${highRank}${ofsuitStartRank}o-${highRank}${prevRank}o`,
                startProb
              );
            }

            ofsuitStartRank = null;
          }
        }

        if (ofsuitStartRank === null && prob !== null) {
          ofsuitStartRank = rank;
        }
      }

      if (ofsuitStartRank !== null) {
        const prob = rankPairs.get(`${highRank}${ofsuitStartRank}o`)!;
        const lastRank = ranksInPowerOrder[ranksInPowerOrder.length - 1]!;

        if (ofsuitStartRank === firstRank && lastRank !== firstRank) {
          parts.set(`${highRank}${lastRank}o+`, prob);
        } else if (ofsuitStartRank === lastRank) {
          parts.set(`${highRank}${ofsuitStartRank}o`, prob);
        } else {
          parts.set(
            `${highRank}${ofsuitStartRank}o-${highRank}${lastRank}o`,
            prob
          );
        }
      }
    }

    for (const [i, hr] of ranksInPowerOrder.entries()) {
      for (const kr of ranksInPowerOrder.slice(i)) {
        for (const hs of suitsInOrder) {
          for (const ks of suitsInOrder) {
            const pairA = CardSetUtils.from([
              CardUtils.create(hr, hs),
              CardUtils.create(kr, ks),
            ]);
            const probA = detachedCardPairs.get(pairA) ?? null;

            if (probA !== null) {
              parts.set(
                `${CardSetUtils.format(pairA, {
                  sortInPower: true,
                })}`,
                probA
              );
            }
          }
        }
      }
    }

    return Array.from(
      parts.entries(),
      ([part, prob]) => `${part}:${formatProbability(prob)}`
    ).join(",");
  },

  toCardSetEnumeration(handRange: HandRange, base: number): CardSet[] {
    const cardSetEnumeration = [];

    for (const [cardSet, probability] of handRange) {
      for (let i = 0; i < Math.round(probability * base); ++i) {
        cardSetEnumeration.push(cardSet);
      }
    }

    return cardSetEnumeration;
  },
});

function pocketCardPairs(rank: Rank): CardSet[] {
  return [
    CardSetUtils.from([
      CardUtils.create(rank, "s"),
      CardUtils.create(rank, "h"),
    ]),
    CardSetUtils.from([
      CardUtils.create(rank, "s"),
      CardUtils.create(rank, "d"),
    ]),
    CardSetUtils.from([
      CardUtils.create(rank, "s"),
      CardUtils.create(rank, "c"),
    ]),
    CardSetUtils.from([
      CardUtils.create(rank, "h"),
      CardUtils.create(rank, "d"),
    ]),
    CardSetUtils.from([
      CardUtils.create(rank, "h"),
      CardUtils.create(rank, "c"),
    ]),
    CardSetUtils.from([
      CardUtils.create(rank, "d"),
      CardUtils.create(rank, "c"),
    ]),
  ];
}

function suitedCardPairs(high: Rank, kicker: Rank): CardSet[] {
  return [
    CardSetUtils.from([
      CardUtils.create(high, "s"),
      CardUtils.create(kicker, "s"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "h"),
      CardUtils.create(kicker, "h"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "d"),
      CardUtils.create(kicker, "d"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "c"),
      CardUtils.create(kicker, "c"),
    ]),
  ];
}

function ofsuitCardPairs(high: Rank, kicker: Rank): CardSet[] {
  return [
    CardSetUtils.from([
      CardUtils.create(high, "s"),
      CardUtils.create(kicker, "h"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "s"),
      CardUtils.create(kicker, "d"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "s"),
      CardUtils.create(kicker, "c"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "h"),
      CardUtils.create(kicker, "s"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "h"),
      CardUtils.create(kicker, "d"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "h"),
      CardUtils.create(kicker, "c"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "d"),
      CardUtils.create(kicker, "s"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "d"),
      CardUtils.create(kicker, "h"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "d"),
      CardUtils.create(kicker, "c"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "c"),
      CardUtils.create(kicker, "s"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "c"),
      CardUtils.create(kicker, "h"),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, "c"),
      CardUtils.create(kicker, "d"),
    ]),
  ];
}

function parseProbability(probabilityString: string): number {
  const inFloat = parseFloat(
    probabilityString.trim().length === 0 ? "1" : probabilityString
  );

  if (inFloat > 1 || inFloat < 0) {
    throw new Error();
  }

  return inFloat;
}

function formatProbability(probability: number): string {
  if (probability % 1 === 0) return `${probability}`;

  const fixed = probability.toFixed(3);

  if (/\.[1-9]*0+$/.test(fixed)) {
    return fixed.replace(/0+$/, "");
  }

  return fixed;
}
