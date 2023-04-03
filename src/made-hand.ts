import { CardSet } from "./card-set";
import { asFlush, asRainbow, dpReference } from "./precalculated-table";
import { Rank } from "./rank";
import { Suit } from "./suit";

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

/**
 * The final hand that player made at showdown.
 */
export class MadeHand {
  /**
   * Returns the MadeHand with the highest power index.
   */
  static findBestFrom(cards: CardSet): MadeHand {
    const flushSuit = findFlushSuit(cards);

    if (flushSuit !== null) {
      return new MadeHand(asFlush[hashForFlush(cards, flushSuit)]!);
    }

    return new MadeHand(asRainbow[hashForRainbow(cards)]!);
  }

  private constructor(powerIndex: number) {
    this.powerIndex = powerIndex;
  }

  /**
   * The power index of the MadeHand. `0` is the strongest (the top straight flush), `7462` is the worst trash hand.
   */
  readonly powerIndex: number;

  /**
   * The type of MadeHand.
   */
  get type(): MadeHandType {
    if (this.powerIndex > 6185) return "highcard";
    if (this.powerIndex > 3325) return "pair";
    if (this.powerIndex > 2467) return "two-pairs";
    if (this.powerIndex > 1609) return "trips";
    if (this.powerIndex > 1599) return "straight";
    if (this.powerIndex > 322) return "flush";
    if (this.powerIndex > 166) return "full-house";
    if (this.powerIndex > 10) return "quads";

    return "straight-flush";
  }
}

function findFlushSuit(cards: CardSet): Suit | null {
  const suitCount = [0, 0, 0, 0];
  let suit: Suit | null = null;

  for (const card of cards) {
    suitCount[suitsInOrder.indexOf(card.suit)] += 1;

    if (suitCount[suitsInOrder.indexOf(card.suit)]! === 5) {
      suit = card.suit;
    }
  }

  return suit;
}

function hashForFlush(cards: CardSet, suit: Suit): number {
  let hash = 0;

  for (const card of cards) {
    if (card.suit === suit) {
      hash += bitEachRank[ranksInOrder.indexOf(card.rank)]!;
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

  for (const card of cards) {
    cardLengthEachRank[ranksInOrder.indexOf(card.rank)] += 1;
    remainingCardLength += 1;
  }

  let hash = 0;

  for (const rank of ranks) {
    const length = cardLengthEachRank[ranksInOrder.indexOf(rank)]!;

    if (length === 0) continue;

    hash += dpReference[length]!.get(rank)![remainingCardLength]!;
    remainingCardLength -= length;

    if (remainingCardLength <= 0) break;
  }

  return hash;
}

const ranksInOrder: Rank[] = [
  Rank.Ace,
  Rank.Deuce,
  Rank.Trey,
  Rank.Four,
  Rank.Five,
  Rank.Six,
  Rank.Seven,
  Rank.Eight,
  Rank.Nine,
  Rank.Ten,
  Rank.Jack,
  Rank.Queen,
  Rank.King,
];

const suitsInOrder: Suit[] = [Suit.Spade, Suit.Heart, Suit.Diamond, Suit.Club];

const ranks: Rank[] = [
  Rank.Deuce,
  Rank.Trey,
  Rank.Four,
  Rank.Five,
  Rank.Six,
  Rank.Seven,
  Rank.Eight,
  Rank.Nine,
  Rank.Ten,
  Rank.Jack,
  Rank.Queen,
  Rank.King,
  Rank.Ace,
];
