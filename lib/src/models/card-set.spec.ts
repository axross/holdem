import { stringToCard } from "./card";
import {
  cardSetHas,
  cardSetToString,
  cardSetUnion,
  stringToCardSet,
} from "./card-set";

describe("cardSetUnion()", () => {
  it.concurrent.each([
    ["AsAh", "As", "Ah"],
    ["As2h", "As", "2h"],
    ["Ac2h", "Ac", "2h"],
  ])("returns %s as an union of %s and %s", (expected, cardA, cardB) => {
    expect(cardSetUnion(stringToCard(cardA), stringToCard(cardB))).toBe(
      stringToCardSet(expected)
    );
  });
});

describe("cardSetHas()", () => {
  it.concurrent.each([
    [true, "AsAh", "As"],
    [true, "As2h", "2h"],
    [false, "Ac2h", "Ad"],
    [true, "AsKhQdJcTs", "KhJc"],
    [false, "AsKhQdJcTs", "AhJc"],
  ])("returns %s when %s and %s are given", (expected, cardSetA, cardSetB) => {
    expect(
      cardSetHas(stringToCardSet(cardSetA), stringToCardSet(cardSetB))
    ).toBe(expected);
  });
});

describe("stringToCardSet()", () => {
  it.concurrent.each([
    [1n + 2n ** 13n, "AsAh"],
    [1n + 2n ** 25n, "As2h"],
    [2n ** 39n + 2n ** 25n, "Ac2h"],
  ])("returns %i when the given value is %s", (expected, value) => {
    expect(stringToCardSet(value)).toBe(expected);
  });
});

describe("cardSetToString()", () => {
  it.concurrent.each([
    ["AsAh", 1n + 2n ** 13n],
    ["As2h", 1n + 2n ** 25n],
    ["2hAc", 2n ** 39n + 2n ** 25n],
  ])("returns %s when the given value is %i", (expected, value) => {
    expect(cardSetToString(value)).toBe(expected);
  });
});
