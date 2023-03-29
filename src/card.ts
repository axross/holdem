import { Rank, RankChar, RankUtils } from "./rank";
import { Suit, SuitChar, SuitUtils } from "./suit";

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
export type CardString = `${RankChar}${SuitChar}`;

/**
 * A utility function set for Cards.
 */
export const CardUtils = Object.freeze({
  /**
   * Creates a Card from a given pair of Rank and Suit.
   */
  create(rank: Rank, suit: Suit): Card {
    return (2 ** (rank + suit * 13)) as Card;
  },

  /**
   * Parses a string into a Card.
   *
   * @example
   * ```ts
   * CardUtils.parse("As") === CardUtils.create(Rank.Ace, Suit.Spade);
   * CardUtils.parse("2s") === CardUtils.create(Rank.Deuce, Suit.Spade);
   * CardUtils.parse("Kc") === CardUtils.create(Rank.King, Suit.Club);
   * ```
   */
  parse(string: string): Card {
    if (!/^[A23456789TJQK][shdc]$/.test(string)) {
      throw new TypeError(
        `"${string}" is not a valid string for CardUtils.parse().`
      );
    }

    return CardUtils.create(
      RankUtils.parse(string[0] as RankChar),
      SuitUtils.parse(string[1] as SuitChar)
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
   * CardUtils.rankOf(CardUtils.parse("As")) === Rank.Ace;
   * CardUtils.rankOf(CardUtils.parse("3h")) === Rank.Trey;
   * CardUtils.rankOf(CardUtils.parse("Td")) === Rank.Ten;
   * CardUtils.rankOf(CardUtils.parse("6c")) === Rank.Six;
   * ```
   */
  rankOf(card: Card): Rank {
    return Math.log2(card) % 13;
  },

  /**
   * Extracts the Suit part of a Card.
   *
   * @example
   * ```
   * CardUtils.suitOf(CardUtils.parse("As")) === Suit.Spade;
   * CardUtils.suitOf(CardUtils.parse("3h")) === Suit.Heart;
   * CardUtils.suitOf(CardUtils.parse("Td")) === Suit.Diamond;
   * CardUtils.suitOf(CardUtils.parse("6c")) === Suit.Club;
   * ```
   */
  suitOf(card: Card): Suit {
    return ~~(Math.log2(card) / 13);
  },

  /**
   * Compares two cards in index order and returns integer compatible with Array#sort().
   *
   * @example
   * ```
   * CardUtils.compare(Card(Rank.Ace, Suit.Spade), Card(Rank.Ace, Suit.Diamond));  // => negative integer
   * CardUtils.compare(Card(Rank.Ace, Suit.Diamond), Card(Rank.Six, Suit.Heart));  // => positive integer
   * CardUtils.compare(Card(Rank.Ace, Suit.Club), Card(Rank.Ace, Suit.Club));  // => 0
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
   * CardUtils.comparePower(Card(Rank.Ace, Suit.Spade), Card(Rank.Ace, Suit.Diamond));  // => negative integer
   * CardUtils.comparePower(Card(Rank.Ace, Suit.Diamond), Card(Rank.Six, Suit.Heart));  // => negative integer
   * CardUtils.comparePower(Card(Rank.Queen, Suit.Spade), Card(Rank.Ace, Suit.Heart));  // => positive integer
   * CardUtils.comparePower(Card(Rank.Ace, Suit.Club), Card(Rank.Ace, Suit.Club));  // => 0
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
   * CardUtils.format(CardUtils.create(Rank.Ace, Suit.Spade)) === ("As" as CardString);
   * CardUtils.format(CardUtils.create(Rank.Deuce, Suit.Spade)) === ("2s" as CardString);
   * CardUtils.format(CardUtils.create(Rank.King, Suit.Club)) === ("Kc" as CardString);
   * ```
   */
  format(card: Card): CardString {
    const rankChar = RankUtils.format(CardUtils.rankOf(card));
    const suitChar = SuitUtils.format(CardUtils.suitOf(card));

    return `${rankChar}${suitChar}`;
  },
});
