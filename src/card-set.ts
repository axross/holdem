import { Card } from "./card";
import { Rank } from "./rank";
import { Suit } from "./suit";

export class CardSet implements Iterable<Card> {
  /**
   * An empty CardSet.
   */
  static empty(): CardSet {
    return new CardSet(0);
  }

  /**
   * A CardSet that has all the cards.
   */
  static full(): CardSet {
    return new CardSet(0b1111111111111111111111111111111111111111111111111111);
  }

  /**
   * Creates a CardSet from Cards.
   *
   * @example
   * ```ts
   * const cardSet = CardSet.from([
   *   new Card(Rank.Ace, Suit.Spade),
   *   new Card(Rank.King, Rank.Club),
   *   new Card(Rank.Queen, Rank.Queen),
   *   new Card(Rank.Jack, Rank.Diamond),
   * ]);
   * ```
   */
  static from(cards: Iterable<Card>): CardSet {
    let cardSet = CardSet.empty();

    for (const card of cards) {
      cardSet = cardSet.added(card);
    }

    return cardSet;
  }

  /**
   * Parses a string into CardSet.
   *
   * @example
   * ```ts
   * CardSetUtils.parse("AsQhJdKc") === CardSet.from([
   *   new Card(Rank.Ace, Suit.Spade),
   *   new Card(Rank.King, Rank.Club),
   *   new Card(Rank.Queen, Rank.Queen),
   *   new Card(Rank.Jack, Rank.Diamond),
   * ]);  // => true
   *
   * CardSetUtils.parse("") === CardSetUtils.empty;  // => true
   * ```
   */
  static parse(string: string): CardSet {
    let cards = CardSet.empty();

    for (let i = 0; i < string.length; i += 2) {
      try {
        cards = cards.added(Card.parse(string.substring(i, i + 2)));
      } catch (error) {
        throw new Error(
          `\"${string}\".substring(${i}, ${i + 2}) is not a valid CardString.`
        );
      }
    }

    return cards;
  }

  constructor(intValue: number) {
    this.intValue = intValue;
  }

  readonly intValue: number;

  private memoizedSize: number | null = null;

  /**
   * Returns number of cards in a CardSet.
   *
   * @example
   * ```ts
   * const cardSet = CardSet.from([
   *   new Card(Rank.Ace, Suit.Spade),
   *   new Card(Rank.King, Rank.Club),
   *   new Card(Rank.Queen, Rank.Queen),
   *   new Card(Rank.Jack, Rank.Diamond),
   * ]);
   *
   * cardSet.size;             // => 4
   * CardSetUtils.empty.size;  // => 0
   * CardSetUtils.full.size;   // => 52
   * ```
   */
  get size(): number {
    if (this.memoizedSize === null) {
      let size = 0;

      for (const _ of this) {
        size += 1;
      }

      this.memoizedSize = size;
    }

    return this.memoizedSize;
  }

  /**
   * Returns whether a CardSet contains every card in another CardSet.
   *
   * @example
   * ```ts
   * const cardSet = CardSet.from([
   *   new Card(Rank.Ace, Suit.Spade),
   *   new Card(Rank.King, Suit.Club),
   *   new Card(Rank.Queen, Suit.Heart),
   *   new Card(Rank.Jack, Suit.Diamond),
   * ]);
   *
   * cardSet.has(CardSet.from([
   *   new Card(Rank.Ace, Suit.Spade),
   *   new Card(Rank.Queen, Suit.Heart),
   * ]));  // => true
   *
   * cardSet.has(CardSet.from([
   *   new Card(Rank.Ace, Suit.Spade),
   *   new Card(Rank.Ace, Suit.Heart),
   * ]));  // => false
   *
   * cardSet.has(new Card(Rank.Ace, Suit.Spade));  // => true
   *
   * cardSet.has(CardSet.empty());  // => true
   * ```
   */
  has(other: Card | CardSet): boolean {
    const otherInt = BigInt(
      other instanceof CardSet ? other.intValue : cardToInt(other)
    );

    return ((BigInt(this.intValue) & otherInt) ^ otherInt) === 0n;
  }

  /**
   * Returns Card at the index.
   *
   * @example
   * ```ts
   * const cardSet = CardSet.from([
   *   new Card(Rank.Ace, Suit.Spade),
   *   new Card(Rank.King, Suit.Club),
   *   new Card(Rank.Queen, Suit.Heart),
   *   new Card(Rank.Jack, Suit.Diamond),
   * ]);
   *
   * cardSet.at(2);  // => Card<Jd>
   * ```
   */
  at(index: number): Card | null {
    let i = 0;
    for (const card of this) {
      if (i === index) {
        return card;
      }

      i += 1;
    }

    return null;
  }

  /**
   * Returns an union of two CardSets.
   *
   * @example
   * ```ts
   * CardSetUtils.union(
   *   CardSet.from([
   *     new Card(Rank.Ace, Suit.Spade),
   *     new Card(Rank.Queen, Rank.Queen),
   *   ]),
   *   CardSet.from([
   *     new Card(Rank.King, Rank.Club),
   *     new Card(Rank.Jack, Rank.Diamond),
   *   ]),
   * ) === CardSet.from([
   *   new Card(Rank.Ace, Suit.Spade),
   *   new Card(Rank.King, Rank.Club),
   *   new Card(Rank.Queen, Rank.Queen),
   *   new Card(Rank.Jack, Rank.Diamond),
   * ]);
   * ```
   */
  added(other: Card | CardSet): CardSet {
    const otherInt = BigInt(
      other instanceof CardSet ? other.intValue : cardToInt(other)
    );

    return new CardSet(Number(BigInt(this.intValue) | otherInt));
  }

  /**
   * Returns a difference (=relative complement) of two CardSets.
   *
   * @example
   * ```ts
   * CardSet.from([
   *   new Card(Rank.Ace, Suit.Spade),
   *   new Card(Rank.Queen, Rank.Queen),
   * ]).union(
   *   CardSet.from([
   *     new Card(Rank.King, Rank.Club),
   *     new Card(Rank.Jack, Rank.Diamond),
   *   ]),
   * ).equals(
   *   CardSet.from([
   *     new Card(Rank.Ace, Suit.Spade),
   *     new Card(Rank.King, Rank.Club),
   *     new Card(Rank.Queen, Rank.Queen),
   *     new Card(Rank.Jack, Rank.Diamond),
   *   ])
   * );  // => true
   * ```
   */
  removed(other: Card | CardSet): CardSet {
    const otherInt = BigInt(
      other instanceof CardSet ? other.intValue : cardToInt(other)
    );

    return new CardSet(Number(BigInt(this.intValue) & ~BigInt(otherInt)));
  }

  /**
   * Stringify a CardSet.
   *
   * @example
   * ```ts
   * CardSet.from([
   *   new Card(Rank.Ace, Suit.Spade),
   *   new Card(Rank.Queen, Rank.Queen),
   *   new Card(Rank.Jack, Rank.Diamond),
   *   new Card(Rank.King, Rank.Club),
   * ]).format() === "AsQhJdKc";
   * ```
   */
  format(): string {
    const _cards = [...this];

    _cards.sort((a, b) => a.compare(b));

    return _cards.map((c) => c.format()).join("");
  }

  *[Symbol.iterator](): Iterator<Card> {
    let v = BigInt(this.intValue);

    while (v > 0) {
      const cv = v & -v;

      yield intToCard(Number(cv));

      v = v & (v - 1n);
    }
  }
}

function intToCard(index: number): Card {
  let rank!: Rank;
  switch (~~(Math.log2(index) / 4)) {
    case 0:
      rank = Rank.Ace;
      break;
    case 1:
      rank = Rank.King;
      break;
    case 2:
      rank = Rank.Queen;
      break;
    case 3:
      rank = Rank.Jack;
      break;
    case 4:
      rank = Rank.Ten;
      break;
    case 5:
      rank = Rank.Nine;
      break;
    case 6:
      rank = Rank.Eight;
      break;
    case 7:
      rank = Rank.Seven;
      break;
    case 8:
      rank = Rank.Six;
      break;
    case 9:
      rank = Rank.Five;
      break;
    case 10:
      rank = Rank.Four;
      break;
    case 11:
      rank = Rank.Trey;
      break;
    case 12:
      rank = Rank.Deuce;
      break;
  }

  let suit!: Suit;
  switch (Math.log2(index) % 4) {
    case 0:
      suit = Suit.Spade;
      break;
    case 1:
      suit = Suit.Heart;
      break;
    case 2:
      suit = Suit.Diamond;
      break;
    case 3:
      suit = Suit.Club;
      break;
  }

  return new Card(rank, suit);
}

function cardToInt(card: Card) {
  let rankInt!: number;
  switch (card.rank) {
    case Rank.Ace:
      rankInt = 0;
      break;
    case Rank.King:
      rankInt = 1;
      break;
    case Rank.Queen:
      rankInt = 2;
      break;
    case Rank.Jack:
      rankInt = 3;
      break;
    case Rank.Ten:
      rankInt = 4;
      break;
    case Rank.Nine:
      rankInt = 5;
      break;
    case Rank.Eight:
      rankInt = 6;
      break;
    case Rank.Seven:
      rankInt = 7;
      break;
    case Rank.Six:
      rankInt = 8;
      break;
    case Rank.Five:
      rankInt = 9;
      break;
    case Rank.Four:
      rankInt = 10;
      break;
    case Rank.Trey:
      rankInt = 11;
      break;
    case Rank.Deuce:
      rankInt = 12;
      break;
  }

  let suitInt!: number;
  switch (card.suit) {
    case Suit.Spade:
      suitInt = 0;
      break;
    case Suit.Heart:
      suitInt = 1;
      break;
    case Suit.Diamond:
      suitInt = 2;
      break;
    case Suit.Club:
      suitInt = 3;
      break;
  }

  return 2 ** (rankInt * 4 + suitInt);
}
