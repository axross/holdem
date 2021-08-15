/**
 * An integer (0 <= n <= 51) that represents a card. 0 is ace of spade.
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
 * Returns a card
 */
export function stringToCard(value: string): Card {
  return 2 ** (rankByString[value[0]!]! + suitByString[value[1]!]! * 13);
}

/**
 *
 */
export function cardToString(value: Card): string {
  return `${stringByRank[cardRank(value)]}${stringBySuit[cardSuit(value)]}`;
}

export function cardRank(card: Card): Rank {
  return Math.log2(card) % 13;
}

export function cardSuit(card: Card): Suit {
  return ~~(Math.log2(card) / 13);
}

const stringByRank: Record<Rank, string> = {
  [Rank.Ace]: "A",
  [Rank.King]: "K",
  [Rank.Queen]: "Q",
  [Rank.Jack]: "J",
  [Rank.Ten]: "T",
  [Rank.Nine]: "9",
  [Rank.Eight]: "8",
  [Rank.Seven]: "7",
  [Rank.Six]: "6",
  [Rank.Five]: "5",
  [Rank.Four]: "4",
  [Rank.Three]: "3",
  [Rank.Deuce]: "2",
};

const rankByString: Record<string, Rank> = {
  A: Rank.Ace,
  K: Rank.King,
  Q: Rank.Queen,
  J: Rank.Jack,
  T: Rank.Ten,
  "9": Rank.Nine,
  "8": Rank.Eight,
  "7": Rank.Seven,
  "6": Rank.Six,
  "5": Rank.Five,
  "4": Rank.Four,
  "3": Rank.Three,
  "2": Rank.Deuce,
};

const stringBySuit: Record<Suit, string> = {
  [Suit.Spade]: "s",
  [Suit.Heart]: "h",
  [Suit.Diamond]: "d",
  [Suit.Club]: "c",
};

const suitByString: Record<string, Suit> = {
  s: Suit.Spade,
  h: Suit.Heart,
  d: Suit.Diamond,
  c: Suit.Club,
};
