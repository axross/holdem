/**
 * A enum-like representation of suit in playing cards.
 *
 * @example
 * ```ts
 * Suit.Spade;    // => spade of playing cards
 * Suit.Diamond;  // => diamond of playing cards
 * ```
 */
export class Suit {
  static Spade = new Suit(0);

  static Heart = new Suit(1);

  static Diamond = new Suit(2);

  static Club = new Suit(3);

  /**
   * Parses a char (= 1-charactor-length string) into a Suit.
   *
   * @example
   * ```ts
   * Suit.parse("s") === "s";
   * Suit.parse("h") === "h";
   * Suit.parse("d") === "d";
   * Suit.parse("c") === "c";
   * ```
   *
   * Only `"s"`, `"h"`, `"d"`, or `"c"` is acceptable.
   *
   * @example
   * ```ts
   * Suit.parse("S");  // => Error: "S" is not a valid string value for Suit.parse().
   * ```
   */
  static parse(char: string): Suit {
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
          `${JSON.stringify(char)} is not a valid value for Suit.parse().`
        );
    }
  }

  private constructor(index: number) {
    this.index = index;
  }

  private readonly index: number;

  /**
   * Compares two ranks in index order and returns integer compatible with [`Array#sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).
   *
   * It results in the ordinal order that how it should usually be in poker.
   *
   * @example
   * ```
   * Suit.Spade.compare(Suit.Heart);   // => negative integer
   * Suit.Club.compare(Suit.Diamond);  // => positive integer
   * Suit.Heart.compare(Suit.Heart);   // => 0
   * ```
   */
  compare(other: Suit): number {
    return this.index - other.index;
  }

  /**
   * Returns a char for the Suit. The returning string is compatible for `Suit.parse()`.
   *
   * @example
   * ```ts
   * Suit.Spade.format() === "s";
   * Suit.Diamond.format() === "d";
   * ```
   */
  format(): string {
    switch (this) {
      case Suit.Heart:
        return "h";
      case Suit.Diamond:
        return "d";
      case Suit.Club:
        return "c";
      default:
        return "s";
    }
  }
}
