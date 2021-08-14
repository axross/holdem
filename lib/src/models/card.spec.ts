import {
  cardToString,
  getRank,
  getSuit,
  Rank,
  stringToCard,
  Suit,
} from "./card";

describe("stringToCard()", () => {
  it.concurrent.each([
    [2 ** 0, "As"],
    [2 ** 1, "Ks"],
    [2 ** 12, "2s"],
    [2 ** 13, "Ah"],
    [2 ** 14, "Kh"],
    [2 ** 25, "2h"],
    [2 ** 26, "Ad"],
    [2 ** 27, "Kd"],
    [2 ** 38, "2d"],
    [2 ** 39, "Ac"],
    [2 ** 40, "Kc"],
    [2 ** 41, "Qc"],
    [2 ** 51, "2c"],
  ])("returns %i when the given value is %s", (expected, value) => {
    expect(stringToCard(value)).toBe(expected);
  });
});

describe("cardToString()", () => {
  it.concurrent.each([
    ["As", 2 ** 0],
    ["Ks", 2 ** 1],
    ["2s", 2 ** 12],
    ["Ah", 2 ** 13],
    ["Kh", 2 ** 14],
    ["2h", 2 ** 25],
    ["Ad", 2 ** 26],
    ["Kd", 2 ** 27],
    ["2d", 2 ** 38],
    ["Ac", 2 ** 39],
    ["Kc", 2 ** 40],
    ["Qc", 2 ** 41],
    ["2c", 2 ** 51],
  ])("returns %s when the given value is %s", (expected, value) => {
    expect(cardToString(value)).toBe(expected);
  });
});

describe("getRank()", () => {
  it.concurrent.each([
    [Rank.Ace, "As"],
    [Rank.Deuce, "2s"],
    [Rank.King, "Ks"],
    [Rank.Ace, "Ah"],
    [Rank.Deuce, "2h"],
    [Rank.King, "Kh"],
    [Rank.Ace, "Ad"],
    [Rank.Deuce, "2d"],
    [Rank.King, "Kd"],
    [Rank.Ace, "Ac"],
    [Rank.Deuce, "2c"],
    [Rank.Queen, "Qc"],
    [Rank.King, "Kc"],
  ])("returns %s when the given value is %s", (expected, value) => {
    expect(getRank(stringToCard(value))).toBe(expected);
  });
});

describe("getSuit()", () => {
  it.concurrent.each([
    [Suit.Spade, "As"],
    [Suit.Spade, "2s"],
    [Suit.Spade, "Ks"],
    [Suit.Heart, "Ah"],
    [Suit.Heart, "2h"],
    [Suit.Heart, "Kh"],
    [Suit.Diamond, "Ad"],
    [Suit.Diamond, "2d"],
    [Suit.Diamond, "Kd"],
    [Suit.Club, "Ac"],
    [Suit.Club, "2c"],
    [Suit.Club, "Qc"],
    [Suit.Club, "Kc"],
  ])("returns %s when the given value is %s", (expected, value) => {
    expect(getSuit(stringToCard(value))).toBe(expected);
  });
});
