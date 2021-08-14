import {
  asFlush,
  asRainbow,
  dpReference,
} from "../constants/precalculated-table";
import { getRank, getSuit, Rank, Suit } from "./card";
import { CardSet, cardSetForEach } from "./card-set";

/**
 * An index of [Cactus Kev's poker hand equivalence enums](http://suffe.cool/poker/7462.html).
 */
export type MadeHand = number;

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

export function getBestMadeHandFrom(cards: CardSet): MadeHand {
  const flushSuit = findFlushSuit(cards);

  if (flushSuit !== null) {
    return asFlush[hashForFlush(cards, flushSuit)]!;
  }

  return asRainbow[hashForRainbow(cards)]!;
}

export function getMadeHandPower(madeHand: MadeHand): number {
  return 7462 - madeHand;
}

export function getMadeHandType(madeHand: MadeHand): MadeHandType {
  if (madeHand > 6185) return "highcard";
  if (madeHand > 3325) return "pair";
  if (madeHand > 2467) return "two-pairs";
  if (madeHand > 1609) return "trips";
  if (madeHand > 1599) return "straight";
  if (madeHand > 322) return "flush";
  if (madeHand > 166) return "full-house";
  if (madeHand > 10) return "quads";

  return "straight-flush";
}

function findFlushSuit(cards: CardSet): Suit | null {
  const suitCount = [0, 0, 0, 0];
  let suit: Suit | null = null;

  cardSetForEach(cards, (card) => {
    suitCount[getSuit(card)] += 1;

    if (suitCount[getSuit(card)]! === 5) {
      suit = getSuit(card);
    }
  });

  return suit;
}

function hashForFlush(cards: CardSet, suit: Suit): number {
  const bitEachRank = [
    0x1000, 0x800, 0x400, 0x200, 0x100, 0x80, 0x40, 0x20, 0x10, 0x8, 0x4, 0x2,
    0x1,
  ];

  let hash = 0;

  cardSetForEach(cards, (card) => {
    if (getSuit(card) === suit) {
      hash += bitEachRank[getRank(card)]!;
    }
  });

  return hash;
}

function hashForRainbow(cards: CardSet): number {
  const cardLengthEachRank = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let remainingCardLength = 0;

  cardSetForEach(cards, (card) => {
    cardLengthEachRank[getRank(card)] += 1;
    remainingCardLength += 1;
  });

  let hash = 0;

  for (const rank of ranks) {
    const length = cardLengthEachRank[rank]!;

    if (length === 0) continue;

    hash += dpReference[length]![rank]![remainingCardLength]!;
    remainingCardLength -= length;

    if (remainingCardLength <= 0) break;
  }

  return hash;
}

const ranks: Rank[] = [
  Rank.Deuce,
  Rank.Three,
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
