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

describe.only("HandRangeUtils.format()", () => {
  it("stringifies HandRange<AA-22>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("AA-22"))).toBe("22+:1");
  });

  it("stringifies HandRange<KK-JJ:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("KK-JJ:1"))).toBe(
      "KK-JJ:1"
    );
  });

  it("stringifies HandRange<55-22:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("55-22:1"))).toBe(
      "55-22:1"
    );
  });

  it("stringifies HandRange<AA:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("AA:1"))).toBe("AA:1");
  });

  it("stringifies HandRange<22:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("22:1"))).toBe("22:1");
  });

  it("stringifies HandRange<AA-QQ:1,TT-88:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("AA-QQ:1,TT-88:1"))).toBe(
      "QQ+:1,TT-88:1"
    );
  });

  it("stringifies HandRange<88-66:1,55-44:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("88-66:1,55-44:1"))).toBe(
      "88-44:1"
    );
  });

  it("stringifies HandRange<88-66:0.5,55-44:1>", () => {
    expect(
      HandRangeUtils.format(HandRangeUtils.parse("88-66:0.5,55-44:1"))
    ).toBe("88-66:0.5,55-44:1");
  });

  it("stringifies HandRange<65s-62s>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("65s-62s"))).toBe(
      "62s+:1"
    );
  });

  it("stringifies HandRange<75s-73s:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("75s-73s:1"))).toBe(
      "75s-73s:1"
    );
  });

  it("stringifies HandRange<75s-72s:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("74s-72s:1"))).toBe(
      "74s-72s:1"
    );
  });

  it("stringifies HandRange<65s:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("65s:1"))).toBe("65s:1");
  });

  it("stringifies HandRange<32s:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("32s:1"))).toBe("32s:1");
  });

  it("stringifies HandRange<65o-62o>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("65o-62o"))).toBe(
      "62o+:1"
    );
  });

  it("stringifies HandRange<75o-73o:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("75o-73o:1"))).toBe(
      "75o-73o:1"
    );
  });

  it("stringifies HandRange<75o-72o:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("74o-72o:1"))).toBe(
      "74o-72o:1"
    );
  });

  it("stringifies HandRange<65o:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("65o:1"))).toBe("65o:1");
  });

  it("stringifies HandRange<32o:1>", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse("32o:1"))).toBe("32o:1");
  });

  it("stringifies HandRange<75o-73o:1,65o-62o>", () => {
    expect(
      HandRangeUtils.format(HandRangeUtils.parse("75o-73o:1,65o-62o"))
    ).toBe("75o-73o:1,62o+:1");
  });

  it("stringifies HandRange<AsKs:1,AhKh:1,AdKd:1,AcKc:1>", () => {
    expect(
      HandRangeUtils.format(HandRangeUtils.parse("AsKs:1,AhKh:1,AdKd:1,AcKc:1"))
    ).toBe("AKs:1");
  });

  it("stringifies HandRange<AsKs:1,AhKh:1,AcKc:1>", () => {
    expect(
      HandRangeUtils.format(HandRangeUtils.parse("AsKs:1,AhKh:1,AcKc:1"))
    ).toBe("AsKs:1,AhKh:1,AcKc:1");
  });

  it("stringifies HandRange<AsKh:1,AsKd:1,AsKc:1,AhKs:1,AhKd:1,AhKc:1,AdKs:1,AdKh:1,AdKc:1,AcKs:1,AcKh:1,AcKd:1>", () => {
    expect(
      HandRangeUtils.format(
        HandRangeUtils.parse(
          "AsKh:1,AsKd:1,AsKc:1,AhKs:1,AhKd:1,AhKc:1,AdKs:1,AdKh:1,AdKc:1,AcKs:1,AcKh:1,AcKd:1"
        )
      )
    ).toBe("AKo:1");
  });

  it("stringifies HandRange<AsKh:1,AsKd:1,AsKc:1,AhKs:1,AhKc:1,AdKs:1,AdKh:1,AdKc:1,AcKs:1,AcKh:1,AcKd:1>", () => {
    expect(
      HandRangeUtils.format(
        HandRangeUtils.parse(
          "AsKh:1,AsKd:1,AsKc:1,AhKs:1,AhKc:1,AdKs:1,AdKh:1,AdKc:1,AcKs:1,AcKh:1,AcKd:1"
        )
      )
    ).toBe(
      "AsKh:1,AsKd:1,AsKc:1,AhKs:1,AhKc:1,AdKs:1,AdKh:1,AdKc:1,AcKs:1,AcKh:1,AcKd:1"
    );
  });

  it("stringifies HandRange<65s-62s,KK-JJ:1,75o-73o:1>", () => {
    expect(
      HandRangeUtils.format(HandRangeUtils.parse("65s-62s,KK-JJ:1,75o-73o:1"))
    ).toBe("KK-JJ:1,75o-73o:1,62s+:1");
  });

  it("stringifies HandRange<6s5h:1,AsKd:1,4h8d:1,6c6s:1>", () => {
    expect(
      HandRangeUtils.format(HandRangeUtils.parse("6s5h:1,AsKd:1,4h8d:1,6c6s:1"))
    ).toBe("AsKd:1,8d4h:1,6s6c:1,6s5h:1");
  });

  it("stringifies a complex HandRange", () => {
    expect(
      HandRangeUtils.format(
        HandRangeUtils.parse(
          "2d2c: 1,2h2c: 1,2h2d: 1,2s2c: 1,2s2d: 1,2s2h: 1,3d3c: 1,3h3c: 1,3h3d: 1,3s3c: 1,3s3d: 1,3s3h: 1,4d4c: 1,4h4c: 1,4h4d: 1,4s4c: 1,4s4d: 1,4s4h: 1,5c3c: 0.095,5c4c: 1,5d3d: 0.095,5d4d: 1,5d5c: 1,5h3h: 0.095,5h4h: 1,5h5c: 1,5h5d: 1,5s3s: 0.095,5s4s: 1,5s5c: 1,5s5d: 1,5s5h: 1,6c4c: 1,6c5c: 1,6d4d: 1,6d5d: 1,6d6c: 1,6h4h: 1,6h5h: 1,6h6c: 1,6h6d: 1,6s4s: 1,6s5s: 1,6s6c: 1,6s6d: 1,6s6h: 1,7c5c: 1,7c6c: 1,7d5d: 1,7d6d: 1,7d7c: 1,7h5h: 1,7h6h: 1,7h7c: 1,7h7d: 1,7s5s: 1,7s6s: 1,7s7c: 1,7s7d: 1,7s7h: 1,8c5c: 0.835,8c6c: 1,8c7c: 1,8d5d: 0.835,8d6d: 1,8d7d: 1,8d8c: 1,8h5h: 0.835,8h6h: 1,8h7h: 1,8h8c: 1,8h8d: 1,8s5s: 0.835,8s6s: 1,8s7s: 1,8s8c: 1,8s8d: 1,8s8h: 1,9c6c: 1,9c7c: 1,9c8c: 1,9c8d: 0.685,9c8h: 0.685,9c8s: 0.685,9d6d: 1,9d7d: 1,9d8c: 0.685,9d8d: 1,9d8h: 0.685,9d8s: 0.685,9d9c: 1,9h6h: 1,9h7h: 1,9h8c: 0.685,9h8d: 0.685,9h8h: 1,9h8s: 0.685,9h9c: 1,9h9d: 1,9s6s: 1,9s7s: 1,9s8c: 0.685,9s8d: 0.685,9s8h: 0.685,9s8s: 1,9s9c: 1,9s9d: 1,9s9h: 1,Tc5c: 0.305,Tc6c: 1,Tc7c: 1,Tc8c: 1,Tc8d: 0.955,Tc8h: 0.955,Tc8s: 0.955,Tc9c: 1,Tc9d: 1,Tc9h: 1,Tc9s: 1,Td5d: 0.305,Td6d: 1,Td7d: 1,Td8c: 0.955,Td8d: 1,Td8h: 0.955,Td8s: 0.955,Td9c: 1,Td9d: 1,Td9h: 1,Td9s: 1,TdTc: 1,Th5h: 0.305,Th6h: 1,Th7h: 1,Th8c: 0.955,Th8d: 0.955,Th8h: 1,Th8s: 0.955,Th9c: 1,Th9d: 1,Th9h: 1,Th9s: 1,ThTc: 1,ThTd: 1,Ts5s: 0.305,Ts6s: 1,Ts7s: 1,Ts8c: 0.955,Ts8d: 0.955,Ts8h: 0.955,Ts8s: 1,Ts9c: 1,Ts9d: 1,Ts9h: 1,Ts9s: 1,TsTc: 1,TsTd: 1,TsTh: 1,Jc3c: 0.315,Jc4c: 1,Jc5c: 1,Jc6c: 1,Jc7c: 1,Jc8c: 1,Jc8d: 0.34,Jc8h: 0.34,Jc8s: 0.34,Jc9c: 1,Jc9d: 1,Jc9h: 1,Jc9s: 1,JcTc: 1,JcTd: 1,JcTh: 1,JcTs: 1,Jd3d: 0.315,Jd4d: 1,Jd5d: 1,Jd6d: 1,Jd7d: 1,Jd8c: 0.34,Jd8d: 1,Jd8h: 0.34,Jd8s: 0.34,Jd9c: 1,Jd9d: 1,Jd9h: 1,Jd9s: 1,JdTc: 1,JdTd: 1,JdTh: 1,JdTs: 1,JdJc: 1,Jh3h: 0.315,Jh4h: 1,Jh5h: 1,Jh6h: 1,Jh7h: 1,Jh8c: 0.34,Jh8d: 0.34,Jh8h: 1,Jh8s: 0.34,Jh9c: 1,Jh9d: 1,Jh9h: 1,Jh9s: 1,JhTc: 1,JhTd: 1,JhTh: 1,JhTs: 1,JhJc: 1,JhJd: 1,Js3s: 0.315,Js4s: 1,Js5s: 1,Js6s: 1,Js7s: 1,Js8c: 0.34,Js8d: 0.34,Js8h: 0.34,Js8s: 1,Js9c: 1,Js9d: 1,Js9h: 1,Js9s: 1,JsTc: 1,JsTd: 1,JsTh: 1,JsTs: 1,JsJc: 1,JsJd: 1,JsJh: 1,Qc2c: 1,Qc3c: 1,Qc4c: 1,Qc5c: 1,Qc6c: 1,Qc7c: 1,Qc8c: 1,Qc9c: 1,Qc9d: 1,Qc9h: 1,Qc9s: 1,QcTc: 1,QcTd: 1,QcTh: 1,QcTs: 1,QcJc: 1,QcJd: 1,QcJh: 1,QcJs: 1,Qd2d: 1,Qd3d: 1,Qd4d: 1,Qd5d: 1,Qd6d: 1,Qd7d: 1,Qd8d: 1,Qd9c: 1,Qd9d: 1,Qd9h: 1,Qd9s: 1,QdTc: 1,QdTd: 1,QdTh: 1,QdTs: 1,QdJc: 1,QdJd: 1,QdJh: 1,QdJs: 1,QdQc: 1,Qh2h: 1,Qh3h: 1,Qh4h: 1,Qh5h: 1,Qh6h: 1,Qh7h: 1,Qh8h: 1,Qh9c: 1,Qh9d: 1,Qh9h: 1,Qh9s: 1,QhTc: 1,QhTd: 1,QhTh: 1,QhTs: 1,QhJc: 1,QhJd: 1,QhJh: 1,QhJs: 1,QhQc: 1,QhQd: 1,Qs2s: 1,Qs3s: 1,Qs4s: 1,Qs5s: 1,Qs6s: 1,Qs7s: 1,Qs8s: 1,Qs9c: 1,Qs9d: 1,Qs9h: 1,Qs9s: 1,QsTc: 1,QsTd: 1,QsTh: 1,QsTs: 1,QsJc: 1,QsJd: 1,QsJh: 1,QsJs: 1,QsQc: 1,QsQd: 1,QsQh: 1,Kc2c: 1,Kc3c: 1,Kc4c: 1,Kc5c: 1,Kc6c: 1,Kc7c: 1,Kc7d: 0.275,Kc7h: 0.275,Kc7s: 0.275,Kc8c: 1,Kc8d: 0.685,Kc8h: 0.685,Kc8s: 0.685,Kc9c: 1,Kc9d: 1,Kc9h: 1,Kc9s: 1,KcTc: 1,KcTd: 1,KcTh: 1,KcTs: 1,KcJc: 1,KcJd: 1,KcJh: 1,KcJs: 1,KcQc: 1,KcQd: 1,KcQh: 1,KcQs: 1,Kd2d: 1,Kd3d: 1,Kd4d: 1,Kd5d: 1,Kd6d: 1,Kd7c: 0.275,Kd7d: 1,Kd7h: 0.275,Kd7s: 0.275,Kd8c: 0.685,Kd8d: 1,Kd8h: 0.685,Kd8s: 0.685,Kd9c: 1,Kd9d: 1,Kd9h: 1,Kd9s: 1,KdTc: 1,KdTd: 1,KdTh: 1,KdTs: 1,KdJc: 1,KdJd: 1,KdJh: 1,KdJs: 1,KdQc: 1,KdQd: 1,KdQh: 1,KdQs: 1,KdKc: 1,Kh2h: 1,Kh3h: 1,Kh4h: 1,Kh5h: 1,Kh6h: 1,Kh7c: 0.275,Kh7d: 0.275,Kh7h: 1,Kh7s: 0.275,Kh8c: 0.685,Kh8d: 0.685,Kh8h: 1,Kh8s: 0.685,Kh9c: 1,Kh9d: 1,Kh9h: 1,Kh9s: 1,KhTc: 1,KhTd: 1,KhTh: 1,KhTs: 1,KhJc: 1,KhJd: 1,KhJh: 1,KhJs: 1,KhQc: 1,KhQd: 1,KhQh: 1,KhQs: 1,KhKc: 1,KhKd: 1,Ks2s: 1,Ks3s: 1,Ks4s: 1,Ks5s: 1,Ks6s: 1,Ks7c: 0.275,Ks7d: 0.275,Ks7h: 0.275,Ks7s: 1,Ks8c: 0.685,Ks8d: 0.685,Ks8h: 0.685,Ks8s: 1,Ks9c: 1,Ks9d: 1,Ks9h: 1,Ks9s: 1,KsTc: 1,KsTd: 1,KsTh: 1,KsTs: 1,KsJc: 1,KsJd: 1,KsJh: 1,KsJs: 1,KsQc: 1,KsQd: 1,KsQh: 1,KsQs: 1,KsKc: 1,KsKd: 1,KsKh: 1,Ac2c: 1,Ac3c: 1,Ac3d: 0.155,Ac3h: 0.155,Ac3s: 0.155,Ac4c: 1,Ac4d: 1,Ac4h: 1,Ac4s: 1,Ac5c: 1,Ac5d: 1,Ac5h: 1,Ac5s: 1,Ac6c: 1,Ac6d: 1,Ac6h: 1,Ac6s: 1,Ac7c: 1,Ac7d: 1,Ac7h: 1,Ac7s: 1,Ac8c: 1,Ac8d: 1,Ac8h: 1,Ac8s: 1,Ac9c: 1,Ac9d: 1,Ac9h: 1,Ac9s: 1,AcTc: 1,AcTd: 1,AcTh: 1,AcTs: 1,AcJc: 1,AcJd: 1,AcJh: 1,AcJs: 1,AcQc: 1,AcQd: 1,AcQh: 1,AcQs: 1,AcKc: 1,AcKd: 1,AcKh: 1,AcKs: 1,Ad2d: 1,Ad3c: 0.155,Ad3d: 1,Ad3h: 0.155,Ad3s: 0.155,Ad4c: 1,Ad4d: 1,Ad4h: 1,Ad4s: 1,Ad5c: 1,Ad5d: 1,Ad5h: 1,Ad5s: 1,Ad6c: 1,Ad6d: 1,Ad6h: 1,Ad6s: 1,Ad7c: 1,Ad7d: 1,Ad7h: 1,Ad7s: 1,Ad8c: 1,Ad8d: 1,Ad8h: 1,Ad8s: 1,Ad9c: 1,Ad9d: 1,Ad9h: 1,Ad9s: 1,AdTc: 1,AdTd: 1,AdTh: 1,AdTs: 1,AdJc: 1,AdJd: 1,AdJh: 1,AdJs: 1,AdQc: 1,AdQd: 1,AdQh: 1,AdQs: 1,AdKc: 1,AdKd: 1,AdKh: 1,AdKs: 1,AdAc: 1,Ah2h: 1,Ah3c: 0.155,Ah3d: 0.155,Ah3h: 1,Ah3s: 0.155,Ah4c: 1,Ah4d: 1,Ah4h: 1,Ah4s: 1,Ah5c: 1,Ah5d: 1,Ah5h: 1,Ah5s: 1,Ah6c: 1,Ah6d: 1,Ah6h: 1,Ah6s: 1,Ah7c: 1,Ah7d: 1,Ah7h: 1,Ah7s: 1,Ah8c: 1,Ah8d: 1,Ah8h: 1,Ah8s: 1,Ah9c: 1,Ah9d: 1,Ah9h: 1,Ah9s: 1,AhTc: 1,AhTd: 1,AhTh: 1,AhTs: 1,AhJc: 1,AhJd: 1,AhJh: 1,AhJs: 1,AhQc: 1,AhQd: 1,AhQh: 1,AhQs: 1,AhKc: 1,AhKd: 1,AhKh: 1,AhKs: 1,AhAc: 1,AhAd: 1,As2s: 1,As3c: 0.155,As3d: 0.155,As3h: 0.155,As3s: 1,As4c: 1,As4d: 1,As4h: 1,As4s: 1,As5c: 1,As5d: 1,As5h: 1,As5s: 1,As6c: 1,As6d: 1,As6h: 1,As6s: 1,As7c: 1,As7d: 1,As7h: 1,As7s: 1,As8c: 1,As8d: 1,As8h: 1,As8s: 1,As9c: 1,As9d: 1,As9h: 1,As9s: 1,AsTc: 1,AsTd: 1,AsTh: 1,AsTs: 1,AsJc: 1,AsJd: 1,AsJh: 1,AsJs: 1,AsQc: 1,AsQd: 1,AsQh: 1,AsQs: 1,AsKc: 1,AsKd: 1,AsKh: 1,AsKs: 1,AsAc: 1,AsAd: 1,AsAh: 1"
        )
      )
    ).toBe(
      "22+:1,A2s+:1,A4o+:1,A3o:0.155,K2s+:1,K9o+:1,K8o:0.685,K7o:0.275,Q2s+:1,Q9o+:1,J4s+:1,J3s:0.315,J9o+:1,J8o:0.34,T6s+:1,T5s:0.305,T9o:1,T8o:0.955,96s+:1,98o:0.685,86s+:1,85s:0.835,75s+:1,64s+:1,54s:1,53s:0.095"
    );
  });

  it("stringifies an empty HandRange", () => {
    expect(HandRangeUtils.format(HandRangeUtils.parse(""))).toBe("");
  });
});
