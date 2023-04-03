/**
 * A enum-like representation of rank in playing cards.
 *
 * @example
 * ```ts
 * Rank.Ace;    // => A of playing cards
 * Rank.Deuce;  // => 2 of playing cards
 * ```
 */
export class Rank {
  static Ace = new Rank(0);

  static Deuce = new Rank(1);

  static Trey = new Rank(2);

  static Four = new Rank(3);

  static Five = new Rank(4);

  static Six = new Rank(5);

  static Seven = new Rank(6);

  static Eight = new Rank(7);

  static Nine = new Rank(8);

  static Ten = new Rank(9);

  static Jack = new Rank(10);

  static Queen = new Rank(11);

  static King = new Rank(12);

  /**
   * Parses a char (= 1-charactor-length string) into a Rank.
   *
   * @example
   * ```ts
   * Rank.parse("A") === Rank.Ace;
   * Rank.parse("T") === Rank.Ten;
   * Rank.parse("5") === Rank.Five;
   * ```
   *
   * Only `"A"`, `"K"`, `"Q"`, `"J"`, `"T"`, `"9"`, `"8"`, `"7"`, `"6"`, `"5"`, `"4"`, `"3"` or `"2"` is acceptable.
   *
   * @example
   * ```ts
   * Rank.parse("a");  // => Error: "a" is not a valid string value for Rank.parse().
   * ```
   *
   * For consistency reason, it needs to be a string even for number-based ranks (e.g. `"4"`).
   *
   * @example
   * ```ts
   * Rank.parse("4") === Rank.Four;
   * Rank.parse(4);  // Error: 4 is not a valid string value for Rank.parse().
   * ```
   */
  static parse(char: string): Rank {
    switch (char) {
      case "A":
        return Rank.Ace;
      case "2":
        return Rank.Deuce;
      case "3":
        return Rank.Trey;
      case "4":
        return Rank.Four;
      case "5":
        return Rank.Five;
      case "6":
        return Rank.Six;
      case "7":
        return Rank.Seven;
      case "8":
        return Rank.Eight;
      case "9":
        return Rank.Nine;
      case "T":
        return Rank.Ten;
      case "J":
        return Rank.Jack;
      case "Q":
        return Rank.Queen;
      case "K":
        return Rank.King;
      default:
        throw new Error(
          `${JSON.stringify(char)} is not a valid value for Rank.parse().`
        );
    }
  }

  private constructor(index: number) {
    this.index = index;
  }

  private readonly index: number;

  private get powerIndex(): number {
    if (this === Rank.Ace) {
      return 0;
    } else {
      return 13 - this.index;
    }
  }

  /**
   * Compares two ranks in power order and returns integer compatible with [`Array#sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).
   *
   * @example
   * ```
   * Rank.Ace.compare(Rank.King);   // => negative integer
   * Rank.King.compare(Rank.Ace);   // => positive integer
   * Rank.Ace.compare(Rank.Ace);    // => 0
   * Rank.Ace.compare(Rank.Deuce);  // => positive integer
   * ```
   */
  compare(other: Rank): number {
    return this.powerIndex - other.powerIndex;
  }

  /**
   * Returns a char for the Rank. The returning string is compatible for `Rank.parse()`.
   *
   * @example
   * ```ts
   * Rank.Ace.format() === "A";
   * Rank.Ten.format() === "T";
   * Rank.Five.format() === "5";
   * ```
   */
  format(): string {
    switch (this) {
      case Rank.Deuce:
        return "2";
      case Rank.Trey:
        return "3";
      case Rank.Four:
        return "4";
      case Rank.Five:
        return "5";
      case Rank.Six:
        return "6";
      case Rank.Seven:
        return "7";
      case Rank.Eight:
        return "8";
      case Rank.Nine:
        return "9";
      case Rank.Ten:
        return "T";
      case Rank.Jack:
        return "J";
      case Rank.Queen:
        return "Q";
      case Rank.King:
        return "K";
      default:
        return "A";
    }
  }
}
