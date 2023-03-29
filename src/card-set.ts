import { Card, CardString, CardUtils } from "./card";

/**
 * An integer that expresses a binary set of Cards. This value is always `0 <= n <= 2^52-1`.
 */
export type CardSet = number & {
  __CardSetBrand: never;
};

export const CardSetUtils = Object.freeze({
  /**
   * An empty CardSet.
   */
  empty: 0b0 as CardSet,

  /**
   * A CardSet that has all the cards.
   */
  full: 0b1111111111111111111111111111111111111111111111111111 as CardSet,

  /**
   * Creates a CardSet from Cards.
   *
   * @example
   * ```ts
   * const cardSet = CardSet.from([
   *   CardUtils.create(Rank.Ace, Suit.Spade),
   *   CardUtils.create(Rank.King, Suit.Club),
   *   CardUtils.create(Rank.Queen, Suit.Heart),
   *   CardUtils.create(Rank.Jack, Suit.Diamond),
   * ]);
   * ```
   */
  from(cards: Iterable<Card>): CardSet {
    let cardSet = CardSetUtils.empty;

    for (const card of cards) {
      cardSet = CardSetUtils.union(cardSet, card);
    }

    return cardSet;
  },

  /**
   * Parses a string into CardSet.
   *
   * @example
   * ```ts
   * CardSetUtils.parse("AsQhJdKc") === CardSet.from([
   *   CardUtils.create(Rank.Ace, Suit.Spade),
   *   CardUtils.create(Rank.King, Suit.Club),
   *   CardUtils.create(Rank.Queen, Suit.Heart),
   *   CardUtils.create(Rank.Jack, Suit.Diamond),
   * ]);  // => true
   *
   * CardSetUtils.parse("") === CardSetUtils.empty;  // => true
   * ```
   */
  parse(string: string): CardSet {
    let cards = 0 as CardSet;

    for (let i = 0; i < string.length; i += 2) {
      try {
        cards = CardSetUtils.union(
          cards,
          CardUtils.parse(string.substring(i, i + 2) as CardString)
        );
      } catch (error) {
        throw new Error(
          `\"${string}\".substring(${i}, ${i + 2}) is not a valid CardString.`
        );
      }
    }

    return cards;
  },

  /**
   * Iterates a CardSet.
   *
   * @example
   * ```ts
   * const cardSet = CardSet.from([
   *   CardUtils.create(Rank.Ace, Suit.Spade),
   *   CardUtils.create(Rank.King, Suit.Club),
   *   CardUtils.create(Rank.Queen, Suit.Heart),
   *   CardUtils.create(Rank.Jack, Suit.Diamond),
   * ]);
   *
   * for (const card of CardSetUtils.iterate(cardSet)) {
   *   console.log(card);
   * }
   * ```
   */
  iterate: function* (cards: CardSet): Iterable<Card> {
    let _cards = BigInt(cards);

    while (_cards > 0) {
      const card = _cards & -_cards;

      yield Number(card) as Card;

      _cards = (_cards & (_cards - 1n));
    }
  },

  /**
   * Returns the number of cards in a CardSet.
   *
   * @example
   * ```ts
   * const cardSet = CardSetUtils.from([
   *   CardUtils.create(Rank.Ace, Suit.Spade),
   *   CardUtils.create(Rank.King, Suit.Club),
   *   CardUtils.create(Rank.Queen, Suit.Heart),
   *   CardUtils.create(Rank.Jack, Suit.Diamond),
   * ]);
   *
   * CardSetUtils.size(cardSet);             // => 4
   * CardSetUtils.size(CardSetUtils.empty);  // => 0
   * CardSetUtils.size(CardSetUtils.full);   // => 52
   * ```
   */
  size(cards: CardSet): number {
    let size = 0;

    for (const _ of CardSetUtils.iterate(cards)) {
      size += 1;
    }

    return size;
  },

  /**
   * Returns whether a CardSet contains every card in another CardSet.
   *
   * @example
   * ```ts
   * const cardSet = CardSetUtils.from([
   *   CardUtils.create(Rank.Ace, Suit.Spade),
   *   CardUtils.create(Rank.King, Suit.Club),
   *   CardUtils.create(Rank.Queen, Suit.Heart),
   *   CardUtils.create(Rank.Jack, Suit.Diamond),
   * ]);
   *
   * CardSetUtils.has(cardSet, CardSetUtils.from([
   *   CardUtils.create(Rank.Ace, Suit.Spade),
   *   CardUtils.create(Rank.Queen, Suit.Heart),
   * ]));  // => true
   *
   * CardSetUtils.has(cardSet, CardSetUtils.from([
   *   CardUtils.create(Rank.Ace, Suit.Spade),
   *   CardUtils.create(Rank.Ace, Suit.Heart),
   * ]));  // => false
   *
   * CardSetUtils.has(cardSet, CardUtils.create(Rank.Ace, Suit.Spade));  // => true
   *
   * CardSetUtils.has(cardSet, CardSetUtils.empty);  // => true
   * ```
   */
  has(superset: CardSet, subset: Card | CardSet): boolean {
    return ((BigInt(superset) & BigInt(subset)) ^ BigInt(subset)) === 0n;
  },

  /**
   * Returns an union of two CardSets.
   *
   * @example
   * ```ts
   * CardSetUtils.union(
   *   CardSetUtils.from([
   *     CardUtils.create(Rank.Ace, Suit.Spade),
   *     CardUtils.create(Rank.Queen, Suit.Heart),
   *   ]),
   *   CardSetUtils.from([
   *     CardUtils.create(Rank.King, Suit.Club),
   *     CardUtils.create(Rank.Jack, Suit.Diamond),
   *   ]),
   * ) === CardSetUtils.from([
   *   CardUtils.create(Rank.Ace, Suit.Spade),
   *   CardUtils.create(Rank.King, Suit.Club),
   *   CardUtils.create(Rank.Queen, Suit.Heart),
   *   CardUtils.create(Rank.Jack, Suit.Diamond),
   * ]);
   * ```
   */
  union(a: Card | CardSet, b: Card | CardSet): CardSet {
    return Number(BigInt(a) | BigInt(b)) as CardSet;
  },

  /**
   * Returns a difference (=relative complement) of two CardSets.
   *
   * @example
   * ```ts
   * CardSetUtils.union(
   *   CardSetUtils.from([
   *     CardUtils.create(Rank.Ace, Suit.Spade),
   *     CardUtils.create(Rank.Queen, Suit.Heart),
   *   ]),
   *   CardSetUtils.from([
   *     CardUtils.create(Rank.King, Suit.Club),
   *     CardUtils.create(Rank.Jack, Suit.Diamond),
   *   ]),
   * ) === CardSetUtils.from([
   *   CardUtils.create(Rank.Ace, Suit.Spade),
   *   CardUtils.create(Rank.King, Suit.Club),
   *   CardUtils.create(Rank.Queen, Suit.Heart),
   *   CardUtils.create(Rank.Jack, Suit.Diamond),
   * ]);
   * ```
   */
  diff(a: Card | CardSet, b: Card | CardSet): CardSet {
    return Number(BigInt(a) & ~BigInt(b)) as CardSet;
  },

  /**
   * Stringify a CardSet.
   *
   * @example
   * ```ts
   * CardSetUtils.from([
   *   CardUtils.create(Rank.Ace, Suit.Spade),
   *   CardUtils.create(Rank.King, Suit.Club),
   *   CardUtils.create(Rank.Queen, Suit.Heart),
   *   CardUtils.create(Rank.Jack, Suit.Diamond),
   * ]).format() === "AsQhJdKc";
   * ```
   */
  format(
    cards: CardSet,
    { sortInPower = false }: { sortInPower?: boolean } = {}
  ): string {
    const _cards = [...CardSetUtils.iterate(cards)];

    _cards.sort((a, b) =>
      sortInPower ? CardUtils.comparePower(a, b) : CardUtils.compare(a, b)
    );

    return _cards.map((c) => CardUtils.format(c)).join("");
  },
});
