import { Rank } from "./rank";
import { Suit } from "./suit";

export class Card {
  /**
   * Creates a Card from a given pair of Rank and Suit.
   */
  constructor(rank: Rank, suit: Suit) {
    this.rank = rank;
    this.suit = suit;
  }

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
  static parse(string: string): Card {
    if (!/^[A23456789TJQK][shdc]$/.test(string)) {
      throw new TypeError(
        `"${string}" is not a valid string for Card.parse().`
      );
    }

    return new Card(Rank.parse(string[0]!), Suit.parse(string[1]!));
  }

  /**
   * Extracts the Rank part of a Card.
   *
   * @example
   * ```
   * new Card(Rank.Ace, Suit.Spade).rank === Rank.Ace;    // => true
   * new Card(Rank.Trey, Suit.Heart).rank === Rank.Trey;  // => true
   * new Card(Rank.Ten, Suit.Diamond).rank === Rank.Ten;  // => true
   * new Card(Rank.Six, Suit.Club).rank === Rank.Six;     // => true
   * ```
   */
  readonly rank: Rank;

  /**
   * Extracts the Suit part of a Card.
   *
   * @example
   * ```
   * new Card(Rank.Ace, Suit.Spade).suit === Suit.Spade;      // => true
   * new Card(Rank.Trey, Suit.Heart).suit === Suit.Heart;     // => true
   * new Card(Rank.Ten, Suit.Diamond).suit === Suit.Diamond;  // => true
   * new Card(Rank.Six, Suit.Club).suit === Suit.Club;        // => true
   * ```
   */
  readonly suit: Suit;

  /**
   * Compares two cards in power order and returns integer compatible with Array#sort().
   *
   * @example
   * ```
   * CardUtils.compare(new Card(Rank.Ace, Suit.Spade), new Card(Rank.Ace, Suit.Diamond));  // => negative integer
   * CardUtils.compare(new Card(Rank.Ace, Suit.Diamond), new Card(Rank.Six, Suit.Heart));  // => negative integer
   * CardUtils.compare(new Card(Rank.Queen, Suit.Spade), new Card(Rank.Ace, Suit.Heart));  // => positive integer
   * CardUtils.compare(new Card(Rank.Ace, Suit.Club), new Card(Rank.Ace, Suit.Club));      // => 0
   * ```
   */
  compare(other: Card): number {
    return this.rank.compare(other.rank) * 4 + this.suit.compare(other.suit);
  }

  equals(other: Card) {
    return this.rank === other.rank && this.suit === other.suit;
  }

  /**
   * Stringifies a Card.
   *
   * @example
   * ```
   * new Card(Rank.Ace, Suit.Spade).format() === "As";    // => true
   * new Card(Rank.Deuce, Suit.Spade).format() === "2s";  // => true
   * new Card(Rank.King, Suit.Club).format() === "Kc";    // => true
   * ```
   */
  format(): string {
    return `${this.rank.format()}${this.suit.format()}`;
  }
}
