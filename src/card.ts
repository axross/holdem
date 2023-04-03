import { Rank } from "./rank";
import { Suit } from "./suit";

/**
 * A class representing a piece of playing cards.
 */
export class Card {
  /**
   * Parses a string into a Card.
   *
   * @example
   * ```ts
   * Card.parse("As").equals(new Card(Rank.Ace, Suit.Spade));    // => true
   * Card.parse("2s").equals(new Card(Rank.Deuce, Suit.Spade));  // => true
   * Card.parse("Kc").equals(new Card(Rank.King, Suit.Club));    // => true
   * ```
   */
  static parse(expression: string): Card {
    if (!/^[A23456789TJQK][shdc]$/.test(expression)) {
      throw new TypeError(
        `"${expression}" is not a valid string for Card.parse().`
      );
    }

    return new Card(Rank.parse(expression[0]!), Suit.parse(expression[1]!));
  }

  /**
   * Creates a Card from a given pair of Rank and Suit.
   *
   * @example
   * ```ts
   * new Card(Rank.Ace, Suit.Spade);
   * ```
   */
  constructor(rank: Rank, suit: Suit) {
    this.rank = rank;
    this.suit = suit;
  }

  /**
   * Rank of the Card.
   *
   * @example
   * ```ts
   * new Card(Rank.Ace, Suit.Spade).rank === Rank.Ace;    // => true
   * new Card(Rank.Trey, Suit.Heart).rank === Rank.Trey;  // => true
   * new Card(Rank.Ten, Suit.Diamond).rank === Rank.Ten;  // => true
   * new Card(Rank.Six, Suit.Club).rank === Rank.Six;     // => true
   * ```
   */
  readonly rank: Rank;

  /**
   * Suit of the Card.
   *
   * @example
   * ```ts
   * new Card(Rank.Ace, Suit.Spade).suit === Suit.Spade;      // => true
   * new Card(Rank.Trey, Suit.Heart).suit === Suit.Heart;     // => true
   * new Card(Rank.Ten, Suit.Diamond).suit === Suit.Diamond;  // => true
   * new Card(Rank.Six, Suit.Club).suit === Suit.Club;        // => true
   * ```
   */
  readonly suit: Suit;

  /**
   * Compares two cards in power order and returns integer compatible with [`Array#sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).
   *
   * @example
   * ```ts
   * new Card(Rank.Ace, Suit.Spade).compare(new Card(Rank.Ace, Suit.Diamond));  // => negative integer
   * new Card(Rank.Ace, Suit.Diamond).compare(new Card(Rank.Six, Suit.Heart));  // => negative integer
   * new Card(Rank.Queen, Suit.Spade).compare(new Card(Rank.Ace, Suit.Heart));  // => positive integer
   * new Card(Rank.Ace, Suit.Club).compare(new Card(Rank.Ace, Suit.Club));      // => 0
   * ```
   */
  compare(other: Card): number {
    return this.rank.compare(other.rank) * 4 + this.suit.compare(other.suit);
  }

  /**
   * Whether the given card has the same rank and suit or not.
   *
   * @example
   * ```ts
   * new Card(Rank.Ace, Suit.Spade).equals(new Card(Rank.Ace, Suit.Spade));    // => true
   * new Card(Rank.Ace, Suit.Spade).equals(new Card(Rank.Ace, Suit.Diamond));  // => false
   * new Card(Rank.Ace, Suit.Spade).equals(new Card(Rank.Deuce, Suit.Spade));  // => false
   * ```
   */
  equals(other: Card): boolean {
    return this.rank === other.rank && this.suit === other.suit;
  }

  /**
   * Stringifies a Card.
   *
   * @example
   * ```ts
   * new Card(Rank.Ace, Suit.Spade).format() === "As";    // => true
   * new Card(Rank.Deuce, Suit.Spade).format() === "2s";  // => true
   * new Card(Rank.King, Suit.Club).format() === "Kc";    // => true
   * ```
   */
  format(): string {
    return `${this.rank.format()}${this.suit.format()}`;
  }
}
