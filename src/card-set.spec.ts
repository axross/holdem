import { describe, expect, it } from "@jest/globals";
import { CardUtils } from "./card";
import { CardSet, CardSetUtils } from "./card-set";

describe("CardSetUtils.empty", () => {
  it("is a CardSet that is empty", () => {
    expect(CardSetUtils.empty).toBe(
      0b0000000000000000000000000000000000000000000000000000
    );
  });
});

describe("CardSetUtils.full", () => {
  it("is a CardSet that has every card", () => {
    expect(CardSetUtils.full).toBe(
      0b1111111111111111111111111111111111111111111111111111
    );
  });
});

describe("CardSetUtils.from()", () => {
  it("creates a CardSet from cards", () => {
    const cardSet = CardSetUtils.from([
      CardUtils.create("A", "s"),
      CardUtils.create("K", "c"),
      CardUtils.create("Q", "h"),
      CardUtils.create("J", "d"),
    ]);

    expect(cardSet).toBe(
      0b1000000000000001000000000001000000000000000000000001
    );
  });
});

describe("CardSetUtils.parse()", () => {
  it('creates CardSet<AsQhJdKc> from "AsKcQhJd"', () => {
    expect(CardSetUtils.parse("AsKcQhJd")).toBe(
      0b1000000000000001000000000001000000000000000000000001
    );
  });

  it('creates CardSet<> from ""', () => {
    expect(CardSetUtils.parse("")).toBe(
      0b0000000000000000000000000000000000000000000000000000
    );
  });

  it.concurrent.each([["AsKC"], ["AsKcqh"], ["AKs"], ["44"], ["As+"]])(
    'throws an error because "%s" isn\'t a valid string',
    async (string) => {
      expect(() => CardSetUtils.parse(string)).toThrowErrorMatchingSnapshot();
    }
  );
});

describe("CardSetUtils.iterate()", () => {
  it("iterates a CardSet<0b1000000000000001000000000001000000000000000000000001n>", () => {
    const cardSet = CardSetUtils.from([
      CardUtils.create("A", "s"),
      CardUtils.create("K", "c"),
      CardUtils.create("Q", "h"),
      CardUtils.create("J", "d"),
    ]);
    const cards = [];

    for (const card of CardSetUtils.iterate(cardSet)) {
      cards.push(card);
    }

    expect(cards).toEqual([
      CardUtils.create("A", "s"),
      CardUtils.create("Q", "h"),
      CardUtils.create("J", "d"),
      CardUtils.create("K", "c"),
    ]);
  });
});

describe("CardSetUtils.size()", () => {
  it.concurrent.each([
    [4, 0b1000000000000001000000000001000000000000000000000001],
    [1, 0b1000000000000000000000000000000000000000000000000000],
    [0, 0b0000000000000000000000000000000000000000000000000000],
    [52, 0b1111111111111111111111111111111111111111111111111111],
  ])("returns %i from Card<%i> as its size", async (size, cardSet) => {
    expect(CardSetUtils.size(cardSet as CardSet)).toBe(size);
  });
});

describe("CardSetUtils.has()", () => {
  it.concurrent.each([
    [
      true,
      0b1000000000000001000000000001000000000000000000000001,
      0b1000000000000000000000000001000000000000000000000000,
    ],
    [
      true,
      0b0000000000000000000000000000000000000000000000000001,
      0b0000000000000000000000000000000000000000000000000000,
    ],
    [
      false,
      0b0000000000000000000000000000000000000000000000000000,
      0b0000000000000000000000000000000000000000000000000001,
    ],
    [
      true,
      0b0000000000000000000000000000000000000000000000000000,
      0b0000000000000000000000000000000000000000000000000000,
    ],
    [
      true,
      0b1111111111111111111111111111111111111111111111111111,
      0b1111111111111111111111111111111111111111111111111111,
    ],
  ])(
    "returns %s because CardSet<%i> is/isn't a superset of CardSet<%i>",
    async (result, a, b) => {
      expect(CardSetUtils.has(a as CardSet, b as CardSet)).toBe(result);
    }
  );
});

describe("CardSetUtils.union()", () => {
  it.concurrent.each([
    [
      0b0000000000000001000000000000000000000000000000000001,
      0b1000000000000000000000000001000000000000000000000000,
      0b1000000000000001000000000001000000000000000000000001,
    ],
    [
      0b0000000000000000000000000000000000000000000000000001,
      0b0000000000000000000000000000000000000000000000000000,
      0b0000000000000000000000000000000000000000000000000001,
    ],
    [
      0b0000000000000000000000000000000000000000000000000000,
      0b0000000000000000000000000000000000000000000000000001,
      0b0000000000000000000000000000000000000000000000000001,
    ],
    [
      0b0000000000000000000000000000000000000000000000000000,
      0b0000000000000000000000000000000000000000000000000000,
      0b0000000000000000000000000000000000000000000000000000,
    ],
    [
      0b1111111111111111111111111111111111111111111111111111,
      0b1111111111111111111111111111111111111111111111111111,
      0b1111111111111111111111111111111111111111111111111111,
    ],
  ])(
    "combines CardSet<%i> and CardSet<%i> and returns CardSet<%i>",
    async (a, b, combined) => {
      expect(CardSetUtils.union(a as CardSet, b as CardSet)).toBe(combined);
    }
  );
});

describe("CardSetUtils.diff()", () => {
  it.concurrent.each([
    [
      0b0000000000000001000000000000000000000000000000000001,
      0b1000000000000001000000000001000000000000000000000001,
      0b1000000000000000000000000001000000000000000000000000,
    ],
    [
      0b0000000000000000000000000000000000000000000000000001,
      0b0000000000000000000000000000000000000000000000000001,
      0b0000000000000000000000000000000000000000000000000000,
    ],
    [
      0b0000000000000000000000000000000000000000000000000000,
      0b0000000000000000000000000000000000000000000000000000,
      0b0000000000000000000000000000000000000000000000000001,
    ],
    [
      0b0000000000000000000000000000000000000000000000000000,
      0b0000000000000000000000000000000000000000000000000000,
      0b0000000000000000000000000000000000000000000000000000,
    ],
    [
      0b0000000000000000000000000000000000000000000000000000,
      0b1111111111111111111111111111111111111111111111111111,
      0b1111111111111111111111111111111111111111111111111111,
    ],
  ])(
    "returns CardSet<%i> as difference of CardSet<%i> and CardSet<%i>",
    async (diff, a, b) => {
      expect(CardSetUtils.diff(a as CardSet, b as CardSet)).toBe(diff);
    }
  );
});

describe("CardSetUtils.format()", () => {
  it.concurrent.each([
    [0b1000000000000001000000000001000000000000000000000001, "AsQhJdKc"],
    [0b0000000000000000000000000000000000000000000000000001, "As"],
    [0b0000000000000000000000000000000000000000000000000000, ""],
  ])('stringifies CardSet<%i> into "%s"', async (cardSet, string) => {
    expect(CardSetUtils.format(cardSet as CardSet)).toBe(string);
  });
});
