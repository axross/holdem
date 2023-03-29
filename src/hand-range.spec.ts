import { CardUtils } from "./card";
import { CardSet, CardSetUtils } from "./card-set";
import { HandRangeUtils } from "./hand-range";
import { Rank } from "./rank";
import { Suit } from "./suit";

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
          CardUtils.create(Rank.Ace, Suit.Spade),
          CardUtils.create(Rank.Deuce, Suit.Club),
        ]),
        1,
      ],
      [
        CardSetUtils.from([
          CardUtils.create(Rank.Five, Suit.Heart),
          CardUtils.create(Rank.Six, Suit.Spade),
        ]),
        1,
      ],
      [
        CardSetUtils.from([
          CardUtils.create(Rank.Jack, Suit.Club),
          CardUtils.create(Rank.Queen, Suit.Diamond),
        ]),
        1,
      ],
      [
        CardSetUtils.from([
          CardUtils.create(Rank.Six, Suit.Spade),
          CardUtils.create(Rank.Five, Suit.Heart),
        ]),
        1,
      ],
      [
        CardSetUtils.from([
          CardUtils.create(Rank.Ace, Suit.Spade),
          CardUtils.create(Rank.Deuce, Suit.Diamond),
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
            CardUtils.create(Rank.Ace, Suit.Spade),
            CardUtils.create(Rank.Deuce, Suit.Club),
          ]),
          1,
        ],
        [
          CardSetUtils.from([
            CardUtils.create(Rank.Five, Suit.Heart),
            CardUtils.create(Rank.Six, Suit.Spade),
          ]),
          1,
        ],
        [
          CardSetUtils.from([
            CardUtils.create(Rank.Jack, Suit.Diamond),
            CardUtils.create(Rank.Queen, Suit.Heart),
            CardUtils.create(Rank.King, Suit.Club),
          ]),
          1,
        ],
      ])
    ).toThrowErrorMatchingInlineSnapshot(
      `"QhJdKc isn't a card pair (two-length card set)."`
    );
  });
});

// describe("HandRange#format()", () => {
//   it('stringifies HandRange<88-66> into "88-66"', () => {
//     expect(HandRangeUtils.parse("88-66").format()).toBe("88-66");
//   });

//   it('stringifies HandRange<JJ+> into "JJ+"', () => {
//     expect(HandRangeUtils.parse("JJ+").format()).toBe("JJ+");
//   });

//   it('stringifies HandRange<44> into "44"', () => {
//     expect(HandRangeUtils.parse("44").format()).toBe("44");
//   });

//   it('stringifies HandRange<AQs-A9s> into "AQs-A9s"', () => {
//     expect(HandRangeUtils.parse("AQs-A9s").format()).toBe("AQs-A9s");
//   });

//   it('stringifies HandRange<J9o-J6o> into "J9o-J6o"', () => {
//     expect(HandRangeUtils.parse("J9o-J6o").format()).toBe("J9o-J6o");
//   });

//   it('stringifies HandRange<98o-96o> into "96o+"', () => {
//     expect(HandRangeUtils.parse("98o-96o").format()).toBe("96o+");
//   });

//   it('stringifies HandRange<K8s+> into "K8s+"', () => {
//     expect(HandRangeUtils.parse("K8s+").format()).toBe("K8s+");
//   });

//   it('stringifies HandRange<ATo+> into "ATo+"', () => {
//     expect(HandRangeUtils.parse("ATo+").format()).toBe("ATo+");
//   });

//   it('stringifies HandRange<JTs> into "JTs"', () => {
//     expect(HandRangeUtils.parse("JTs").format()).toBe("JTs");
//   });

//   it('stringifies HandRange<72o> into "72o"', () => {
//     expect(HandRangeUtils.parse("72o").format()).toBe("72o");
//   });

//   it('stringifies HandRange<AsKs> into "AsKs"', () => {
//     expect(HandRangeUtils.parse("AsKs").format()).toBe("AsKs");
//   });

//   it('stringifies HandRange<7d6h> into "7d6h"', () => {
//     expect(HandRangeUtils.parse("7d6h").format()).toBe("7d6h");
//   });

//   it('stringifies HandRange<88-66JJ+44AQs-A9s98o-96oK8s+ATo+JTs72o7d6hAsKs> into "JJ+88-6644AQs-A9sATo+K8s+JTs96o+72oAsKs7d6h"', () => {
//     expect(
//       HandRangeUtils.parse(
//         "88-66JJ+44AQs-A9s98o-96oK8s+ATo+JTs72o7d6hAsKs"
//       ).format()
//     ).toBe("JJ+88-6644AQs-A9sATo+K8s+JTs96o+72oAsKs7d6h");
//   });

//   it('stringifies HandRange<> into ""', () => {
//     expect(HandRangeUtils.parse("").format()).toBe("");
//   });
// });
