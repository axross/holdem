import { describe, expect, it } from "@jest/globals";
import { CardUtils } from "./card";
import { CardSet, CardSetUtils } from "./card-set";
import { HandRangeUtils } from "./hand-range";

describe("HandRangeUtils.parse()", () => {
  it('parses "88-66" into a hand range', () => {
    expect(HandRangeUtils.parse("88-66")).toMatchSnapshot();
  });

  it('parses "88-66:0.66" into a hand range', () => {
    expect(HandRangeUtils.parse("88-66:0.66")).toMatchSnapshot();
  });

  it('parses "JJ+" into a hand range', () => {
    expect(HandRangeUtils.parse("JJ+")).toMatchSnapshot();
  });

  it('parses "JJ+:0.5" into a hand range', () => {
    expect(HandRangeUtils.parse("JJ+:0.5")).toMatchSnapshot();
  });

  it('parses "AQs-A9s" into a hand range', () => {
    expect(HandRangeUtils.parse("AQs-A9s")).toMatchSnapshot();
  });

  it('parses "AQs-A9s:0.2" into a hand range', () => {
    expect(HandRangeUtils.parse("AQs-A9s:0.2")).toMatchSnapshot();
  });

  it('parses "98o-96o" into a hand range', () => {
    expect(HandRangeUtils.parse("98o-96o")).toMatchSnapshot();
  });

  it('parses "98o-96o:0.999" into a hand range', () => {
    expect(HandRangeUtils.parse("98o-96o:0.999")).toMatchSnapshot();
  });

  it('parses "K8s+" into a hand range', () => {
    expect(HandRangeUtils.parse("K8s+")).toMatchSnapshot();
  });

  it('parses "K8s+:0.80" into a hand range', () => {
    expect(HandRangeUtils.parse("K8s+:0.80")).toMatchSnapshot();
  });

  it('parses "ATo+" into a hand range', () => {
    expect(HandRangeUtils.parse("ATo+")).toMatchSnapshot();
  });

  it('parses "ATo+:1" into a hand range', () => {
    expect(HandRangeUtils.parse("ATo+:1")).toMatchSnapshot();
  });

  it('parses "44" into a hand range', () => {
    expect(HandRangeUtils.parse("44")).toMatchSnapshot();
  });

  it('parses "44:0.44" into a hand range', () => {
    expect(HandRangeUtils.parse("44:0.44")).toMatchSnapshot();
  });

  it('parses "JTs" into a hand range', () => {
    expect(HandRangeUtils.parse("JTs")).toMatchSnapshot();
  });

  it('parses "JTs:0.25" into a hand range', () => {
    expect(HandRangeUtils.parse("JTs:0.25")).toMatchSnapshot();
  });

  it('parses "72o" into a hand range', () => {
    expect(HandRangeUtils.parse("72o")).toMatchSnapshot();
  });

  it('parses "72o:0.27" into a hand range', () => {
    expect(HandRangeUtils.parse("72o:0.27")).toMatchSnapshot();
  });

  it('parses "AsKs" into a hand range', () => {
    expect(HandRangeUtils.parse("AsKs")).toMatchSnapshot();
  });

  it('parses "AsKs:0.4" into a hand range', () => {
    expect(HandRangeUtils.parse("AsKs:0.4")).toMatchSnapshot();
  });

  it('parses "7d6h" into a hand range', () => {
    expect(HandRangeUtils.parse("7d6h")).toMatchSnapshot();
  });

  it('parses "7d6h:0.67" into a hand range', () => {
    expect(HandRangeUtils.parse("7d6h:0.67")).toMatchSnapshot();
  });

  it('parses "88-66,JJ+,44,AQs-A9s,98o-96o,K8s+,ATo+,44,JTs,72o,AsKs,7d6h" into a hand range', () => {
    expect(
      HandRangeUtils.parse(
        "88-66,JJ+,44,AQs-A9s,98o-96o,K8s+,ATo+,44,JTs,72o,AsKs,7d6h"
      )
    ).toMatchSnapshot();
  });

  it('parses "88-66:0.66,JJ+:0.5,44,AQs-A9s:0.2,98o-96o:0.999,K8s+:0.80,ATo+:1,44:0.44,JTs:0.25,72o:0.27,AsKs:0.4,7d6h:0.67" into a hand range', () => {
    expect(
      HandRangeUtils.parse(
        "88-66:0.66,JJ+:0.5,44,AQs-A9s:0.2,98o-96o:0.999,K8s+:0.80,ATo+:1,44:0.44,JTs:0.25,72o:0.27,AsKs:0.4,7d6h:0.67"
      )
    ).toMatchSnapshot();
  });

  it('parses "" into a hand range', () => {
    expect(HandRangeUtils.parse("")).toMatchSnapshot();
  });

  it('throws an error because "qwe" doesn\'t have any valid expression', () => {
    expect(() =>
      HandRangeUtils.parse("qwe")
    ).toThrowErrorMatchingInlineSnapshot(
      `"qwe is invalid part of hand range string expression."`
    );
  });

  it('throws an error because "AKTo+" contains an invalid expression', () => {
    expect(() =>
      HandRangeUtils.parse("AKTo+")
    ).toThrowErrorMatchingInlineSnapshot(
      `"AKTo+ is invalid part of hand range string expression."`
    );
  });

  it('throws an error because "JJ++" contains an invalid expression', () => {
    expect(() =>
      HandRangeUtils.parse("JJ++")
    ).toThrowErrorMatchingInlineSnapshot(
      `"JJ++ is invalid part of hand range string expression."`
    );
  });
});

describe("HandRangeUtils.create()", () => {
  it("throws an error if the given sequence of CardSets contains duplicated entries", () => {
    const cardSets: [CardSet, number][] = [
      [
        CardSetUtils.from([
          CardUtils.create("A", "s"),
          CardUtils.create("2", "c"),
        ]),
        1,
      ],
      [
        CardSetUtils.from([
          CardUtils.create("5", "h"),
          CardUtils.create("6", "s"),
        ]),
        1,
      ],
      [
        CardSetUtils.from([
          CardUtils.create("J", "c"),
          CardUtils.create("Q", "d"),
        ]),
        1,
      ],
      [
        CardSetUtils.from([
          CardUtils.create("6", "s"),
          CardUtils.create("5", "h"),
        ]),
        1,
      ],
      [
        CardSetUtils.from([
          CardUtils.create("A", "s"),
          CardUtils.create("2", "d"),
        ]),
        0.5,
      ],
    ];

    expect(() =>
      HandRangeUtils.create(cardSets)
    ).toThrowErrorMatchingInlineSnapshot(`"6s5h is duplicated."`);
  });

  it("throws an error if the given sequence of CardSets contains non-pair of cards", () => {
    expect(() =>
      HandRangeUtils.create([
        [
          CardSetUtils.from([
            CardUtils.create("A", "s"),
            CardUtils.create("2", "c"),
          ]),
          1,
        ],
        [
          CardSetUtils.from([
            CardUtils.create("5", "h"),
            CardUtils.create("6", "s"),
          ]),
          1,
        ],
        [
          CardSetUtils.from([
            CardUtils.create("J", "d"),
            CardUtils.create("Q", "h"),
            CardUtils.create("K", "c"),
          ]),
          1,
        ],
      ])
    ).toThrowErrorMatchingInlineSnapshot(
      `"QhJdKc isn't a card pair (two-length card set)."`
    );
  });
});

describe("HandRangeUtils.format()", () => {
  it("stringifies HandRange<JJ+:1,66-44:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("JJ+:1,66-44:1"))).toBe(
      "JJ+:1,66-44:1"
    );
  });

  it("stringifies HandRange<QQ+:1,JJ:0.5,TT:1,77-66:0.5,55-44:0.25>", () => {
    expect(
      HandRangeUtils.format(
        HandRangeUtils.parse("QQ+:1,JJ:0.5,TT:1,77-66:0.5,55-44:0.25")
      )
    ).toBe("QQ+:1,JJ:0.5,TT:1,77-66:0.5,55-44:0.25");
  });

  it("stringifies HandRange<88-66:0.66,JJ+:0.5,44:0.44,AQs-A9s:0.2,98o-96o:0.999,K8s+:0.80,ATo+:1,63s:0.5,JTs:0.25,72o:0.27,AsKs:0.4,AsQc:0.5,KhJh:1,7d6h:0.67>", () => {
    expect(
      HandRangeUtils.format(
        HandRangeUtils.parse(
          "88-66:0.66,JJ+:0.5,44:0.44,AQs-A9s:0.2,98o-96o:0.999,K8s+:0.80,ATo+:1,63s:0.5,JTs:0.25,72o:0.27,AsKs:0.4,AsQc:0.5,KhJh:1,7d6h:0.67"
        )
      )
    ).toBe(
      "JJ+:0.5,88-66:0.66,44:0.44,AQs-A9s:0.2,AKo:1,AJo-ATo:1,KQs:0.8,KTs-K8s:0.8,JTs:0.25,96o+:0.999,72o:0.27,63s:0.5,AsKs:0.4,AsQh:1,AsQd:1,AsQc:0.5,AhQs:1,AhQd:1,AhQc:1,AdQs:1,AdQh:1,AdQc:1,AcQs:1,AcQh:1,AcQd:1,KsJs:0.8,KhJh:1,KdJd:0.8,KcJc:0.8,7d6h:0.67"
    );
  });

  it("stringifies an empty HandRange", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse(""))).toBe("");
  });
});
