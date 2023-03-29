import { Suit, SuitUtils } from "./suit";

describe("SuitUtils.parse()", () => {
  it.concurrent.each([
    ["s", Suit.Spade],
    ["h", Suit.Heart],
    ["d", Suit.Diamond],
    ["c", Suit.Club],
  ])("parses %s into Suit<%i>", (char, suit) => {
    expect(SuitUtils.parse(char)).toBe(suit);
  });

  it('parses "s" into Suit.Spade', () => {
    expect(SuitUtils.parse("s")).toBe(Suit.Spade);
  });

  it('parses "h" into Suit.Heart', () => {
    expect(SuitUtils.parse("h")).toBe(Suit.Heart);
  });

  it('parses "d" into Suit.Diamond', () => {
    expect(SuitUtils.parse("d")).toBe(Suit.Diamond);
  });

  it('parses "c" into Suit.Club', () => {
    expect(SuitUtils.parse("c")).toBe(Suit.Club);
  });

  it('throws an error because "S" is not a valid string', () => {
    expect(() => SuitUtils.parse("S")).toThrowErrorMatchingSnapshot();
  });

  it('throws an error because "" is not a valid string', () => {
    expect(() => SuitUtils.parse("")).toThrowErrorMatchingSnapshot();
  });
});

describe("RankUtils.compare()", () => {
  it("returns negative integer as comparison result of Suit.Spade and Suit.Heart", () => {
    expect(SuitUtils.compare(Suit.Spade, Suit.Heart)).toBeLessThan(0);
  });

  it("returns positive integer as comparison result of Suit.Club and Suit.Heart", () => {
    expect(SuitUtils.compare(Suit.Club, Suit.Heart)).toBeGreaterThan(0);
  });

  it("returns 0 as comparison result of Suit.Heart and Suit.Heart", () => {
    expect(SuitUtils.compare(Suit.Heart, Suit.Heart)).toBe(0);
  });
});

describe("SuitUtils.format()", () => {
  it('stringifies Suit.Spade into "s"', () => {
    expect(SuitUtils.format(Suit.Spade)).toBe("s");
  });

  it('stringifies Suit.Heart into "h"', () => {
    expect(SuitUtils.format(Suit.Heart)).toBe("h");
  });

  it('stringifies Suit.Diamond into "d"', () => {
    expect(SuitUtils.format(Suit.Diamond)).toBe("d");
  });

  it('stringifies Suit.Club into "c"', () => {
    expect(SuitUtils.format(Suit.Club)).toBe("c");
  });
});
