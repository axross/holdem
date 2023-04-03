import { describe, expect, it, test } from "@jest/globals";
import { Suit } from "./suit";

describe("Suit.parse()", () => {
  it('parses "s" into Suit.Spade', () => {
    expect(Suit.parse("s")).toBe(Suit.Spade);
  });

  it('parses "h" into Suit.Heart', () => {
    expect(Suit.parse("h")).toBe(Suit.Heart);
  });

  it('parses "d" into Suit.Diamond', () => {
    expect(Suit.parse("d")).toBe(Suit.Diamond);
  });

  it('parses "c" into Suit.Club', () => {
    expect(Suit.parse("c")).toBe(Suit.Club);
  });

  it('throws an error because "S" is not a valid string', () => {
    expect(() => Suit.parse("S")).toThrowErrorMatchingInlineSnapshot(`""S" is not a valid value for Suit.parse()."`);
  });

  it('throws an error because "" is not a valid string', () => {
    expect(() => Suit.parse("")).toThrowErrorMatchingInlineSnapshot(`""" is not a valid value for Suit.parse()."`);
  });
});

describe("Suit#compare()", () => {
  test("Suit.Spade.compare(Suit.Heart) returns negative integer", () => {
    expect(Suit.Spade.compare(Suit.Heart)).toBeLessThan(0);
  });

  test("Suit.Club.compare(Suit.Heart) returns positive integer", () => {
    expect(Suit.Club.compare(Suit.Heart)).toBeGreaterThan(0);
  });

  test("Suit.Heart.compare(Suit.Heart) returns 0", () => {
    expect(Suit.Heart.compare(Suit.Heart)).toBe(0);
  });
});
