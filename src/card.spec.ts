import { describe, expect, it } from "@jest/globals";
import { Card } from "./card";
import { Rank } from "./rank";
import { Suit } from "./suit";

describe("Card.parse()", () => {
  it('parses "As" into Card<As>', () => {
    expect(Card.parse("As")).toEqual(new Card(Rank.Ace, Suit.Spade));
  });

  it('parses "2s" into Card<2s>', () => {
    expect(Card.parse("2s")).toEqual(new Card(Rank.Deuce, Suit.Spade));
  });

  it('parses "Ad" into Card<Ad>', () => {
    expect(Card.parse("Ad")).toEqual(new Card(Rank.Ace, Suit.Diamond));
  });

  it('parses "Kc" into Card<Ad>', () => {
    expect(Card.parse("Kc")).toEqual(new Card(Rank.King, Suit.Club));
  });

  it('throws an error because "AS" is invalid string', () => {
    expect(() => Card.parse("AS")).toThrowErrorMatchingInlineSnapshot(
      `""AS" is not a valid string for Card.parse()."`
    );
  });

  it('throws an error because "as" is invalid string', () => {
    expect(() => Card.parse("as")).toThrowErrorMatchingInlineSnapshot(
      `""as" is not a valid string for Card.parse()."`
    );
  });

  it('throws an error because "sA" is invalid string', () => {
    expect(() => Card.parse("sA")).toThrowErrorMatchingInlineSnapshot(
      `""sA" is not a valid string for Card.parse()."`
    );
  });

  it('throws an error because "Ak" is invalid string', () => {
    expect(() => Card.parse("Ak")).toThrowErrorMatchingInlineSnapshot(
      `""Ak" is not a valid string for Card.parse()."`
    );
  });

  it('throws an error because "" is invalid string', () => {
    expect(() => Card.parse("")).toThrowErrorMatchingInlineSnapshot(
      `""" is not a valid string for Card.parse()."`
    );
  });
});

describe("Card#compare()", () => {
  test("Card<As>.compare(Card<6h>) returns negative integer", () => {
    expect(
      new Card(Rank.Ace, Suit.Spade).compare(new Card(Rank.Ace, Suit.Heart))
    ).toBeLessThan(0);
  });

  test("Card<Qs>.compare(Card<Ah>) returns positive integer", () => {
    expect(
      new Card(Rank.Queen, Suit.Spade).compare(new Card(Rank.Ace, Suit.Heart))
    ).toBeGreaterThan(0);
  });

  test("Card<Ac>.compare(Card<Ac>) returns 0", () => {
    expect(
      new Card(Rank.Ace, Suit.Club).compare(new Card(Rank.Ace, Suit.Club))
    ).toBe(0);
  });
});

describe("Card#format()", () => {
  it('stringifies Card<As> into "As"', () => {
    expect(new Card(Rank.Ace, Suit.Spade).format()).toBe("As");
  });

  it('stringifies Card<2c> into "2c"', () => {
    expect(new Card(Rank.Deuce, Suit.Club).format()).toBe("2c");
  });

  it('stringifies Card<9d> into "9d"', () => {
    expect(new Card(Rank.Nine, Suit.Diamond).format()).toBe("9d");
  });

  it('stringifies Card<Qh> into "Qh"', () => {
    expect(new Card(Rank.Queen, Suit.Heart).format()).toBe("Qh");
  });
});
