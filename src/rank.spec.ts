import { describe, expect, it } from "@jest/globals";
import { Rank } from "./rank";

describe("Rank.parse()", () => {
  it('parses "A" into Rank.Ace', () => {
    expect(Rank.parse("A")).toBe(Rank.Ace);
  });

  it('parses "K" into Rank.King', () => {
    expect(Rank.parse("K")).toBe(Rank.King);
  });

  it('parses "Q" into Rank.Queen', () => {
    expect(Rank.parse("Q")).toBe(Rank.Queen);
  });

  it('parses "J" into Rank.Jack', () => {
    expect(Rank.parse("J")).toBe(Rank.Jack);
  });

  it('parses "T" into Rank.Ten', () => {
    expect(Rank.parse("T")).toBe(Rank.Ten);
  });

  it('parses "9" into Rank.Nine', () => {
    expect(Rank.parse("9")).toBe(Rank.Nine);
  });

  it('parses "8" into Rank.Eight', () => {
    expect(Rank.parse("8")).toBe(Rank.Eight);
  });

  it('parses "7" into Rank.Seven', () => {
    expect(Rank.parse("7")).toBe(Rank.Seven);
  });

  it('parses "6" into Rank.Six', () => {
    expect(Rank.parse("6")).toBe(Rank.Six);
  });

  it('parses "5" into Rank.Five', () => {
    expect(Rank.parse("5")).toBe(Rank.Five);
  });

  it('parses "4" into Rank.Four', () => {
    expect(Rank.parse("4")).toBe(Rank.Four);
  });

  it('parses "3" into Rank.Trey', () => {
    expect(Rank.parse("3")).toBe(Rank.Trey);
  });

  it('parses "2" into Rank.Deuce', () => {
    expect(Rank.parse("2")).toBe(Rank.Deuce);
  });

  it('throws an error because "a" is not a valid string', () => {
    expect(() => Rank.parse("a")).toThrowErrorMatchingInlineSnapshot(
      `""a" is not a valid value for Rank.parse()."`
    );
  });

  it('throws an error because "" is not a valid string', () => {
    expect(() => Rank.parse("")).toThrowErrorMatchingInlineSnapshot(
      `""" is not a valid value for Rank.parse()."`
    );
  });
});

describe("Rank#compare()", () => {
  test("Rank.Ace.compare(Rank.Deuce) returns negative integer", () => {
    expect(Rank.Ace.compare(Rank.Deuce)).toBeLessThan(0);
  });

  test("Rank.Four.compare(Rank.Ace) returns positive integer", () => {
    expect(Rank.Four.compare(Rank.Ace)).toBeGreaterThan(0);
  });

  test("Rank.Six.compare(Rank.Six) returns 0", () => {
    expect(Rank.Six.compare(Rank.Six)).toBe(0);
  });
});

describe("Rank#comparePower()", () => {
  test("Rank.Ace.comparePower(Rank.King) returns negative integer", () => {
    expect(Rank.Ace.comparePower(Rank.King)).toBeLessThan(0);
  });

  test("Rank.Five.comparePower(Rank.Eight) returns positive integer", () => {
    expect(Rank.Five.comparePower(Rank.Eight)).toBeGreaterThan(0);
  });

  test("Rank.Ten.comparePower(Rank.Ten) returns 0", () => {
    expect(Rank.Ten.comparePower(Rank.Ten)).toBe(0);
  });

  test("Rank.King.comparePower(Rank.Deuce) returns negative integer", () => {
    expect(Rank.King.comparePower(Rank.Deuce)).toBeLessThan(0);
  });
});
