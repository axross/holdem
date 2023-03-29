import { Card } from "..";
import { CardUtils } from "./card";
import { Rank } from "./rank";
import { Suit } from "./suit";

describe("CardUtils.create()", () => {
  it("creates Card<As> from Rank.Ace and Suit.Spade", () => {
    expect(CardUtils.create(Rank.Ace, Suit.Spade)).toBe(1);
  });

  it("creates Card<2s> from Rank.Deuce and Suit.Spade", () => {
    expect(CardUtils.create(Rank.Deuce, Suit.Spade)).toBe(2);
  });

  it("creates Card<Ad> from Rank.Ace and Suit.Diamond", () => {
    expect(CardUtils.create(Rank.Ace, Suit.Diamond)).toBe(2 ** 26);
  });

  it("creates Card<Ad> from Rank.King and Suit.Club", () => {
    expect(CardUtils.create(Rank.King, Suit.Club)).toBe(2 ** 51);
  });
});

describe("CardUtils.parse()", () => {
  it('parses "As" into Card<As>', () => {
    expect(CardUtils.parse("As")).toBe(CardUtils.create(Rank.Ace, Suit.Spade));
  });

  it('parses "2s" into Card<2s>', () => {
    expect(CardUtils.parse("2s")).toBe(
      CardUtils.create(Rank.Deuce, Suit.Spade)
    );
  });

  it('parses "Ad" into Card<Ad>', () => {
    expect(CardUtils.parse("Ad")).toBe(
      CardUtils.create(Rank.Ace, Suit.Diamond)
    );
  });

  it('parses "Kc" into Card<Ad>', () => {
    expect(CardUtils.parse("Kc")).toBe(CardUtils.create(Rank.King, Suit.Club));
  });

  it('throws an error because "AS" is invalid string', () => {
    expect(() => CardUtils.parse("AS")).toThrowErrorMatchingSnapshot();
  });

  it('throws an error because "as" is invalid string', () => {
    expect(() => CardUtils.parse("as")).toThrowErrorMatchingSnapshot();
  });

  it('throws an error because "sA" is invalid string', () => {
    expect(() => CardUtils.parse("sA")).toThrowErrorMatchingSnapshot();
  });

  it('throws an error because "Ak" is invalid string', () => {
    expect(() => CardUtils.parse("Ak")).toThrowErrorMatchingSnapshot();
  });

  it('throws an error because "" is invalid string', () => {
    expect(() => CardUtils.parse("")).toThrowErrorMatchingSnapshot();
  });
});

describe("CardUtils.random()", () => {
  it("creates a Card at random", () => {
    const map = new Map<Card, number>();

    for (let i = 0; i < 10000; ++i) {
      const card = CardUtils.random();

      map.set(card, (map.get(card) ?? 0) + 1);
    }

    expect(map.size).toBeGreaterThan(26);
    expect(Math.max(...map.values())).toBeLessThan(1000);
  });
});

describe("CardUtils.rankOf()", () => {
  it("returns Rank.Ace from Card<As>", () => {
    expect(CardUtils.rankOf(CardUtils.create(Rank.Ace, Suit.Spade))).toBe(
      Rank.Ace
    );
  });

  it("returns Rank.Deuce from Card<2c>", () => {
    expect(CardUtils.rankOf(CardUtils.create(Rank.Deuce, Suit.Club))).toBe(
      Rank.Deuce
    );
  });

  it("returns Rank.Nine from Card<9d>", () => {
    expect(CardUtils.rankOf(CardUtils.create(Rank.Nine, Suit.Diamond))).toBe(
      Rank.Nine
    );
  });

  it("returns Rank.Queen from Card<Qh>", () => {
    expect(CardUtils.rankOf(CardUtils.create(Rank.Queen, Suit.Heart))).toBe(
      Rank.Queen
    );
  });
});

describe("CardUtils.suitOf", () => {
  it("returns Suit.Spade from Card<As>", () => {
    expect(CardUtils.suitOf(CardUtils.create(Rank.Ace, Suit.Spade))).toBe(
      Suit.Spade
    );
  });

  it("returns Suit.Club from Card<2c>", () => {
    expect(CardUtils.suitOf(CardUtils.create(Rank.Deuce, Suit.Club))).toBe(
      Suit.Club
    );
  });

  it("returns Suit.Diamond from Card<9d>", () => {
    expect(CardUtils.suitOf(CardUtils.create(Rank.Nine, Suit.Diamond))).toBe(
      Suit.Diamond
    );
  });

  it("returns Suit.Heart from Card<Qh>", () => {
    expect(CardUtils.suitOf(CardUtils.create(Rank.Queen, Suit.Heart))).toBe(
      Suit.Heart
    );
  });
});

describe("CardUtils.compare()", () => {
  it("returns negative integer as comparison result of Card<As> and Card<Ad>", () => {
    expect(
      CardUtils.compare(
        CardUtils.create(Rank.Ace, Suit.Spade),
        CardUtils.create(Rank.Ace, Suit.Diamond)
      )
    ).toBeLessThan(0);
  });

  it("returns positive integer as comparison result of Card<Ad> and Card<6s>", () => {
    expect(
      CardUtils.compare(
        CardUtils.create(Rank.Ace, Suit.Diamond),
        CardUtils.create(Rank.Six, Suit.Heart)
      )
    ).toBeGreaterThan(0);
  });

  it("returns 0 as comparison result of Card<Ac> and Card<Ac>", () => {
    expect(
      CardUtils.compare(
        CardUtils.create(Rank.Ace, Suit.Club),
        CardUtils.create(Rank.Ace, Suit.Club)
      )
    ).toBe(0);
  });
});

describe("CardUtils.comparePower()", () => {
  it("returns negative integer as comparison result of Card<As> and Card<Ad>", () => {
    expect(
      CardUtils.comparePower(
        CardUtils.create(Rank.Ace, Suit.Spade),
        CardUtils.create(Rank.Ace, Suit.Diamond)
      )
    ).toBeLessThan(0);
  });

  it("returns negative integer as comparison result of Card<Ad> and Card<6h>", () => {
    expect(
      CardUtils.comparePower(
        CardUtils.create(Rank.Ace, Suit.Diamond),
        CardUtils.create(Rank.Six, Suit.Heart)
      )
    ).toBeLessThan(0);
  });

  it("returns positive integer as comparison result of Card<Qs> and Card<Ah>", () => {
    expect(
      CardUtils.comparePower(
        CardUtils.create(Rank.Queen, Suit.Spade),
        CardUtils.create(Rank.Ace, Suit.Heart)
      )
    ).toBeGreaterThan(0);
  });

  it("returns 0 as comparison result of Card<Ac> and Card<Ac>", () => {
    expect(
      CardUtils.comparePower(
        CardUtils.create(Rank.Ace, Suit.Club),
        CardUtils.create(Rank.Ace, Suit.Club)
      )
    ).toBe(0);
  });
});

describe("CardUtils.format()", () => {
  it('stringifies Card<As> into "As"', () => {
    expect(CardUtils.format(CardUtils.create(Rank.Ace, Suit.Spade))).toBe(
      "As"
    );
  });

  it('stringifies Card<2c> into "2c"', () => {
    expect(CardUtils.format(CardUtils.create(Rank.Deuce, Suit.Club))).toBe(
      "2c"
    );
  });

  it('stringifies Card<9d> into "9d"', () => {
    expect(CardUtils.format(CardUtils.create(Rank.Nine, Suit.Diamond))).toBe(
      "9d"
    );
  });

  it('stringifies Card<Qh> into "Qh"', () => {
    expect(CardUtils.format(CardUtils.create(Rank.Queen, Suit.Heart))).toBe(
      "Qh"
    );
  });
});
