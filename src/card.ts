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
   * CardUtils.parse("As") === CardUtils.create("A", "s");
   * CardUtils.parse("2s") === CardUtils.create("2", "s");
   * CardUtils.parse("Kc") === CardUtils.create("K", "c");
   * ```
   */
  static parse(string: string): Card {
    if (!/^[A23456789TJQK][shdc]$/.test(string)) {
      throw new TypeError(
        `"${string}" is not a valid string for CardUtils.parse().`
      );
    }

    return new Card(Rank.parse(string[0]!), Suit.parse(string[1]!));
  }

  /**
   * Extracts the Rank part of a Card.
   *
   * @example
   * ```
   * new Card("A", "s").rank === "A";
   * new Card("3", "h").rank === "3";
   * new Card("T", "d").rank === "T";
   * new Card("6", "c").rank === "6";
   * ```
   */
  readonly rank: Rank;

  /**
   * Extracts the Suit part of a Card.
   *
   * @example
   * ```
   * new Card("A", "s").suit === "s";
   * new Card("3", "h").suit === "h";
   * new Card("T", "d").suit === "d";
   * new Card("6", "c").suit === "c";
   * ```
   */
  readonly suit: Suit;

  /**
   * Compares two cards in index order and returns integer compatible with Array#sort().
   *
   * @example
   * ```
   * Card("A", "s").compare(Card("A", "d"));  // => negative integer
   * Card("A", "d").compare(Card("6", "h"));  // => positive integer
   * Card("A", "c").compare(Card("A", "c"));  // => 0
   * ```
   */
  compare(other: Card): number {
    return this.suit.compare(other.suit) * 13 + this.rank.compare(other.rank);
  }

  /**
   * Compares two ranks in power order and returns integer compatible with Array#sort().
   *
   * @example
   * ```
   * CardUtils.comparePower(Card("A", "s"), Card("A", "d"));  // => negative integer
   * CardUtils.comparePower(Card("A", "d"), Card("6", "h"));  // => negative integer
   * CardUtils.comparePower(Card("Q", "s"), Card("A", "h"));  // => positive integer
   * CardUtils.comparePower(Card("A", "c"), Card("A", "c"));  // => 0
   * ```
   */
  comparePower(other: Card): number {
    return (
      this.rank.comparePower(other.rank) * 4 + this.suit.compare(other.suit)
    );
  }

  equals(other: Card) {
    return this.rank === other.rank && this.suit === other.suit;
  }

  /**
   * Stringifies a Card.
   *
   * @example
   * ```
   * CardUtils.format(CardUtils.create("A", "s")) === ("As" as CardString);
   * CardUtils.format(CardUtils.create("2", "s")) === ("2s" as CardString);
   * CardUtils.format(CardUtils.create("K", "c")) === ("Kc" as CardString);
   * ```
   */
  format(): string {
    return `${this.rank.format()}${this.suit.format()}`;
  }
}
