/**
 * An string-enum type that expresses a suit part of a card. You can combine this with a Rank to build a CardString.
 */
export type Suit =  "s" | "h" | "d" | "c";

/**
 * A utility function set for Suits.
 */
export const SuitUtils = Object.freeze({
  /**
   * Parses a char (= 1-charactor-length string) into a Suit.
   *
   * @example
   * ```ts
   * SuitUtils.parse("s") === "s";
   * SuitUtils.parse("h") === "h";
   * SuitUtils.parse("d") === "d";
   * SuitUtils.parse("c") === "c";
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
    if (!suitsInOrder.includes(char as never)) {
      throw new Error(
        `${JSON.stringify(char)} is not a valid value for SuitUtils.parse().`
      );
    }

    return char as Suit;
  },

  /**
   * Compares two ranks in index order and returns integer compatible with Array#sort().
   *
   * It results in the ordinal order that how it should usually be in poker.
   *
   * @example
   * ```
   * SuitUtils.compare("s", "h");  // => negative integer
   * SuitUtils.compare("c", "d");  // => positive integer
   * SuitUtils.compare("h", "h");  // => 0
   * ```
   */
  compare(a: Suit, b: Suit): number {
    return suitsInOrder.indexOf(a) - suitsInOrder.indexOf(b);
  },
});

export const suitsInOrder: Suit[] = [
  "s", "h", "d", "c"
];