import { Rank, RankUtils } from "./rank";

describe("RankUtils.parse()", () => {
  it('parses "A" into Rank.Ace', () => {
    expect(RankUtils.parse("A")).toBe(Rank.Ace);
  });

  it('parses "K" into Rank.King', () => {
    expect(RankUtils.parse("K")).toBe(Rank.King);
  });

  it('parses "Q" into Rank.Queen', () => {
    expect(RankUtils.parse("Q")).toBe(Rank.Queen);
  });

  it('parses "J" into Rank.Jack', () => {
    expect(RankUtils.parse("J")).toBe(Rank.Jack);
  });

  it('parses "T" into Rank.Ten', () => {
    expect(RankUtils.parse("T")).toBe(Rank.Ten);
  });

  it('parses "9" into Rank.Nine', () => {
    expect(RankUtils.parse("9")).toBe(Rank.Nine);
  });

  it('parses "8" into Rank.Eight', () => {
    expect(RankUtils.parse("8")).toBe(Rank.Eight);
  });

  it('parses "7" into Rank.Seven', () => {
    expect(RankUtils.parse("7")).toBe(Rank.Seven);
  });

  it('parses "6" into Rank.Six', () => {
    expect(RankUtils.parse("6")).toBe(Rank.Six);
  });

  it('parses "5" into Rank.Five', () => {
    expect(RankUtils.parse("5")).toBe(Rank.Five);
  });

  it('parses "4" into Rank.Four', () => {
    expect(RankUtils.parse("4")).toBe(Rank.Four);
  });

  it('parses "3" into Rank.Trey', () => {
    expect(RankUtils.parse("3")).toBe(Rank.Trey);
  });

  it('parses "2" into Rank.Deuce', () => {
    expect(RankUtils.parse("2")).toBe(Rank.Deuce);
  });

  it('throws an error because "a" is not a valid string', () => {
    expect(() => RankUtils.parse("a")).toThrowErrorMatchingSnapshot();
  });

  it('throws an error because "" is not a valid string', () => {
    expect(() => RankUtils.parse("")).toThrowErrorMatchingSnapshot();
  });
});

describe("RankUtils.power()", () => {
  it("returns a power index of a Rank", () => {
    expect(RankUtils.power(Rank.Ace)).toBeGreaterThan(
      RankUtils.power(Rank.King)
    );
    expect(RankUtils.power(Rank.King)).toBeGreaterThan(
      RankUtils.power(Rank.Queen)
    );
    expect(RankUtils.power(Rank.Queen)).toBeGreaterThan(
      RankUtils.power(Rank.Jack)
    );
    expect(RankUtils.power(Rank.Jack)).toBeGreaterThan(
      RankUtils.power(Rank.Ten)
    );
    expect(RankUtils.power(Rank.Ten)).toBeGreaterThan(
      RankUtils.power(Rank.Nine)
    );
    expect(RankUtils.power(Rank.Nine)).toBeGreaterThan(
      RankUtils.power(Rank.Eight)
    );
    expect(RankUtils.power(Rank.Eight)).toBeGreaterThan(
      RankUtils.power(Rank.Seven)
    );
    expect(RankUtils.power(Rank.Seven)).toBeGreaterThan(
      RankUtils.power(Rank.Six)
    );
    expect(RankUtils.power(Rank.Six)).toBeGreaterThan(
      RankUtils.power(Rank.Five)
    );
    expect(RankUtils.power(Rank.Five)).toBeGreaterThan(
      RankUtils.power(Rank.Four)
    );
    expect(RankUtils.power(Rank.Four)).toBeGreaterThan(
      RankUtils.power(Rank.Trey)
    );
    expect(RankUtils.power(Rank.Trey)).toBeGreaterThan(
      RankUtils.power(Rank.Deuce)
    );
  });
});

describe("RankUtils.compare()", () => {
  it("returns negative integer as comparison result of Rank.Ace and Rank.Deuce", () => {
    expect(RankUtils.compare(Rank.Ace, Rank.Deuce)).toBeLessThan(0);
  });

  it("returns positive integer as comparison result of Rank.Four and Rank.Ace", () => {
    expect(RankUtils.compare(Rank.Four, Rank.Ace)).toBeGreaterThan(0);
  });

  it("returns 0 as comparison result of Rank.Six and Rank.Six", () => {
    expect(RankUtils.compare(Rank.Six, Rank.Six)).toBe(0);
  });
});

describe("RankUtils.comparePower()", () => {
  it("returns negative integer as comparison result of Rank.Ace and Rank.King", () => {
    expect(RankUtils.comparePower(Rank.Ace, Rank.King)).toBeLessThan(0);
  });

  it("returns positive integer as comparison result of Rank.Queen and Rank.Five", () => {
    expect(RankUtils.comparePower(Rank.Five, Rank.Eight)).toBeGreaterThan(0);
  });

  it("returns 0 as comparison result of Rank.Ten and Rank.Ten", () => {
    expect(RankUtils.comparePower(Rank.Ten, Rank.Ten)).toBe(0);
  });

  it("returns negative integer as comparison result of Rank.King and Rank.Deuce", () => {
    expect(RankUtils.comparePower(Rank.King, Rank.Deuce)).toBeLessThan(0);
  });
});

describe("RankUtils.format()", () => {
  it('stringifies Rank.Ace into "A"', () => {
    expect(RankUtils.format(Rank.Ace)).toBe("A");
  });

  it('stringifies Rank.King into "K"', () => {
    expect(RankUtils.format(Rank.King)).toBe("K");
  });

  it('stringifies Rank.Queen into "Q"', () => {
    expect(RankUtils.format(Rank.Queen)).toBe("Q");
  });

  it('stringifies Rank.Jack into "J"', () => {
    expect(RankUtils.format(Rank.Jack)).toBe("J");
  });

  it('stringifies Rank.Ten into "T"', () => {
    expect(RankUtils.format(Rank.Ten)).toBe("T");
  });

  it('stringifies Rank.Nine into "9"', () => {
    expect(RankUtils.format(Rank.Nine)).toBe("9");
  });

  it('stringifies Rank.Eight into "8"', () => {
    expect(RankUtils.format(Rank.Eight)).toBe("8");
  });

  it('stringifies Rank.Seven into "7"', () => {
    expect(RankUtils.format(Rank.Seven)).toBe("7");
  });

  it('stringifies Rank.Six into "6"', () => {
    expect(RankUtils.format(Rank.Six)).toBe("6");
  });

  it('stringifies Rank.Five into "5"', () => {
    expect(RankUtils.format(Rank.Five)).toBe("5");
  });

  it('stringifies Rank.Four into "4"', () => {
    expect(RankUtils.format(Rank.Four)).toBe("4");
  });

  it('stringifies Rank.Trey into "3"', () => {
    expect(RankUtils.format(Rank.Trey)).toBe("3");
  });

  it('stringifies Rank.Deuce into "2"', () => {
    expect(RankUtils.format(Rank.Deuce)).toBe("2");
  });
});
