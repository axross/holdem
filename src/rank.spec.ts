import { describe, expect, it } from "@jest/globals";
import { RankUtils } from "./rank";

describe("RankUtils.parse()", () => {
  it('parses "A" into "A"', () => {
    expect(RankUtils.parse("A")).toBe("A");
  });

  it('parses "K" into "K"', () => {
    expect(RankUtils.parse("K")).toBe("K");
  });

  it('parses "Q" into "Q"', () => {
    expect(RankUtils.parse("Q")).toBe("Q");
  });

  it('parses "J" into "J"', () => {
    expect(RankUtils.parse("J")).toBe("J");
  });

  it('parses "T" into "T"', () => {
    expect(RankUtils.parse("T")).toBe("T");
  });

  it('parses "9" into "9"', () => {
    expect(RankUtils.parse("9")).toBe("9");
  });

  it('parses "8" into "8"', () => {
    expect(RankUtils.parse("8")).toBe("8");
  });

  it('parses "7" into "7"', () => {
    expect(RankUtils.parse("7")).toBe("7");
  });

  it('parses "6" into "6"', () => {
    expect(RankUtils.parse("6")).toBe("6");
  });

  it('parses "5" into "5"', () => {
    expect(RankUtils.parse("5")).toBe("5");
  });

  it('parses "4" into "4"', () => {
    expect(RankUtils.parse("4")).toBe("4");
  });

  it('parses "3" into "3"', () => {
    expect(RankUtils.parse("3")).toBe("3");
  });

  it('parses "2" into "2"', () => {
    expect(RankUtils.parse("2")).toBe("2");
  });

  it('throws an error because "a" is not a valid string', () => {
    expect(() => RankUtils.parse("a")).toThrowErrorMatchingSnapshot();
  });

  it('throws an error because "" is not a valid string', () => {
    expect(() => RankUtils.parse("")).toThrowErrorMatchingSnapshot();
  });
});

describe("RankUtils.compare()", () => {
  it('returns negative integer as comparison result of "A" and "2"', () => {
    expect(RankUtils.compare("A", "2")).toBeLessThan(0);
  });

  it('returns positive integer as comparison result of "4" and "A"', () => {
    expect(RankUtils.compare("4", "A")).toBeGreaterThan(0);
  });

  it('returns 0 as comparison result of "6" and "6"', () => {
    expect(RankUtils.compare("6", "6")).toBe(0);
  });
});

describe("RankUtils.comparePower()", () => {
  it('returns negative integer as comparison result of "A" and "K"', () => {
    expect(RankUtils.comparePower("A", "K")).toBeLessThan(0);
  });

  it('returns positive integer as comparison result of "Q" and "5"', () => {
    expect(RankUtils.comparePower("5", "8")).toBeGreaterThan(0);
  });

  it('returns 0 as comparison result of "T" and "T"', () => {
    expect(RankUtils.comparePower("T", "T")).toBe(0);
  });

  it('returns negative integer as comparison result of "K" and "2"', () => {
    expect(RankUtils.comparePower("K", "2")).toBeLessThan(0);
  });
});


