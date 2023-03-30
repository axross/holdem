import { describe, expect, it } from "@jest/globals";
import { Card, CardUtils } from "./card";

describe("CardUtils.create()", () => {
  it('creates Card<As> from "A" and "s"', () => {
    expect(CardUtils.create("A", "s")).toBe(1);
  });

  it('creates Card<2s> from "2" and "s"', () => {
    expect(CardUtils.create("2", "s")).toBe(2);
  });

  it('creates Card<Ad> from "A" and "d"', () => {
    expect(CardUtils.create("A", "d")).toBe(2 ** 26);
  });

  it('creates Card<Ad> from "K" and "c"', () => {
    expect(CardUtils.create("K", "c")).toBe(2 ** 51);
  });
});

describe("CardUtils.parse()", () => {
  it('parses "As" into Card<As>', () => {
    expect(CardUtils.parse("As")).toBe(CardUtils.create("A", "s"));
  });

  it('parses "2s" into Card<2s>', () => {
    expect(CardUtils.parse("2s")).toBe(CardUtils.create("2", "s"));
  });

  it('parses "Ad" into Card<Ad>', () => {
    expect(CardUtils.parse("Ad")).toBe(CardUtils.create("A", "d"));
  });

  it('parses "Kc" into Card<Ad>', () => {
    expect(CardUtils.parse("Kc")).toBe(CardUtils.create("K", "c"));
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
  it('returns "A" from Card<As>', () => {
    expect(CardUtils.rankOf(CardUtils.create("A", "s"))).toBe("A");
  });

  it('returns "2" from Card<2c>', () => {
    expect(CardUtils.rankOf(CardUtils.create("2", "c"))).toBe("2");
  });

  it('returns "9" from Card<9d>', () => {
    expect(CardUtils.rankOf(CardUtils.create("9", "d"))).toBe("9");
  });

  it('returns "Q" from Card<Qh>', () => {
    expect(CardUtils.rankOf(CardUtils.create("Q", "h"))).toBe("Q");
  });
});

describe("CardUtils.suitOf", () => {
  it('returns "s" from Card<As>', () => {
    expect(CardUtils.suitOf(CardUtils.create("A", "s"))).toBe("s");
  });

  it('returns "c" from Card<2c>', () => {
    expect(CardUtils.suitOf(CardUtils.create("2", "c"))).toBe("c");
  });

  it('returns "d" from Card<9d>', () => {
    expect(CardUtils.suitOf(CardUtils.create("9", "d"))).toBe(
      "d"
    );
  });

  it('returns "h" from Card<Qh>', () => {
    expect(CardUtils.suitOf(CardUtils.create("Q", "h"))).toBe("h");
  });
});

describe("CardUtils.compare()", () => {
  it("returns negative integer as comparison result of Card<As> and Card<Ad>", () => {
    expect(
      CardUtils.compare(
        CardUtils.create("A", "s"),
        CardUtils.create("A", "d")
      )
    ).toBeLessThan(0);
  });

  it("returns positive integer as comparison result of Card<Ad> and Card<6s>", () => {
    expect(
      CardUtils.compare(
        CardUtils.create("A", "d"),
        CardUtils.create("6", "h")
      )
    ).toBeGreaterThan(0);
  });

  it("returns 0 as comparison result of Card<Ac> and Card<Ac>", () => {
    expect(
      CardUtils.compare(
        CardUtils.create("A", "c"),
        CardUtils.create("A", "c")
      )
    ).toBe(0);
  });
});

describe("CardUtils.comparePower()", () => {
  it("returns negative integer as comparison result of Card<As> and Card<Ad>", () => {
    expect(
      CardUtils.comparePower(
        CardUtils.create("A", "s"),
        CardUtils.create("A", "d")
      )
    ).toBeLessThan(0);
  });

  it("returns negative integer as comparison result of Card<Ad> and Card<6h>", () => {
    expect(
      CardUtils.comparePower(
        CardUtils.create("A", "d"),
        CardUtils.create("6", "h")
      )
    ).toBeLessThan(0);
  });

  it("returns positive integer as comparison result of Card<Qs> and Card<Ah>", () => {
    expect(
      CardUtils.comparePower(
        CardUtils.create("Q", "s"),
        CardUtils.create("A", "h")
      )
    ).toBeGreaterThan(0);
  });

  it("returns 0 as comparison result of Card<Ac> and Card<Ac>", () => {
    expect(
      CardUtils.comparePower(
        CardUtils.create("A", "c"),
        CardUtils.create("A", "c")
      )
    ).toBe(0);
  });
});

describe("CardUtils.format()", () => {
  it('stringifies Card<As> into "As"', () => {
    expect(CardUtils.format(CardUtils.create("A", "s"))).toBe("As");
  });

  it('stringifies Card<2c> into "2c"', () => {
    expect(CardUtils.format(CardUtils.create("2", "c"))).toBe("2c");
  });

  it('stringifies Card<9d> into "9d"', () => {
    expect(CardUtils.format(CardUtils.create("9", "d"))).toBe("9d");
  });

  it('stringifies Card<Qh> into "Qh"', () => {
    expect(CardUtils.format(CardUtils.create("Q", "h"))).toBe("Qh");
  });
});
