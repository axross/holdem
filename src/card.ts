import { Rank, ranksInOrder, RankUtils } from "./rank";
import { Suit, suitsInOrder, SuitUtils } from "./suit";

/**
 * An integer value that expresses a card. This value is always `2^0 <= n <= 2^51`.
 *
 * @example
 * ```
 * 0b1 as Card;      // ace of spade
 * 0b10 as Card;     // deuce of spade
 * 2 ** 51 as Card;  // king of club
 * ```
 */
export type Card = number & {
  __CardBrand: never;
};

/**
 * A string expression of a card. It's always 2-character length.
 *
 * @example
 * ```
 * "As" as CardString;  // ace of spade
 * "2d" as CardString;  // deuce of diamond
 * "Qh" as CardString;  // queen of heart
 * "Tc" as CardString;  // ten of club
 * ```
 */
export type CardString = `${Rank}${Suit}`;

/**
 * A utility function set for Cards.
 */
export const CardUtils = Object.freeze({
  /**
   * Creates a Card from a given pair of Rank and Suit.
   */
  create(rank: Rank, suit: Suit): Card {
    return (2 **
      (ranksInOrder.indexOf(rank) + suitsInOrder.indexOf(suit) * 13)) as Card;
  },

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
  parse(string: string): Card {
    if (!/^[A23456789TJQK][shdc]$/.test(string)) {
      throw new TypeError(
        `"${string}" is not a valid string for CardUtils.parse().`
      );
    }

    return CardUtils.create(
      RankUtils.parse(string[0]!),
      SuitUtils.parse(string[1]!)
    );
  },

  /**
   * Creates a randomly-chosen Card.
   *
   * @example
   * ```ts
   * CardUtils.random();  => Card (at random)
   * ```
   */
  random(): Card {
    return (2 ** Math.floor(Math.random() * 52)) as Card;
  },

  /**
   * Extracts the Rank part of a Card.
   *
   * @example
   * ```
   * CardUtils.rankOf(CardUtils.parse("As")) === "A";
   * CardUtils.rankOf(CardUtils.parse("3h")) === "3";
   * CardUtils.rankOf(CardUtils.parse("Td")) === "T";
   * CardUtils.rankOf(CardUtils.parse("6c")) === "6";
   * ```
   */
  rankOf(card: Card): Rank {
    return ranksInOrder[Math.log2(card) % 13]!;
  },

  /**
   * Extracts the Suit part of a Card.
   *
   * @example
   * ```
   * CardUtils.suitOf(CardUtils.parse("As")) === "s";
   * CardUtils.suitOf(CardUtils.parse("3h")) === "h";
   * CardUtils.suitOf(CardUtils.parse("Td")) === "d";
   * CardUtils.suitOf(CardUtils.parse("6c")) === "c";
   * ```
   */
  suitOf(card: Card): Suit {
    return suitsInOrder[~~(Math.log2(card) / 13)]!;
  },

  /**
   * Compares two cards in index order and returns integer compatible with Array#sort().
   *
   * @example
   * ```
   * CardUtils.compare(Card("A", "s"), Card("A", "d"));  // => negative integer
   * CardUtils.compare(Card("A", "d"), Card("6", "h"));  // => positive integer
   * CardUtils.compare(Card("A", "c"), Card("A", "c"));  // => 0
   * ```
   */
  compare(a: Card, b: Card): number {
    return (
      SuitUtils.compare(CardUtils.suitOf(a), CardUtils.suitOf(b)) * 13 +
      RankUtils.compare(CardUtils.rankOf(a), CardUtils.rankOf(b))
    );
  },

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
  comparePower(a: Card, b: Card): number {
    return (
      RankUtils.comparePower(CardUtils.rankOf(a), CardUtils.rankOf(b)) * 4 +
      SuitUtils.compare(CardUtils.suitOf(a), CardUtils.suitOf(b))
    );
  },

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
  format(card: Card): CardString {
    return `${CardUtils.rankOf(card)}${CardUtils.suitOf(card)}`;
  },
});
