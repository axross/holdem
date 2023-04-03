import { Card } from "./card";
import { CardSet } from "./card-set";
import { Rank } from "./rank";
import { Suit } from "./suit";

/**
 * An immutable map class that represents a set of CardPair(s) and their existance probability.
 *
 * As HandRange is iterable of `[CardSet, number]`, you can use this in for loop.
 *
 * @example
 * ```ts
 * for (const [cardSet, probability] of HandRange.parse("88-66")) {
 *   // ...
 * }
 * ```
 */
export class HandRange implements Iterable<readonly [CardSet, number]> {
  /**
   * Returns an empty HandRange.
   *
   * @example
   * ```ts
   * const handRange = HandRange.empty();
   * ```
   */
  static empty() {
    return new HandRange(new Map());
  }

  /**
   * Parses a string and returns a HandRange.
   *
   * The parameter string needs to be comma-separated parts. Each parts should be `<hand>:<probability>` where `<hand>` is the following specifiers and `<probability>` is float.
   *
   * - `AsKc` - specific pair of cards.
   * - `66` - all pocket pair combinations of six.
   * - `AKs` - all suited pair combinations of ace and king.
   * - `T9o` - all ofsuit pair combinations of ten and nine.
   * - `JJ-99` - all pocket combinations of `JJ`, `TT` and `99`.
   * - `86s-84s` - all suited combinations of `86s`, `85s` and `84s`.
   * - `AJo-A9o` - all ofsuite combinations of `AJo`, `ATo` and `A9o`.
   * - `JJ+` - equivalent to `AA-JJ`.
   * - `85s+` - equivalent to `87s-85s`.
   * - `AQo+` - equivalent to `AKo-AQo`.
   *
   * The probability can be omitted. `AsKs` works as same as `AsKs:1`.
   *
   * @example
   * ```ts
   * const handRange = HandRange.parse("88-66:0.66,JJ+:0.5,44,AQs-A9s:0.2");
   * ```
   */
  static parse(value: string): HandRange {
    const map = new Map<CardSet, number>();

    if (value.replaceAll(/\s/g, "").length === 0) {
      return HandRange.from(map);
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
        const top = Rank.parse(part[0]!);
        const bottom = Rank.parse(part[3]!);
        const probability = parseProbability(part.substring(6));

        if (probability === 0) continue;

        for (
          let i = ranksInPowerOrder.indexOf(top);
          i <= ranksInPowerOrder.indexOf(bottom);
          ++i
        ) {
          for (const cardPair of pocketCardPairs(ranksInPowerOrder[i]!)) {
            map.set(cardPair, probability);
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
        const high = Rank.parse(part[0]!);
        const kickerTop = Rank.parse(part[1]!);
        const kickerBottom = Rank.parse(part[5]!);
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
                map.set(cardPair, probability);
              }
            } else {
              for (const cardPair of ofsuitCardPairs(
                high,
                ranksInPowerOrder[i]!
              )) {
                map.set(cardPair, probability);
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
          i <= ranksInPowerOrder.indexOf(Rank.parse(part[0]!));
          ++i
        ) {
          for (const cardPair of pocketCardPairs(ranksInPowerOrder[i]!)) {
            map.set(cardPair, probability);
          }
        }

        continue;
      }

      if (
        /^[AKQJT98765432]{2}[so]\+(:[01](\.[0-9]+)?)?$/.test(part) &&
        part[0] !== part[1]
      ) {
        const high = Rank.parse(part[0]!);
        const kicker = Rank.parse(part[1]!);
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
              map.set(cardPair, probability);
            }
          } else {
            for (const cardPair of ofsuitCardPairs(
              high,
              ranksInPowerOrder[i]!
            )) {
              map.set(cardPair, probability);
            }
          }
        }

        continue;
      }

      if (
        /^[AKQJT98765432]{2}(:[01](\.[0-9]+)?)?$/.test(part) &&
        part[0] === part[1]
      ) {
        const rank = Rank.parse(part[0]!);
        const probability = parseProbability(part.substring(3));

        if (probability === 0) continue;

        for (const cardPair of pocketCardPairs(rank)) {
          map.set(cardPair, probability);
        }

        continue;
      }

      if (
        /^[AKQJT98765432]{2}[so](:[01](\.[0-9]+)?)?$/.test(part) &&
        part[0] !== part[1]
      ) {
        const high = Rank.parse(part[0]!);
        const kicker = Rank.parse(part[1]!);
        const probability = parseProbability(part.substring(4));

        if (probability === 0) continue;

        if (part[2] == "s") {
          for (const cardPair of suitedCardPairs(high, kicker)) {
            map.set(cardPair, probability);
          }
        } else {
          for (const cardPair of ofsuitCardPairs(high, kicker)) {
            map.set(cardPair, probability);
          }
        }

        continue;
      }

      if (/^([AKQJT98765432][shdc]){2}(:[01](\.[0-9]+)?)?$/.test(part)) {
        const probability = parseProbability(part.substring(5));

        if (probability === 0) continue;

        map.set(CardSet.parse(part.substring(0, 4)), probability);

        continue;
      }

      throw new Error(
        `${part} is invalid part of hand range string expression.`
      );
    }

    return HandRange.from(map);
  }

  /**
   * Returns a HandRange that contains all the given entries of CardSet and its existance probability.
   *
   * @example
   * ```ts
   * const handRange = HandRange.from([
   *   CardSet.parse("AsKs"),
   *   CardSet.parse("8h8d"),
   *   CardSet.parse("6s5s"),
   * ]);
   * ```
   */
  static from(entries: Iterable<readonly [CardSet, number]>): HandRange {
    const handRange = new Map<number, number>();

    for (const [cardSet, probability] of entries) {
      if (cardSet.size !== 2) {
        throw new Error(
          `${cardSet.format()} isn't a card pair (two-length card set).`
        );
      }

      if (!handRange.has(cardSet.intValue)) {
        handRange.set(cardSet.intValue, probability);
      }
    }

    return new HandRange(handRange);
  }

  private constructor(map: Map<number, number>) {
    // const sorted = Array.from(map.entries());

    // sorted.sort(([aInt], [bInt]) => {
    //   const a = new CardSet(aInt);
    //   const b = new CardSet(bInt);
    //   const isAPocket = a.at(0)?.rank === a.at(1)?.rank;
    //   const isBPocket = b.at(0)?.rank === b.at(1)?.rank;

    //   if (isAPocket && isBPocket) {

    //   }
    // })

    this.map = new Map(map);
  }

  private readonly map: Map<number, number>;

  private memoizedRankPairs: Map<string, number> | null = null;

  /**
   * Returns number of entries in the HandRange.
   *
   * @example
   * ```ts
   * const handRange = HandRange.parse("88-66");
   *
   * handRange.size;  // => 18
   * ```
   */
  size(): number {
    return this.map.size;
  }

  /**
   * Returns probability for the given CardSet.
   *
   * @example
   * ```ts
   * const handRange = HandRange.parse("88:1,77:0.5,66:0.25");
   * const probability = handRange.get(CardSet.parse("7s7d"));
   * ```
   */
  get(cardSet: CardSet): number | null {
    return this.map.get(cardSet.intValue) ?? null;
  }

  /**
   * Returns an union of the HandRange and the given one.
   *
   * @example
   * ```ts
   * const handRange = HandRange.parse("88-66");
   * const ninesAdded = handRange.added(HandRange.parse("99"));
   * ```
   */
  added(other: HandRange): HandRange {
    const added = new Map(this.map);

    for (const [cardSetint, probability] of other.map) {
      added.set(cardSetint, probability);
    }

    return new HandRange(added);
  }

  /**
   * Returns a new HandRange that the given hand range removed.
   *
   * @example
   * ```ts
   * const handRange = HandRange.parse("88-66");
   * const sevensRemoved = handRange.removed(HandRange.parse("77"));
   * ```
   */
  removed(other: HandRange): HandRange {
    const removed = new Map(this.map);

    for (const cardSetInt of other.map.keys()) {
      removed.delete(cardSetInt);
    }

    return new HandRange(removed);
  }

  /**
   * Returns a map of rank pair string and its probability. Map key is string representation of rank pair such as `AsKh`. Detatched card pairs are ignored.
   *
   * @example
   * ```ts
   * const handRange = HandRange.parse("AKs:0.5");
   * const onlyRankPairs = handRange.onlyRankPairs();
   *
   * onlyRankPairs.entries();  // => Iterable of ["AsKs", 0.5], ["AhKh", 0.5], ...
   * ```
   */
  onlyRankPairs(): Map<string, number> {
    if (this.memoizedRankPairs === null) {
      const rankPairs = new Map<string, number>();

      for (const rank of ranksInPowerOrder) {
        const probability = this.map.get(pocketCardPairs(rank)[0]!.intValue);

        if (
          probability !== undefined &&
          pocketCardPairs(rank).every(
            (cp) => this.map.get(cp.intValue) === probability
          )
        ) {
          rankPairs.set(`${rank.format()}${rank.format()}`, probability);
        }
      }

      for (const [i, hr] of ranksInPowerOrder.entries()) {
        for (const kr of ranksInPowerOrder.slice(i + 1)) {
          const suitedProbability = this.map.get(
            suitedCardPairs(hr, kr)[0]!.intValue
          );

          if (
            suitedProbability !== undefined &&
            suitedCardPairs(hr, kr).every(
              (cp) => this.map.get(cp.intValue) === suitedProbability
            )
          ) {
            rankPairs.set(`${hr.format()}${kr.format()}s`, suitedProbability);
          }

          const ofsuitProbability = this.map.get(
            ofsuitCardPairs(hr, kr)[0]!.intValue
          );

          if (
            ofsuitProbability !== undefined &&
            ofsuitCardPairs(hr, kr).every(
              (cp) => this.map.get(cp.intValue) === ofsuitProbability
            )
          ) {
            rankPairs.set(`${hr.format()}${kr.format()}o`, ofsuitProbability);
          }
        }
      }

      this.memoizedRankPairs = rankPairs;
    }

    return this.memoizedRankPairs;
  }

  private detachedCardPairs(): Map<number, number> {
    const copy = new Map(this.map);
    const onlyRankPairs = this.onlyRankPairs();

    for (const rankPair of onlyRankPairs.keys()) {
      if (rankPair.endsWith("s")) {
        for (const cardPair of suitedCardPairs(
          Rank.parse(rankPair[0]!),
          Rank.parse(rankPair[1]!)
        )) {
          copy.delete(cardPair.intValue);
        }

        continue;
      }

      if (rankPair.endsWith("o")) {
        for (const cardPair of ofsuitCardPairs(
          Rank.parse(rankPair[0]!),
          Rank.parse(rankPair[1]!)
        )) {
          copy.delete(cardPair.intValue);
        }

        continue;
      }

      for (const cardPair of pocketCardPairs(Rank.parse(rankPair[0]!))) {
        copy.delete(cardPair.intValue);
      }
    }

    return copy;
  }

  /**
   * Returns formatted string representation of the HandRange. Each card pairs will be merged and grouped into rank pairs.
   *
   * @example
   * ```ts
   * const handRange = HandRange.parse("AsKs:1,AhKh:1,AdKd:1,AcKc:1");
   *
   * handRange.format();  // => "AKs:1"
   * ```
   */
  format(): string {
    const onlyRankPairs = this.onlyRankPairs();
    const detachedCardPairs = this.detachedCardPairs();
    const parts = new Map<string, number>();

    let pocketStartRank: Rank | null = null;

    for (const [i, rank] of ranksInPowerOrder.entries()) {
      const prob =
        onlyRankPairs.get(`${rank.format()}${rank.format()}`) ?? null;

      if (pocketStartRank !== null) {
        const startProb = onlyRankPairs.get(
          `${pocketStartRank.format()}${pocketStartRank.format()}`
        )!;

        if (prob !== startProb) {
          const prevRank = ranksInPowerOrder[i - 1]!;

          if (
            pocketStartRank === ranksInPowerOrder[0] &&
            prevRank !== ranksInPowerOrder[0]
          ) {
            parts.set(`${prevRank.format()}${prevRank.format()}+`, startProb);
          } else if (pocketStartRank === prevRank) {
            parts.set(`${prevRank.format()}${prevRank.format()}`, startProb);
          } else {
            parts.set(
              `${pocketStartRank.format()}${pocketStartRank.format()}-${prevRank.format()}${prevRank.format()}`,
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
      const prob = onlyRankPairs.get(
        `${pocketStartRank.format()}${pocketStartRank.format()}`
      )!;

      if (pocketStartRank === ranksInPowerOrder[0]) {
        parts.set(`${lastRank.format()}${lastRank.format()}+`, prob);
      } else if (pocketStartRank === lastRank) {
        parts.set(
          `${pocketStartRank.format()}${pocketStartRank.format()}`,
          prob
        );
      } else {
        parts.set(
          `${pocketStartRank.format()}${pocketStartRank.format()}-${lastRank.format()}${lastRank.format()}`,
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

        const prob =
          onlyRankPairs.get(`${highRank.format()}${rank.format()}s`) ?? null;

        if (suitedStartRank !== null) {
          const startProb = onlyRankPairs.get(
            `${highRank.format()}${suitedStartRank.format()}s`
          )!;

          if (prob !== startProb) {
            const prevRank = ranksInPowerOrder[ki - 1]!;

            if (suitedStartRank === firstRank && prevRank !== firstRank) {
              parts.set(
                `${highRank.format()}${prevRank.format()}s+`,
                startProb
              );
            } else if (suitedStartRank === prevRank) {
              parts.set(`${highRank.format()}${prevRank.format()}s`, startProb);
            } else {
              parts.set(
                `${highRank.format()}${suitedStartRank.format()}s-${highRank.format()}${prevRank.format()}s`,
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
        const prob = onlyRankPairs.get(
          `${highRank.format()}${suitedStartRank.format()}s`
        )!;
        const lastRank = ranksInPowerOrder[ranksInPowerOrder.length - 1]!;

        if (suitedStartRank === firstRank && lastRank !== firstRank) {
          parts.set(`${highRank.format()}${lastRank.format()}s+`, prob);
        } else if (suitedStartRank === lastRank) {
          parts.set(`${highRank.format()}${suitedStartRank.format()}s`, prob);
        } else {
          parts.set(
            `${highRank.format()}${suitedStartRank.format()}s-${highRank.format()}${lastRank.format()}s`,
            prob
          );
        }
      }

      let ofsuitStartRank: Rank | null = null;

      for (const [ki, rank] of ranksInPowerOrder.entries()) {
        if (ki < hi + 1) continue;

        const prob =
          onlyRankPairs.get(`${highRank.format()}${rank.format()}o`) ?? null;

        if (ofsuitStartRank !== null) {
          const startProb = onlyRankPairs.get(
            `${highRank.format()}${ofsuitStartRank.format()}o`
          )!;

          if (prob !== startProb) {
            const prevRank = ranksInPowerOrder[ki - 1]!;

            if (ofsuitStartRank === firstRank && prevRank !== firstRank) {
              parts.set(
                `${highRank.format()}${prevRank.format()}o+`,
                startProb
              );
            } else if (ofsuitStartRank === prevRank) {
              parts.set(`${highRank.format()}${prevRank.format()}o`, startProb);
            } else {
              parts.set(
                `${highRank.format()}${ofsuitStartRank.format()}o-${highRank.format()}${prevRank.format()}o`,
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
        const prob = onlyRankPairs.get(
          `${highRank.format()}${ofsuitStartRank.format()}o`
        )!;
        const lastRank = ranksInPowerOrder[ranksInPowerOrder.length - 1]!;

        if (ofsuitStartRank === firstRank && lastRank !== firstRank) {
          parts.set(`${highRank.format()}${lastRank.format()}o+`, prob);
        } else if (ofsuitStartRank === lastRank) {
          parts.set(`${highRank.format()}${ofsuitStartRank.format()}o`, prob);
        } else {
          parts.set(
            `${highRank.format()}${ofsuitStartRank.format()}o-${highRank.format()}${lastRank.format()}o`,
            prob
          );
        }
      }
    }

    for (const [i, hr] of ranksInPowerOrder.entries()) {
      for (const kr of ranksInPowerOrder.slice(i)) {
        for (const hs of suits) {
          for (const ks of suits) {
            const pair = CardSet.from([new Card(hr, hs), new Card(kr, ks)]);
            const prob = detachedCardPairs.get(pair.intValue) ?? null;

            if (prob !== null) {
              parts.set(`${pair.format()}`, prob);
            }
          }
        }
      }
    }

    return Array.from(
      parts.entries(),
      ([part, prob]) => `${part}:${formatProbability(prob)}`
    ).join(",");
  }

  *[Symbol.iterator](): Iterator<readonly [CardSet, number]> {
    for (const [cardSet, probability] of this.map) {
      yield [new CardSet(cardSet), probability];
    }
  }
}

const ranksInPowerOrder: Rank[] = [
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

const suits: Suit[] = [Suit.Spade, Suit.Heart, Suit.Diamond, Suit.Club];

function pocketCardPairs(rank: Rank): CardSet[] {
  return [
    CardSet.from([new Card(rank, Suit.Spade), new Card(rank, Suit.Heart)]),
    CardSet.from([new Card(rank, Suit.Spade), new Card(rank, Suit.Diamond)]),
    CardSet.from([new Card(rank, Suit.Spade), new Card(rank, Suit.Club)]),
    CardSet.from([new Card(rank, Suit.Heart), new Card(rank, Suit.Diamond)]),
    CardSet.from([new Card(rank, Suit.Heart), new Card(rank, Suit.Club)]),
    CardSet.from([new Card(rank, Suit.Diamond), new Card(rank, Suit.Club)]),
  ];
}

function suitedCardPairs(high: Rank, kicker: Rank): CardSet[] {
  return [
    CardSet.from([new Card(high, Suit.Spade), new Card(kicker, Suit.Spade)]),
    CardSet.from([new Card(high, Suit.Heart), new Card(kicker, Suit.Heart)]),
    CardSet.from([
      new Card(high, Suit.Diamond),
      new Card(kicker, Suit.Diamond),
    ]),
    CardSet.from([new Card(high, Suit.Club), new Card(kicker, Suit.Club)]),
  ];
}

function ofsuitCardPairs(high: Rank, kicker: Rank): CardSet[] {
  return [
    CardSet.from([new Card(high, Suit.Spade), new Card(kicker, Suit.Heart)]),
    CardSet.from([new Card(high, Suit.Spade), new Card(kicker, Suit.Diamond)]),
    CardSet.from([new Card(high, Suit.Spade), new Card(kicker, Suit.Club)]),
    CardSet.from([new Card(high, Suit.Heart), new Card(kicker, Suit.Spade)]),
    CardSet.from([new Card(high, Suit.Heart), new Card(kicker, Suit.Diamond)]),
    CardSet.from([new Card(high, Suit.Heart), new Card(kicker, Suit.Club)]),
    CardSet.from([new Card(high, Suit.Diamond), new Card(kicker, Suit.Spade)]),
    CardSet.from([new Card(high, Suit.Diamond), new Card(kicker, Suit.Heart)]),
    CardSet.from([new Card(high, Suit.Diamond), new Card(kicker, Suit.Club)]),
    CardSet.from([new Card(high, Suit.Club), new Card(kicker, Suit.Spade)]),
    CardSet.from([new Card(high, Suit.Club), new Card(kicker, Suit.Heart)]),
    CardSet.from([new Card(high, Suit.Club), new Card(kicker, Suit.Diamond)]),
  ];
}

function parseProbability(probabilityString: string): number {
  const inFloat = parseFloat(
    probabilityString.trim().length === 0 ? "1" : probabilityString
  );

  if (inFloat > 1 || inFloat < 0) {
    throw new Error(
      `${probabilityString} is not a valid probability specifier.`
    );
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
