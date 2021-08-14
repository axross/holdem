import { Card, cardToString, stringToCard } from "./card";

/**
 *
 */
export type CardSet = bigint;

export const FULL_DECK = 4503599627370495n;

/**
 *
 */
export function cardSetUnion(
  cardsA: Card | CardSet,
  cardsB: Card | CardSet
): CardSet {
  return BigInt(cardsA) + BigInt(cardsB);
}

/**
 *
 */
export function cardSetDifference(
  cardsA: Card | CardSet,
  cardsB: Card | CardSet
): CardSet {
  return BigInt(cardsA) - BigInt(cardsB);
}

/**
 *
 */
export function cardSetForEach(
  cards: CardSet,
  callback: (card: Card) => void
): void {
  for (let i = 0; i < 52; ++i) {
    const card = 2 ** i;

    if (!cardSetHas(cards, card)) continue;

    callback(card);
  }
}

/**
 *
 */
export function stringToCardSet(value: string): CardSet {
  let cards: CardSet = 0n;

  for (let i = 0; i < value.length; i += 2) {
    cards = cardSetUnion(cards, stringToCard(value.substring(i, i + 2)));
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
  return (a & BigInt(b)) === a || (a & BigInt(b)) === BigInt(b);
}

export function cardSetSize(cardSet: CardSet): number {
  let size = 0;

  cardSetForEach(cardSet, (_) => {
    size += 1;
  });

  return size;
}
