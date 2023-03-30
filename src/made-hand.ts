import { CardUtils } from "./card";
import { CardSet, CardSetUtils } from "./card-set";
import { asFlush, asRainbow, dpReference } from "./precalculated-table";
import { Rank, ranksInOrder } from "./rank";
import { Suit, suitsInOrder } from "./suit";

/**
 * An index of [Cactus Kev's poker hand equivalence enums](http://suffe.cool/poker/7462.html).
 */
export type MadeHand = number & {
  __MadeHandBrand: never;
};

export type MadeHandType =
  | "highcard"
  | "pair"
  | "two-pairs"
  | "trips"
  | "straight"
  | "flush"
  | "full-house"
  | "quads"
  | "straight-flush";

export const MadeHandUtils = Object.freeze({
  /**
   *
   */
  findBestFrom(cards: CardSet): MadeHand {
    const flushSuit = findFlushSuit(cards);

    if (flushSuit !== null) {
      return asFlush[hashForFlush(cards, flushSuit)]! as MadeHand;
    }

    return asRainbow[hashForRainbow(cards)]! as MadeHand;
  },

  /**
   *
   */
  power(madeHand: MadeHand): number {
    return 7462 - madeHand;
  },

  /**
   *
   */
  type(madeHand: MadeHand): MadeHandType {
    if (madeHand > 6185) return "highcard";
    if (madeHand > 3325) return "pair";
    if (madeHand > 2467) return "two-pairs";
    if (madeHand > 1609) return "trips";
    if (madeHand > 1599) return "straight";
    if (madeHand > 322) return "flush";
    if (madeHand > 166) return "full-house";
    if (madeHand > 10) return "quads";

    return "straight-flush";
  },
});

function findFlushSuit(cards: CardSet): Suit | null {
  const suitCount = [0, 0, 0, 0];
  let suit: Suit | null = null;

  for (const card of CardSetUtils.iterate(cards)) {
    suitCount[suitsInOrder.indexOf(CardUtils.suitOf(card))] += 1;

    if (suitCount[suitsInOrder.indexOf(CardUtils.suitOf(card))]! === 5) {
      suit = CardUtils.suitOf(card);
    }
  }

  return suit;
}

function hashForFlush(cards: CardSet, suit: Suit): number {
  let hash = 0;

  for (const card of CardSetUtils.iterate(cards)) {
    if (CardUtils.suitOf(card) === suit) {
      hash += bitEachRank[ranksInOrder.indexOf(CardUtils.rankOf(card))]!;
    }
  }

  return hash;
}

const bitEachRank = [
  0x1000, 0x1, 0x2, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80, 0x100, 0x200, 0x400,
  0x800,
];

function hashForRainbow(cards: CardSet): number {
  const cardLengthEachRank = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let remainingCardLength = 0;

  for (const card of CardSetUtils.iterate(cards)) {
    cardLengthEachRank[ranksInOrder.indexOf(CardUtils.rankOf(card))] += 1;
    remainingCardLength += 1;
  }

  let hash = 0;

  for (const rank of ranks) {
    const length = cardLengthEachRank[ranksInOrder.indexOf(rank)]!;

    if (length === 0) continue;

    hash += dpReference[length]![rank]![remainingCardLength]!;
    remainingCardLength -= length;

    if (remainingCardLength <= 0) break;
  }

  return hash;
}

const ranks: Rank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];
