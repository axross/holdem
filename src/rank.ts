/**
 * An enum type that expresses a rank part of a card. You can combine this with a Suit to build a CardString.
 *
 * @example
 * ```
 * const rankChar: RankChar = "A";
 * const suitChar: SuitChar = "s";
 * const cardString: CardString = `${rankChar}${suitChar}`;
 */
export type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "T"
  | "J"
  | "Q"
  | "K";

/**
 * A utility function set for ranks.
 */
export const RankUtils = Object.freeze({
  /**
   * Parses a char (= 1-charactor-length string) into a Rank.
   *
   * @example
   * ```ts
   * RankUtils.parse("A") === Rank.Ace;
   * RankUtils.parse("T") === Rank.Ten;
   * RankUtils.parse("5") === Rank.Five;
   * ```
   *
   * Only `"A"`, `"K"`, `"Q"`, `"J"`, `"T"`, `"9"`, `"8"`, `"7"`, `"6"`, `"5"`, `"4"`, `"3"` or `"2"` is acceptable.
   *
   * @example
   * ```ts
   * RankUtils.parse("a");  // => Error: "a" is not a valid string value for RankUtils.parse().
   * ```
   *
   * For consistency reason, it needs to be a string even for number-based ranks (e.g. `"4"`).
   *
   * @example
   * ```ts
   * RankUtils.parse("4") === Rank.Four;
   * RankUtils.parse(4);  // Error: 4 is not a valid string value for RankUtils.parse().
   * ```
   */
  parse(char: string): Rank {
    if (!ranksInOrder.includes(char as never)) {
      throw new Error(
        `${JSON.stringify(char)} is not a valid value for RankUtils.parse().`
      );
    }

    return char as Rank;
  },

  /**
   * Compares two ranks in index order and returns integer compatible with Array#sort().
   *
   * @example
   * ```
   * RankUtils.compare("A", "2");  // => negative integer
   * RankUtils.compare("2", "A");  // => positive integer
   * RankUtils.compare("A", "A");  // => 0
   * ```
   */
  compare(a: Rank, b: Rank): number {
    return ranksInOrder.indexOf(a) - ranksInOrder.indexOf(b);
  },

  /**
   * Compares two ranks in power order and returns integer compatible with Array#sort().
   *
   * @example
   * ```
   * RankUtils.compare("A", "K");  // => negative integer
   * RankUtils.compare("K", "A");  // => positive integer
   * RankUtils.compare("A", "A");  // => 0
   * RankUtils.compare("A", "2");  // => positive integer
   * ```
   */
  comparePower(a: Rank, b: Rank): number {
    return ranksInPowerOrder.indexOf(a) - ranksInPowerOrder.indexOf(b);
  },
});

export const ranksInOrder: Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
];

export const ranksInPowerOrder: Rank[] = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
]