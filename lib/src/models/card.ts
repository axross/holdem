/**
 *
 */
export type Card = number;

/**
 *
 */
export enum Rank {
  Ace = 0,
  King = 1,
  Queen = 2,
  Jack = 3,
  Ten = 4,
  Nine = 5,
  Eight = 6,
  Seven = 7,
  Six = 8,
  Five = 9,
  Four = 10,
  Three = 11,
  Deuce = 12,
}

export enum Suit {
  Spade = 0,
  Heart = 1,
  Diamond = 2,
  Club = 3,
}

/**
 *
 */
export function stringToCard(value: string): Card {
  return 2 ** (ranks.indexOf(value[0]!) + suits.indexOf(value[1]!) * 13);
}

export function cardToString(value: Card): string {
  return `${ranks[getRank(value)]}${suits[getSuit(value)]}`;
}

export function getRank(card: Card): Rank {
  return Math.log2(card) % 13;
}

export function getSuit(card: Card): Suit {
  return ~~(Math.log2(card) / 13);
}

const ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const suits = ["s", "h", "d", "c"];
