import { CardUtils } from "./card";
import { CardSet, CardSetUtils } from "./card-set";
import { Rank, RankUtils } from "./rank";
import { Suit } from "./suit";

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

        for (let i = ranks.indexOf(top); i <= ranks.indexOf(bottom); ++i) {
          for (const cardPair of pocketCardPairs(ranks[i]!)) {
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
          ranks.indexOf(high) < ranks.indexOf(kickerTop) &&
          ranks.indexOf(kickerTop) < ranks.indexOf(kickerBottom)
        ) {
          for (
            let i = ranks.indexOf(kickerTop);
            i <= ranks.indexOf(kickerBottom);
            ++i
          ) {
            if (part[2] == "s") {
              for (const cardPair of suitedCardPairs(high, ranks[i]!)) {
                handRange.set(cardPair, probability);
              }
            } else {
              for (const cardPair of ofsuitCardPairs(high, ranks[i]!)) {
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

        for (let i = 0; i <= ranks.indexOf(RankUtils.parse(part[0]!)); ++i) {
          for (const cardPair of pocketCardPairs(ranks[i]!)) {
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
        const probability = parseProbability(part.substring(4));

        if (probability === 0) continue;

        for (let i = ranks.indexOf(high) + 1; i <= ranks.indexOf(kicker); ++i) {
          if (part[2] == "s") {
            for (const cardPair of suitedCardPairs(high, ranks[i]!)) {
              handRange.set(cardPair, probability);
            }
          } else {
            for (const cardPair of ofsuitCardPairs(high, ranks[i]!)) {
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

    for (const rank of ranks) {
      const probability = handRange.get(pocketCardPairs(rank)[0]!);

      if (
        probability !== undefined &&
        pocketCardPairs(rank).every((cp) => handRange.get(cp) === probability)
      ) {
        rankPairs.set(
          `${RankUtils.format(rank)}${RankUtils.format(rank)}`,
          probability
        );
      }
    }

    for (const [i, hr] of ranks.entries()) {
      for (const kr of ranks.slice(i + 1)) {
        const suitedProbability = handRange.get(suitedCardPairs(hr, kr)[0]!);

        if (
          suitedProbability !== undefined &&
          suitedCardPairs(hr, kr).every(
            (cp) => handRange.get(cp) === suitedProbability
          )
        ) {
          rankPairs.set(
            `${RankUtils.format(hr)}${RankUtils.format(kr)}s`,
            suitedProbability
          );
        }

        const ofsuitProbability = handRange.get(ofsuitCardPairs(hr, kr)[0]!);

        if (
          ofsuitProbability !== undefined &&
          ofsuitCardPairs(hr, kr).every(
            (cp) => handRange.get(cp) !== ofsuitProbability
          )
        ) {
          rankPairs.set(
            `${RankUtils.format(hr)}${RankUtils.format(kr)}o`,
            ofsuitProbability
          );
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

    // let result = "";
    //
    // let start = -1;
    // for (let i = 0; i < ranks.length; ++i) {
    //   if (
    //     pocketParts.has(
    //       `${RankUtils.toString(ranks[i]!)}${RankUtils.toString(ranks[i]!)}`
    //     )
    //   ) {
    //     if (start === -1) {
    //       start = i;
    //     }
    //   }

    //   if (
    //     start !== -1 &&
    //     (i === ranks.length - 1 ||
    //       !pocketParts.has(
    //         `${RankUtils.toString(ranks[i + 1]!)}${RankUtils.toString(
    //           ranks[i + 1]!
    //         )}`
    //       ))
    //   ) {
    //     if (start === i) {
    //       result += `${RankUtils.toString(ranks[i]!).repeat(2)}`;
    //     } else if (start === 0) {
    //       result += `${RankUtils.toString(ranks[i]!).repeat(2)}+`;
    //     } else {
    //       result += `${RankUtils.toString(ranks[start]!).repeat(
    //         2
    //       )}-${RankUtils.toString(ranks[i]!).repeat(2)}`;
    //     }

    //     start = -1;
    //   }
    // }

    // for (let h = 0; h < ranks.length - 1; ++h) {
    //   let suitedStart = -1;
    //   let ofsuitStart = -1;

    //   for (let k = h + 1; k < ranks.length; ++k) {
    //     if (
    //       suitedParts.has(
    //         `${RankUtils.toString(ranks[h]!)}${RankUtils.toString(ranks[k]!)}s`
    //       )
    //     ) {
    //       if (suitedStart === -1) {
    //         suitedStart = k;
    //       }
    //     }

    //     if (
    //       suitedStart !== -1 &&
    //       (k === ranks.length - 1 ||
    //         !suitedParts.has(
    //           `${RankUtils.toString(ranks[h]!)}${RankUtils.toString(
    //             ranks[k + 1]!
    //           )}s`
    //         ))
    //     ) {
    //       if (suitedStart === k) {
    //         result += `${RankUtils.toString(ranks[h]!)}${RankUtils.toString(
    //           ranks[k]!
    //         )}s`;
    //       } else if (suitedStart === h + 1) {
    //         result += `${RankUtils.toString(ranks[h]!)}${RankUtils.toString(
    //           ranks[k]!
    //         )}s+`;
    //       } else {
    //         result += `${RankUtils.toString(ranks[h]!)}${RankUtils.toString(
    //           ranks[suitedStart]!
    //         )}s-${RankUtils.toString(ranks[h]!)}${RankUtils.toString(
    //           ranks[k]!
    //         )}s`;
    //       }

    //       suitedStart = -1;
    //     }
    //   }

    //   for (let k = h + 1; k < ranks.length; ++k) {
    //     if (
    //       ofsuitParts.has(
    //         `${RankUtils.toString(ranks[h]!)}${RankUtils.toString(ranks[k]!)}o`
    //       )
    //     ) {
    //       if (ofsuitStart === -1) {
    //         ofsuitStart = k;
    //       }
    //     }

    //     if (
    //       ofsuitStart !== -1 &&
    //       (k === ranks.length - 1 ||
    //         !ofsuitParts.has(
    //           `${RankUtils.toString(ranks[h]!)}${RankUtils.toString(
    //             ranks[k + 1]!
    //           )}o`
    //         ))
    //     ) {
    //       if (ofsuitStart === k) {
    //         result += `${RankUtils.toString(ranks[h]!)}${RankUtils.toString(
    //           ranks[k]!
    //         )}o`;
    //       } else if (ofsuitStart === h + 1) {
    //         result += `${RankUtils.toString(ranks[h]!)}${RankUtils.toString(
    //           ranks[k]!
    //         )}o+`;
    //       } else {
    //         result += `${RankUtils.toString(ranks[h]!)}${RankUtils.toString(
    //           ranks[ofsuitStart]!
    //         )}o-${RankUtils.toString(ranks[h]!)}${RankUtils.toString(
    //           ranks[k]!
    //         )}o`;
    //       }

    //       ofsuitStart = -1;
    //     }
    //   }
    // }

    // for (const part of individualParts) {
    //   result += part;
    // }

    let stringParts = [];

    for (const [rankPair, probability] of rankPairs.entries()) {
      stringParts.push(`${rankPair}:${formatProbability(probability)}`);
    }

    for (const [cardPair, probability] of detachedCardPairs.entries()) {
      stringParts.push(
        `${CardSetUtils.format(cardPair)}:${formatProbability(probability)}`
      );
    }

    return stringParts.join(",");
  },

  /**
   *
   */
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

const ranks = [
  Rank.Ace,
  Rank.King,
  Rank.Queen,
  Rank.Jack,
  Rank.Ten,
  Rank.Nine,
  Rank.Eight,
  Rank.Seven,
  Rank.Six,
  Rank.Five,
  Rank.Four,
  Rank.Trey,
  Rank.Deuce,
];

function pocketCardPairs(rank: Rank): CardSet[] {
  return [
    CardSetUtils.from([
      CardUtils.create(rank, Suit.Spade),
      CardUtils.create(rank, Suit.Heart),
    ]),
    CardSetUtils.from([
      CardUtils.create(rank, Suit.Spade),
      CardUtils.create(rank, Suit.Diamond),
    ]),
    CardSetUtils.from([
      CardUtils.create(rank, Suit.Spade),
      CardUtils.create(rank, Suit.Club),
    ]),
    CardSetUtils.from([
      CardUtils.create(rank, Suit.Heart),
      CardUtils.create(rank, Suit.Diamond),
    ]),
    CardSetUtils.from([
      CardUtils.create(rank, Suit.Heart),
      CardUtils.create(rank, Suit.Club),
    ]),
    CardSetUtils.from([
      CardUtils.create(rank, Suit.Diamond),
      CardUtils.create(rank, Suit.Club),
    ]),
  ];
}

function suitedCardPairs(high: Rank, kicker: Rank): CardSet[] {
  return [
    CardSetUtils.from([
      CardUtils.create(high, Suit.Spade),
      CardUtils.create(kicker, Suit.Spade),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Heart),
      CardUtils.create(kicker, Suit.Heart),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Diamond),
      CardUtils.create(kicker, Suit.Diamond),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Club),
      CardUtils.create(kicker, Suit.Club),
    ]),
  ];
}

function ofsuitCardPairs(high: Rank, kicker: Rank): CardSet[] {
  return [
    CardSetUtils.from([
      CardUtils.create(high, Suit.Spade),
      CardUtils.create(kicker, Suit.Heart),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Spade),
      CardUtils.create(kicker, Suit.Diamond),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Spade),
      CardUtils.create(kicker, Suit.Club),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Heart),
      CardUtils.create(kicker, Suit.Spade),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Heart),
      CardUtils.create(kicker, Suit.Diamond),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Heart),
      CardUtils.create(kicker, Suit.Club),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Diamond),
      CardUtils.create(kicker, Suit.Spade),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Diamond),
      CardUtils.create(kicker, Suit.Heart),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Diamond),
      CardUtils.create(kicker, Suit.Club),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Club),
      CardUtils.create(kicker, Suit.Spade),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Club),
      CardUtils.create(kicker, Suit.Heart),
    ]),
    CardSetUtils.from([
      CardUtils.create(high, Suit.Club),
      CardUtils.create(kicker, Suit.Diamond),
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

  return probability.toFixed(2);
}
