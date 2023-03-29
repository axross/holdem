/**
 * An enum type that expresses a rank part of a card.
 */
export enum Rank {
  Ace = 0,
  Deuce = 1,
  Trey = 2,
  Four = 3,
  Five = 4,
  Six = 5,
  Seven = 6,
  Eight = 7,
  Nine = 8,
  Ten = 9,
  Jack = 10,
  Queen = 11,
  King = 12,
}

/**
 * A string expression of a rank. It's always 1-character length. You can combine this with a SuitChar to build a CardString.
 *
 * @example
 * ```
 * const rankChar: RankChar = "A";
 * const suitChar: SuitChar = "s";
 * const cardString: CardString = `${rankChar}${suitChar}`;
 * ```
 */
export type RankChar =
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
    switch (char) {
      case "A":
        return Rank.Ace;
      case "K":
        return Rank.King;
      case "Q":
        return Rank.Queen;
      case "J":
        return Rank.Jack;
      case "T":
        return Rank.Ten;
      case "9":
        return Rank.Nine;
      case "8":
        return Rank.Eight;
      case "7":
        return Rank.Seven;
      case "6":
        return Rank.Six;
      case "5":
        return Rank.Five;
      case "4":
        return Rank.Four;
      case "3":
        return Rank.Trey;
      case "2":
        return Rank.Deuce;
      default:
        throw new Error(
          `${JSON.stringify(char)} is not a valid value for RankUtils.parse().`
        );
    }
  },

  /**
   * Returns power of a Rank.
   *
   * @example
   * ```ts
   * RankUtils.power(Rank.Ace) > RankUtils.power(Rank.King);    // => true
   * RankUtils.power(Rank.Ace) > RankUtils.power(Rank.Deuce);   // => true
   * RankUtils.power(Rank.Trey) > RankUtils.power(Rank.Deuce);  // => true
   * ```
   */
  power(rank: Rank): number {
    switch (rank) {
      case Rank.Ace:
        return 12;
      case Rank.King:
        return 11;
      case Rank.Queen:
        return 10;
      case Rank.Jack:
        return 9;
      case Rank.Ten:
        return 8;
      case Rank.Nine:
        return 7;
      case Rank.Eight:
        return 6;
      case Rank.Seven:
        return 5;
      case Rank.Six:
        return 4;
      case Rank.Five:
        return 3;
      case Rank.Four:
        return 2;
      case Rank.Trey:
        return 1;
      case Rank.Deuce:
        return 0;
    }
  },

  /**
   * Compares two ranks in index order and returns integer compatible with Array#sort().
   *
   * @example
   * ```
   * RankUtils.compare(Rank.Ace, Rank.Deuce);  // => negative integer
   * RankUtils.compare(Rank.Deuce, Rank.Ace);  // => positive integer
   * RankUtils.compare(Rank.Ace, Rank.Ace);  // => 0
   * ```
   */
  compare(a: Rank, b: Rank): number {
    return a - b;
  },

  /**
   * Compares two ranks in power order and returns integer compatible with Array#sort().
   *
   * @example
   * ```
   * RankUtils.compare(Rank.Ace, Rank.King);  // => negative integer
   * RankUtils.compare(Rank.King, Rank.Ace);  // => positive integer
   * RankUtils.compare(Rank.Ace, Rank.Ace);  // => 0
   * RankUtils.compare(Rank.Ace, Rank.Deuce);  // => positive integer
   * ```
   */
  comparePower(a: Rank, b: Rank): number {
    return RankUtils.power(b) - RankUtils.power(a);
  },

  /**
   * Stringifies a Rank.
   *
   * @example
   * ```ts
   * RankUtils.format(Rank.Ace) === "A";
   * RankUtils.format(Rank.Ten) === "T";
   * RankUtils.format(Rank.Five) === "5";
   * ```
   *
   * You can utilize this function to build a CardString.
   *
   * @example
   * ```ts
   * const aceChar = RankUtils.format(Rank.Ace);
   * const spadeChar = RankUtils.format(Suit.Spade);
   * const aceOfSpade: CardString = `${aceChar}${spadeChar}`;
   * ```
   */
  format(rank: Rank): RankChar {
    switch (rank) {
      case Rank.Ace:
        return "A";
      case Rank.King:
        return "K";
      case Rank.Queen:
        return "Q";
      case Rank.Jack:
        return "J";
      case Rank.Ten:
        return "T";
      case Rank.Nine:
        return "9";
      case Rank.Eight:
        return "8";
      case Rank.Seven:
        return "7";
      case Rank.Six:
        return "6";
      case Rank.Five:
        return "5";
      case Rank.Four:
        return "4";
      case Rank.Trey:
        return "3";
      case Rank.Deuce:
        return "2";
    }
  },
});
