import { Card, cardToString, stringToCard } from "./card";

/**
 *
 */
export type CardSet = bigint;

export const FULL_DECK = 4503599627370495n;

/**
 *
 */
export function cardSetAdded(
  cardsA: Card | CardSet,
  cardsB: Card | CardSet
): CardSet {
  return BigInt(cardsA) | BigInt(cardsB);
}

/**
 *
 */
export function cardSetRemoved(
  cardsA: Card | CardSet,
  cardsB: Card | CardSet
): CardSet {
  return BigInt(cardsA) & ~BigInt(cardsB);
}

/**
 *
 */
export function cardSetForEach(
  cards: CardSet,
  callback: (card: Card) => void
): void {
  while (cards > 0) {
    const card = cards & -cards;

    callback(Number(card));

    cards &= cards - 1n;
  }
}

/**
 *
 */
export function stringToCardSet(value: string): CardSet {
  let cards: CardSet = 0n;

  for (let i = 0; i < value.length; i += 2) {
    cards = cardSetAdded(cards, stringToCard(value.substring(i, i + 2)));
  }

  return cards;
}

/**
 *
 */
export function cardSetToString(value: CardSet): string {
  let string = "";

  cardSetForEach(value, (card) => {
    string += cardToString(card);
  });

  return string;
}

/**
 *
 */
export function cardSetHas(a: CardSet, b: Card | CardSet): boolean {
  return ((a & BigInt(b)) ^ a) === 0n || ((a & BigInt(b)) ^ BigInt(b)) === 0n;
}

export function cardSetSize(cards: CardSet): number {
  let size = 0;

  cardSetForEach(cards, (_) => {
    size += 1;
  });

  return size;
}
