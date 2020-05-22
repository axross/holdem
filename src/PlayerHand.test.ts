import { describe, expect, it } from "@jest/globals";
import PlayingCard from "./PlayingCard";
import PlayerHand, {
  chooseBestStraightFlush,
  chooseBestFourOfAKind,
  chooseBestFullHouse,
  chooseBestFlush,
  chooseBestStraight,
  chooseBestThreeOfAKind,
  chooseBestTwoPairs,
  chooseBestOnePair,
  chooseBestHighCard,
  PlayerHandType,
} from "./PlayerHand";
import Rank from "./Rank";
import Suit from "./Suit";

describe("PlayerHand", () => {
  it("#cards are the chosen ones to make it hand", () => {
    expect(
      new PlayerHand({
        holeCards: [PlayingCard.threeSpade, PlayingCard.deuceSpade],
        communityCards: [
          PlayingCard.aceSpade,
          PlayingCard.kingDiamond,
          PlayingCard.sixSpade,
          PlayingCard.fiveSpade,
          PlayingCard.fourSpade,
        ],
      }).cards
    ).toEqual([
      PlayingCard.sixSpade,
      PlayingCard.fiveSpade,
      PlayingCard.fourSpade,
      PlayingCard.threeSpade,
      PlayingCard.deuceSpade,
    ]);

    expect(
      new PlayerHand({
        holeCards: [PlayingCard.aceSpade, PlayingCard.kingSpade],
        communityCards: [
          PlayingCard.kingHeart,
          PlayingCard.kingDiamond,
          PlayingCard.sixSpade,
          PlayingCard.fiveSpade,
          PlayingCard.fourSpade,
        ],
      }).cards
    ).toEqual([
      PlayingCard.aceSpade,
      PlayingCard.kingSpade,
      PlayingCard.sixSpade,
      PlayingCard.fiveSpade,
      PlayingCard.fourSpade,
    ]);

    expect(
      new PlayerHand({
        holeCards: [PlayingCard.aceSpade, PlayingCard.deuceSpade],
        communityCards: [
          PlayingCard.kingDiamond,
          PlayingCard.nineSpade,
          PlayingCard.fiveHeart,
          PlayingCard.fourSpade,
          PlayingCard.threeSpade,
        ],
      }).cards
    ).toEqual([
      PlayingCard.aceSpade,
      PlayingCard.nineSpade,
      PlayingCard.fourSpade,
      PlayingCard.threeSpade,
      PlayingCard.deuceSpade,
    ]);

    expect(
      new PlayerHand({
        holeCards: [PlayingCard.sevenHeart, PlayingCard.sixHeart],
        communityCards: [
          PlayingCard.aceDiamond,
          PlayingCard.fiveHeart,
          PlayingCard.fourSpade,
          PlayingCard.threeSpade,
          PlayingCard.deuceHeart,
        ],
      }).cards
    ).toEqual([
      PlayingCard.sevenHeart,
      PlayingCard.sixHeart,
      PlayingCard.fiveHeart,
      PlayingCard.fourSpade,
      PlayingCard.threeSpade,
    ]);
  });

  it("#type is an enum value that shows its type", () => {
    expect(
      new PlayerHand({
        holeCards: [PlayingCard.threeSpade, PlayingCard.deuceSpade],
        communityCards: [
          PlayingCard.kingHeart,
          PlayingCard.kingDiamond,
          PlayingCard.sixSpade,
          PlayingCard.fiveSpade,
          PlayingCard.fourSpade,
        ],
      }).type
    ).toBe(PlayerHandType.straightFlush);

    expect(
      new PlayerHand({
        holeCards: [PlayingCard.aceSpade, PlayingCard.kingSpade],
        communityCards: [
          PlayingCard.kingHeart,
          PlayingCard.kingDiamond,
          PlayingCard.sixSpade,
          PlayingCard.fiveSpade,
          PlayingCard.fourSpade,
        ],
      }).type
    ).toBe(PlayerHandType.flush);

    expect(
      new PlayerHand({
        holeCards: [PlayingCard.aceSpade, PlayingCard.deuceSpade],
        communityCards: [
          PlayingCard.kingDiamond,
          PlayingCard.nineSpade,
          PlayingCard.fiveHeart,
          PlayingCard.fourSpade,
          PlayingCard.threeSpade,
        ],
      }).type
    ).toBe(PlayerHandType.flush);

    expect(
      new PlayerHand({
        holeCards: [PlayingCard.sevenHeart, PlayingCard.sixHeart],
        communityCards: [
          PlayingCard.kingDiamond,
          PlayingCard.nineSpade,
          PlayingCard.fiveHeart,
          PlayingCard.fourSpade,
          PlayingCard.threeSpade,
        ],
      }).type
    ).toBe(PlayerHandType.straight);
  });

  it("#power is comparable that indicates its strongness", () => {
    expect(
      new PlayerHand({
        holeCards: [PlayingCard.threeSpade, PlayingCard.deuceSpade],
        communityCards: [
          PlayingCard.kingHeart,
          PlayingCard.kingDiamond,
          PlayingCard.sixSpade,
          PlayingCard.fiveSpade,
          PlayingCard.fourSpade,
        ],
      }).power
    ).toBeGreaterThan(
      new PlayerHand({
        holeCards: [PlayingCard.aceSpade, PlayingCard.kingSpade],
        communityCards: [
          PlayingCard.kingHeart,
          PlayingCard.kingDiamond,
          PlayingCard.sixSpade,
          PlayingCard.fiveSpade,
          PlayingCard.fourSpade,
        ],
      }).power
    );

    expect(
      new PlayerHand({
        holeCards: [PlayingCard.aceSpade, PlayingCard.deuceSpade],
        communityCards: [
          PlayingCard.kingDiamond,
          PlayingCard.nineSpade,
          PlayingCard.fiveHeart,
          PlayingCard.fourSpade,
          PlayingCard.threeSpade,
        ],
      }).power
    ).toBeGreaterThan(
      new PlayerHand({
        holeCards: [PlayingCard.sevenHeart, PlayingCard.sixHeart],
        communityCards: [
          PlayingCard.kingDiamond,
          PlayingCard.nineSpade,
          PlayingCard.fiveHeart,
          PlayingCard.fourSpade,
          PlayingCard.threeSpade,
        ],
      }).power
    );
  });
});

describe("chooseBestStraightFlush", () => {
  it.each([
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.kingSpade,
        PlayingCard.queenSpade,
        PlayingCard.jackSpade,
        PlayingCard.tenSpade,
        PlayingCard.nineSpade,
        PlayingCard.eightSpade,
      ],
      [
        PlayingCard.aceSpade,
        PlayingCard.kingSpade,
        PlayingCard.queenSpade,
        PlayingCard.jackSpade,
        PlayingCard.tenSpade,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.kingClub,
        PlayingCard.queenSpade,
        PlayingCard.jackSpade,
        PlayingCard.tenSpade,
        PlayingCard.nineSpade,
        PlayingCard.eightSpade,
      ],
      [
        PlayingCard.queenSpade,
        PlayingCard.jackSpade,
        PlayingCard.tenSpade,
        PlayingCard.nineSpade,
        PlayingCard.eightSpade,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.queenSpade,
        PlayingCard.jackSpade,
        PlayingCard.tenSpade,
        PlayingCard.nineSpade,
        PlayingCard.eightSpade,
        PlayingCard.sevenSpade,
      ],
      [
        PlayingCard.queenSpade,
        PlayingCard.jackSpade,
        PlayingCard.tenSpade,
        PlayingCard.nineSpade,
        PlayingCard.eightSpade,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.queenClub,
        PlayingCard.jackDiamond,
        PlayingCard.tenSpade,
        PlayingCard.nineSpade,
        PlayingCard.eightSpade,
        PlayingCard.sevenSpade,
      ],
      null,
    ],
  ])(`(%p) returns %p`, (input, expected) => {
    const { cardsBySuit } = buildCards(input);

    expect(chooseBestStraightFlush(cardsBySuit)).toEqual(expected);
  });
});

describe("chooseBestFourOfAKind", () => {
  it.each([
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
        PlayingCard.aceClub,
        PlayingCard.kingSpade,
        PlayingCard.queenSpade,
        PlayingCard.jackSpade,
      ],
      [
        PlayingCard.aceSpade,
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
        PlayingCard.aceClub,
        PlayingCard.kingSpade,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingDiamond,
        PlayingCard.kingClub,
      ],
      [
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingDiamond,
        PlayingCard.kingClub,
        PlayingCard.aceSpade,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
        PlayingCard.kingHeart,
        PlayingCard.kingClub,
        PlayingCard.kingDiamond,
        PlayingCard.queenDiamond,
      ],
      null,
    ],
  ])(`(%s) returns %s`, (input, expected) => {
    const { cardsByRank } = buildCards(input);

    expect(chooseBestFourOfAKind(cardsByRank)).toEqual(expected);
  });
});

describe("chooseBestFullHouse", () => {
  it.each([
    [
      [
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingDiamond,
        PlayingCard.queenSpade,
        PlayingCard.queenHeart,
      ],
      [
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingDiamond,
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingClub,
        PlayingCard.queenSpade,
        PlayingCard.jackHeart,
        PlayingCard.jackDiamond,
      ],
      [
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingClub,
        PlayingCard.jackHeart,
        PlayingCard.jackDiamond,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.aceHeart,
        PlayingCard.aceClub,
        PlayingCard.kingHeart,
        PlayingCard.queenSpade,
        PlayingCard.jackHeart,
        PlayingCard.eightSpade,
      ],
      null,
    ],
    [
      [
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingClub,
        PlayingCard.tenHeart,
        PlayingCard.nineSpade,
        PlayingCard.fiveDiamond,
      ],
      null,
    ],
  ])(`(%s) returns %s`, (input, expected) => {
    const { cardsByRank } = buildCards(input);

    expect(chooseBestFullHouse(cardsByRank)).toEqual(expected);
  });
});

describe("chooseBestFlush", () => {
  it.each([
    [
      [
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.queenHeart,
        PlayingCard.jackHeart,
        PlayingCard.tenHeart,
      ],
      [
        PlayingCard.aceHeart,
        PlayingCard.kingHeart,
        PlayingCard.queenHeart,
        PlayingCard.jackHeart,
        PlayingCard.tenHeart,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.kingSpade,
        PlayingCard.jackDiamond,
        PlayingCard.eightSpade,
        PlayingCard.sevenClub,
        PlayingCard.sixSpade,
        PlayingCard.deuceSpade,
      ],
      [
        PlayingCard.aceSpade,
        PlayingCard.kingSpade,
        PlayingCard.eightSpade,
        PlayingCard.sixSpade,
        PlayingCard.deuceSpade,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.aceHeart,
        PlayingCard.kingHeart,
        PlayingCard.kingClub,
        PlayingCard.queenSpade,
        PlayingCard.queenDiamond,
        PlayingCard.jackHeart,
      ],
      null,
    ],
  ])(`(%s) returns %s`, (input, expected) => {
    const { cardsBySuit } = buildCards(input);

    expect(chooseBestFlush(cardsBySuit)).toEqual(expected);
  });
});

describe("chooseBestStraight", () => {
  it.each([
    [
      [
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.queenHeart,
        PlayingCard.jackHeart,
        PlayingCard.tenHeart,
      ],
      [
        PlayingCard.aceHeart,
        PlayingCard.kingSpade,
        PlayingCard.queenHeart,
        PlayingCard.jackHeart,
        PlayingCard.tenHeart,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.jackDiamond,
        PlayingCard.tenClub,
        PlayingCard.nineDiamond,
        PlayingCard.eightSpade,
        PlayingCard.sevenClub,
        PlayingCard.sixSpade,
      ],
      [
        PlayingCard.jackDiamond,
        PlayingCard.tenClub,
        PlayingCard.nineDiamond,
        PlayingCard.eightSpade,
        PlayingCard.sevenClub,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.aceHeart,
        PlayingCard.kingHeart,
        PlayingCard.kingClub,
        PlayingCard.queenSpade,
        PlayingCard.queenDiamond,
        PlayingCard.jackHeart,
      ],
      null,
    ],
  ])(`(%s) returns %s`, (input, expected) => {
    const { cardsByRank } = buildCards(input);

    expect(chooseBestStraight(cardsByRank)).toEqual(expected);
  });
});

describe("chooseBestThreeOfAKind", () => {
  it.each([
    [
      [
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingDiamond,
        PlayingCard.queenSpade,
        PlayingCard.queenHeart,
      ],
      [
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingDiamond,
        PlayingCard.aceHeart,
        PlayingCard.queenSpade,
      ],
    ],
    [
      [
        PlayingCard.aceSpade,
        PlayingCard.aceHeart,
        PlayingCard.aceClub,
        PlayingCard.kingHeart,
        PlayingCard.queenSpade,
        PlayingCard.jackHeart,
        PlayingCard.eightSpade,
      ],
      [
        PlayingCard.aceSpade,
        PlayingCard.aceHeart,
        PlayingCard.aceClub,
        PlayingCard.kingHeart,
        PlayingCard.queenSpade,
      ],
    ],
    [
      [
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingClub,
        PlayingCard.tenHeart,
        PlayingCard.nineSpade,
        PlayingCard.fiveDiamond,
      ],
      [
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingClub,
        PlayingCard.aceDiamond,
        PlayingCard.tenHeart,
      ],
    ],
    [
      [
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.queenSpade,
        PlayingCard.queenHeart,
        PlayingCard.jackClub,
      ],
      null,
    ],
  ])(`(%s) returns %s`, (input, expected) => {
    const { cardsByRank } = buildCards(input);

    expect(chooseBestThreeOfAKind(cardsByRank)).toEqual(expected);
  });
});

describe("chooseBestTwoPairs", () => {
  it.each([
    [
      [
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingDiamond,
        PlayingCard.queenSpade,
        PlayingCard.queenHeart,
      ],
      [
        PlayingCard.aceHeart,
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.queenSpade,
      ],
    ],
    [
      [
        PlayingCard.kingSpade,
        PlayingCard.tenSpade,
        PlayingCard.tenHeart,
        PlayingCard.nineDiamond,
        PlayingCard.eightSpade,
        PlayingCard.eightDiamond,
        PlayingCard.fiveHeart,
      ],
      [
        PlayingCard.tenSpade,
        PlayingCard.tenHeart,
        PlayingCard.eightSpade,
        PlayingCard.eightDiamond,
        PlayingCard.kingSpade,
      ],
    ],
    [
      [
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingClub,
        PlayingCard.tenHeart,
        PlayingCard.nineSpade,
        PlayingCard.fiveDiamond,
      ],
      null,
    ],
  ])(`(%s) returns %s`, (input, expected) => {
    const { cardsByRank } = buildCards(input);

    expect(chooseBestTwoPairs(cardsByRank)).toEqual(expected);
  });
});

describe("chooseBestOnePair", () => {
  it.each([
    [
      [
        PlayingCard.kingSpade,
        PlayingCard.tenSpade,
        PlayingCard.tenHeart,
        PlayingCard.nineDiamond,
        PlayingCard.eightSpade,
        PlayingCard.eightDiamond,
        PlayingCard.fiveHeart,
      ],
      [
        PlayingCard.tenSpade,
        PlayingCard.tenHeart,
        PlayingCard.kingSpade,
        PlayingCard.nineDiamond,
        PlayingCard.eightSpade,
      ],
    ],
    [
      [
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingClub,
        PlayingCard.tenHeart,
        PlayingCard.nineSpade,
        PlayingCard.fiveDiamond,
      ],
      [
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.aceDiamond,
        PlayingCard.tenHeart,
        PlayingCard.nineSpade,
      ],
    ],
    [
      [
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.tenHeart,
        PlayingCard.nineSpade,
        PlayingCard.fiveSpade,
        PlayingCard.fourSpade,
        PlayingCard.threeSpade,
      ],
      null,
    ],
  ])(`(%s) returns %s`, (input, expected) => {
    const { cardsByRank } = buildCards(input);

    expect(chooseBestOnePair(cardsByRank)).toEqual(expected);
  });
});

describe("chooseBestHighCard", () => {
  it.each([
    [
      [
        PlayingCard.kingSpade,
        PlayingCard.tenSpade,
        PlayingCard.tenHeart,
        PlayingCard.nineDiamond,
        PlayingCard.eightSpade,
        PlayingCard.eightDiamond,
        PlayingCard.fiveHeart,
      ],
      [
        PlayingCard.kingSpade,
        PlayingCard.tenSpade,
        PlayingCard.nineDiamond,
        PlayingCard.eightSpade,
        PlayingCard.fiveHeart,
      ],
    ],
    [
      [
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.kingHeart,
        PlayingCard.kingClub,
        PlayingCard.tenHeart,
        PlayingCard.nineSpade,
        PlayingCard.fiveDiamond,
      ],
      [
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.tenHeart,
        PlayingCard.nineSpade,
        PlayingCard.fiveDiamond,
      ],
    ],
    [
      [
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.tenHeart,
        PlayingCard.nineSpade,
        PlayingCard.fiveSpade,
        PlayingCard.fourSpade,
        PlayingCard.threeSpade,
      ],
      [
        PlayingCard.aceDiamond,
        PlayingCard.kingSpade,
        PlayingCard.tenHeart,
        PlayingCard.nineSpade,
        PlayingCard.fiveSpade,
      ],
    ],
  ])(`(%s) returns %s`, (input, expected) => {
    const { cardsByRank } = buildCards(input);

    expect(chooseBestHighCard(cardsByRank)).toEqual(expected);
  });
});

function buildCards(
  cards: PlayingCard[]
): {
  cardsByRank: Map<Rank, PlayingCard[]>;
  cardsBySuit: Map<Suit, PlayingCard[]>;
} {
  const cardsByRank = new Map<Rank, PlayingCard[]>();
  const cardsBySuit = new Map<Suit, PlayingCard[]>();

  for (const card of cards) {
    if (!cardsByRank.has(card[0] as Rank)) {
      cardsByRank.set(card[0] as Rank, []);
    }

    cardsByRank.get(card[0] as Rank)!.push(card);

    if (!cardsBySuit.has(card[1] as Suit)) {
      cardsBySuit.set(card[1] as Suit, []);
    }

    cardsBySuit.get(card[1] as Suit)!.push(card);
  }

  return { cardsBySuit, cardsByRank };
}
