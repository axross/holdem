import { describe, expect, it } from "@jest/globals";
import { SuitUtils } from "./suit";

describe("SuitUtils.parse()", () => {
  it.concurrent.each([
    ["s", "s"],
    ["h", "h"],
    ["d", "d"],
    ["c", "c"],
  ])("parses %s into Suit<%i>", async (char, suit) => {
    expect(SuitUtils.parse(char)).toBe(suit);
  });

  it('parses "s" into "s"', () => {
    expect(SuitUtils.parse("s")).toBe("s");
  });

  it('parses "h" into "h"', () => {
    expect(SuitUtils.parse("h")).toBe("h");
  });

  it('parses "d" into "d"', () => {
    expect(SuitUtils.parse("d")).toBe("d");
  });

  it('parses "c" into "c"', () => {
    expect(SuitUtils.parse("c")).toBe("c");
  });

  it('throws an error because "S" is not a valid string', () => {
    expect(() => SuitUtils.parse("S")).toThrowErrorMatchingSnapshot();
  });

  it('throws an error because "" is not a valid string', () => {
    expect(() => SuitUtils.parse("")).toThrowErrorMatchingSnapshot();
  });
});

describe("RankUtils.compare()", () => {
  it('returns negative integer as comparison result of "s" and "h"', () => {
    expect(SuitUtils.compare("s", "h")).toBeLessThan(0);
  });

  it('returns positive integer as comparison result of "c" and "h"', () => {
    expect(SuitUtils.compare("c", "h")).toBeGreaterThan(0);
  });

  it('returns 0 as comparison result of "h" and "h"', () => {
    expect(SuitUtils.compare("h", "h")).toBe(0);
  });
});
