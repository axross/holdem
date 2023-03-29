/**
 * An enum type that expresses a suit part of a card.
 */
export enum Suit {
  Spade = 0,
  Heart = 1,
  Diamond = 2,
  Club = 3,
}

/**
 * A string expression of a suit. It's always 1-character length. You can combine this with a RankChar to build a CardString.
 *
 * @example
 * ```
 * const rankChar: RankChar = "A";
 * const suitChar: SuitChar = "s";
 * const cardString: CardString = `${rankChar}${suitChar}`;
 * ```
 */
export type SuitChar = "s" | "h" | "d" | "c";

/**
 * A utility function set for Suits.
 */
export const SuitUtils = Object.freeze({
  /**
   * Parses a char (= 1-charactor-length string) into a Suit.
   *
   * @example
   * ```ts
   * SuitUtils.parse("s") === Suit.Spade;
   * SuitUtils.parse("h") === Suit.Heart;
   * SuitUtils.parse("d") === Suit.Diamond;
   * SuitUtils.parse("c") === Suit.Club;
   * ```
   *
   * Only `"s"`, `"h"`, `"d"`, or `"c"` is acceptable.
   *
   * @example
   * ```ts
   * SuitUtils.parse("S");  // => Error: "S" is not a valid string value for SuitUtils.parse().
   * ```
   */
  parse(char: string): Suit {
    switch (char) {
      case "s":
        return Suit.Spade;
      case "h":
        return Suit.Heart;
      case "d":
        return Suit.Diamond;
      case "c":
        return Suit.Club;
      default:
        throw new Error(
          `${JSON.stringify(char)} is not a valid value for SuitUtils.parse().`
        );
    }
  },

  /**
   * Compares two ranks in index order and returns integer compatible with Array#sort().
   *
   * It results in the ordinal order that how it should usually be in poker.
   *
   * @example
   * ```
   * SuitUtils.compare(Suit.Spade, Suit.Heart);  // => negative integer
   * SuitUtils.compare(Suit.Club, Suit.Diamond);  // => positive integer
   * SuitUtils.compare(Suit.Heart, Suit.Heart);  // => 0
   * ```
   */
  compare(a: Suit, b: Suit): number {
    return a - b;
  },

  /**
   * Stringifies a Suit.
   *
   * @example
   * ```ts
   * SuitUtils.format(Suit.Spade) === "s";
   * SuitUtils.format(Suit.Heart) === "h";
   * SuitUtils.format(Suit.Diamond) === "d";
   * SuitUtils.format(Suit.Club) === "c";
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
  format(suit: Suit): SuitChar {
    switch (suit) {
      case Suit.Spade:
        return "s";
      case Suit.Heart:
        return "h";
      case Suit.Diamond:
        return "d";
      case Suit.Club:
        return "c";
    }
  },
});
