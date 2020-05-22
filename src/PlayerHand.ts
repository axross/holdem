import PlayingCard from "./PlayingCard";
import Rank from "./Rank";
import Suit from "./Suit";

export default class PlayerHand {
  constructor({
    holeCards,
    communityCards,
  }: {
    holeCards: PlayingCard[];
    communityCards: PlayingCard[];
  }) {
    if (holeCards.length !== 2) {
      throw new Error(`holeCards must be 2-length array.`);
    }

    if (communityCards.length !== 5) {
      throw new Error(`communityCards must be 5-length array.`);
    }

    this.holeCards = holeCards;
    this.communityCards = communityCards;
  }

  /**
   * the cards that the player holds.
   */
  readonly holeCards: PlayingCard[];

  /**
   * the board cards. those cards are supposed to be shared with other players.
   */
  readonly communityCards: PlayingCard[];

  #cards?: PlayingCard[];
  #type?: PlayerHandType;
  #power?: number;

  /**
   * the cards chosen to make a hand.
   * the first time you access this field, it takes little time to calculate/choose the best hand.
   */
  get cards(): PlayingCard[] {
    if (this.#cards === undefined) {
      this._detect();
    }

    return this.#cards!;
  }

  /**
   * the hand type.
   * the first time you access this field, it takes little time to calculate/choose the best hand.
   */
  get type(): PlayerHandType {
    if (this.#type === undefined) {
      this._detect();
    }

    return this.#type!;
  }

  /**
   * the integer how much this hand is strong.
   * the first time you access this field, it takes little time to calculate/choose the best hand.
   */
  get power(): number {
    if (!this.#cards || this.#type === undefined) {
      this._detect();
    }

    if (this.#power === undefined) {
      this._calculatePower();
    }

    return this.#power!;
  }

  private _calculatePower() {
    if (!this.#cards || this.#type === undefined) {
      throw new Error();
    }

    const isBottomStraight =
      [PlayerHandType.straightFlush, PlayerHandType.straight].includes(
        this.#type
      ) && (this.#cards[0][0] as Rank) == Rank.five;

    this.#power =
      HAND_TYPE_POWER[this.#type] +
      getRankStrongness(this.#cards[0][0] as Rank, { isBottomStraight }) *
        13 ** 4 +
      getRankStrongness(this.#cards[1][0] as Rank, { isBottomStraight }) *
        13 ** 3 +
      getRankStrongness(this.#cards[2][0] as Rank, { isBottomStraight }) *
        13 ** 2 +
      getRankStrongness(this.#cards[3][0] as Rank, { isBottomStraight }) *
        13 ** 1 +
      getRankStrongness(this.#cards[4][0] as Rank, { isBottomStraight }) *
        13 ** 0;
  }

  private _detect() {
    const sortedCards = [...this.holeCards, ...this.communityCards];
    sortedCards.sort((a, b) => {
      if ((a[0] as Rank) === (b[0] as Rank)) {
        return SUIT_PRIORITY[a[1] as Suit] - SUIT_PRIORITY[b[1] as Suit];
      }

      return RANK_PRIORITY[a[0] as Rank] - RANK_PRIORITY[b[0] as Rank];
    });

    const cardsByRank = new Map<Rank, PlayingCard[]>();
    const cardsBySuit = new Map<Suit, PlayingCard[]>();

    for (const card of sortedCards) {
      if (!cardsByRank.has(card[0] as Rank)) {
        cardsByRank.set(card[0] as Rank, []);
      }

      cardsByRank.get(card[0] as Rank)!.push(card);

      if (!cardsBySuit.has(card[1] as Suit)) {
        cardsBySuit.set(card[1] as Suit, []);
      }

      cardsBySuit.get(card[1] as Suit)!.push(card);
    }

    const straightFlush = chooseBestStraightFlush(cardsBySuit);

    if (straightFlush) {
      this.#cards = straightFlush;
      this.#type = PlayerHandType.straightFlush;

      return;
    }

    const fourOfAKind = chooseBestFourOfAKind(cardsByRank);

    if (fourOfAKind) {
      this.#cards = fourOfAKind;
      this.#type = PlayerHandType.fourOfAKind;

      return;
    }

    const fullHouse = chooseBestFullHouse(cardsByRank);

    if (fullHouse) {
      this.#cards = fullHouse;
      this.#type = PlayerHandType.fullHouse;

      return;
    }

    const flush = chooseBestFlush(cardsBySuit);

    if (flush) {
      this.#cards = flush;
      this.#type = PlayerHandType.flush;

      return;
    }

    const straight = chooseBestStraight(cardsByRank);

    if (straight) {
      this.#cards = straight;
      this.#type = PlayerHandType.straight;

      return;
    }

    const threeOfAKind = chooseBestThreeOfAKind(cardsByRank);

    if (threeOfAKind) {
      this.#cards = threeOfAKind;
      this.#type = PlayerHandType.threeOfAKind;

      return;
    }

    const twoPairs = chooseBestTwoPairs(cardsByRank);

    if (twoPairs) {
      this.#cards = twoPairs;
      this.#type = PlayerHandType.twoPairs;

      return;
    }

    const onePair = chooseBestOnePair(cardsByRank);

    if (onePair) {
      this.#cards = onePair;
      this.#type = PlayerHandType.pair;

      return;
    }

    const highCards = chooseBestHighCard(cardsByRank);

    if (!highCards) {
      throw new Error("");
    }

    this.#cards = highCards;
    this.#type = PlayerHandType.highCard;
  }
}

export enum PlayerHandType {
  straightFlush = "STRAIGHT_FLUSH",
  fourOfAKind = "FOUR_OF_A_KIND",
  fullHouse = "FULL_HOUSE",
  flush = "FLUSH",
  straight = "STRAIGHT",
  threeOfAKind = "THREE_OF_A_KIND",
  twoPairs = "TWO_PAIRS",
  pair = "PAIR",
  highCard = "HIGH_CARD",
}

export function chooseBestStraightFlush(
  cardsBySuit: Map<Suit, PlayingCard[]>
): PlayingCard[] | null {
  for (const ranks of STRAIGHT_RANK_COMBINATIONS) {
    for (const cards of cardsBySuit.values()) {
      if (cards.length < 5) {
        continue;
      }

      const chosen = cards.filter((card) => ranks.includes(card[0] as Rank));

      if (chosen.length === 5) {
        return chosen;
      }
    }
  }

  return null;
}

export function chooseBestFourOfAKind(
  cardsByRank: Map<Rank, PlayingCard[]>
): PlayingCard[] | null {
  let fourOfAKind = null;
  let kicker = null;

  for (const cards of cardsByRank.values()) {
    if (!fourOfAKind && cards.length === 4) {
      fourOfAKind = cards;

      continue;
    }

    kicker = kicker ?? cards[0];
  }

  return fourOfAKind && kicker ? [...fourOfAKind, kicker] : null;
}

export function chooseBestFullHouse(
  cardsByRank: Map<Rank, PlayingCard[]>
): PlayingCard[] | null {
  let threeOfAKind = null;
  let pair = null;

  for (const cards of cardsByRank.values()) {
    if (!threeOfAKind && cards.length >= 3) {
      threeOfAKind = cards.slice(0, 3);

      continue;
    }

    if (!pair && cards.length >= 2) {
      pair = cards.slice(0, 2);

      continue;
    }
  }

  return threeOfAKind && pair ? [...threeOfAKind, ...pair] : null;
}

export function chooseBestFlush(
  cardsBySuit: Map<Suit, PlayingCard[]>
): PlayingCard[] | null {
  return (
    [...cardsBySuit.values()].find((cards) => cards.length >= 5)?.slice(0, 5) ??
    null
  );
}

export function chooseBestStraight(
  cardsByRank: Map<Rank, PlayingCard[]>
): PlayingCard[] | null {
  if (cardsByRank.size < 5) {
    return null;
  }

  for (const ranks of STRAIGHT_RANK_COMBINATIONS) {
    if (ranks.every((rank) => cardsByRank.has(rank))) {
      return [
        cardsByRank.get(ranks[0])![0],
        cardsByRank.get(ranks[1])![0],
        cardsByRank.get(ranks[2])![0],
        cardsByRank.get(ranks[3])![0],
        cardsByRank.get(ranks[4])![0],
      ];
    }
  }

  return null;
}

export function chooseBestThreeOfAKind(
  cardsByRank: Map<Rank, PlayingCard[]>
): PlayingCard[] | null {
  let threeOfAKind = null;
  let kicker1 = null;
  let kicker2 = null;

  for (const cards of cardsByRank.values()) {
    if (!threeOfAKind && cards.length >= 3) {
      threeOfAKind = cards.slice(0, 3);

      continue;
    }

    if (!kicker1) {
      kicker1 = cards[0];

      continue;
    }

    kicker2 = kicker2 ?? cards[0];
  }

  return threeOfAKind && kicker1 && kicker2
    ? [...threeOfAKind, kicker1, kicker2]
    : null;
}

export function chooseBestTwoPairs(
  cardsByRank: Map<Rank, PlayingCard[]>
): PlayingCard[] | null {
  let pair1 = null;
  let pair2 = null;
  let kicker = null;

  for (const cards of cardsByRank.values()) {
    if (!pair1 && cards.length >= 2) {
      pair1 = cards.slice(0, 2);

      continue;
    }

    if (!pair2 && cards.length >= 2) {
      pair2 = cards.slice(0, 2);

      continue;
    }

    kicker = kicker ?? cards[0];
  }

  return pair1 && pair2 && kicker ? [...pair1, ...pair2, kicker] : null;
}

export function chooseBestOnePair(
  cardsByRank: Map<Rank, PlayingCard[]>
): PlayingCard[] | null {
  let pair = null;
  let kicker1 = null;
  let kicker2 = null;
  let kicker3 = null;

  for (const cards of cardsByRank.values()) {
    if (!pair && cards.length >= 2) {
      pair = cards.slice(0, 2);

      continue;
    }

    if (!kicker1) {
      kicker1 = cards[0];

      continue;
    }

    if (!kicker2) {
      kicker2 = cards[0];

      continue;
    }

    kicker3 = kicker3 ?? cards[0];
  }

  return pair && kicker1 && kicker2 && kicker3
    ? [...pair, kicker1, kicker2, kicker3]
    : null;
}

export function chooseBestHighCard(
  cardsByRank: Map<Rank, PlayingCard[]>
): PlayingCard[] | null {
  const highcards = [];

  for (const cards of cardsByRank.values()) {
    if (highcards.length === 5) {
      break;
    }

    highcards.push(cards[0]);
  }

  return highcards.length === 5 ? highcards : null;
}

export function getRankStrongness(
  rank: Rank,
  { isBottomStraight = false }: { isBottomStraight?: boolean } = {}
): number {
  switch (rank) {
    case Rank.ace:
      return isBottomStraight ? 0 : 13;
    case Rank.deuce:
      return 1;
    case Rank.three:
      return 2;
    case Rank.four:
      return 3;
    case Rank.five:
      return 4;
    case Rank.six:
      return 5;
    case Rank.seven:
      return 6;
    case Rank.eight:
      return 7;
    case Rank.nine:
      return 8;
    case Rank.ten:
      return 9;
    case Rank.jack:
      return 10;
    case Rank.queen:
      return 11;
    case Rank.king:
      return 12;
  }
}

const HAND_TYPE_POWER = {
  [PlayerHandType.straightFlush]: 13 ** 5 * 9,
  [PlayerHandType.fourOfAKind]: 13 ** 5 * 8,
  [PlayerHandType.fullHouse]: 13 ** 5 * 7,
  [PlayerHandType.flush]: 13 ** 5 * 6,
  [PlayerHandType.straight]: 13 ** 5 * 5,
  [PlayerHandType.threeOfAKind]: 13 ** 5 * 4,
  [PlayerHandType.twoPairs]: 13 ** 5 * 3,
  [PlayerHandType.pair]: 13 ** 5 * 2,
  [PlayerHandType.highCard]: 13 ** 5,
};

const STRAIGHT_RANK_COMBINATIONS = [
  [Rank.ace, Rank.king, Rank.queen, Rank.jack, Rank.ten],
  [Rank.king, Rank.queen, Rank.jack, Rank.ten, Rank.nine],
  [Rank.queen, Rank.jack, Rank.ten, Rank.nine, Rank.eight],
  [Rank.jack, Rank.ten, Rank.nine, Rank.eight, Rank.seven],
  [Rank.ten, Rank.nine, Rank.eight, Rank.seven, Rank.six],
  [Rank.nine, Rank.eight, Rank.seven, Rank.six, Rank.five],
  [Rank.eight, Rank.seven, Rank.six, Rank.five, Rank.four],
  [Rank.seven, Rank.six, Rank.five, Rank.four, Rank.three],
  [Rank.six, Rank.five, Rank.four, Rank.three, Rank.deuce],
  [Rank.five, Rank.four, Rank.three, Rank.deuce, Rank.ace],
];

const RANK_PRIORITY = {
  [Rank.ace]: 0,
  [Rank.king]: 1,
  [Rank.queen]: 2,
  [Rank.jack]: 3,
  [Rank.ten]: 4,
  [Rank.nine]: 5,
  [Rank.eight]: 6,
  [Rank.seven]: 7,
  [Rank.six]: 8,
  [Rank.five]: 9,
  [Rank.four]: 10,
  [Rank.three]: 11,
  [Rank.deuce]: 12,
};

const SUIT_PRIORITY = {
  [Suit.spade]: 0,
  [Suit.heart]: 1,
  [Suit.diamond]: 2,
  [Suit.club]: 3,
};
