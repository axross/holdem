import { describe, expect, it } from "@jest/globals";
import { Card } from "./card";
import { CardSet } from "./card-set";
import { Rank } from "./rank";
import { Suit } from "./suit";

describe("CardSet.empty()", () => {
  it("returns a CardSet that is empty", () => {
    expect(CardSet.empty()).toEqual(CardSet.from([]));
  });
});

describe("CardSet.full()", () => {
  it("is a CardSet that has every card", () => {
    const expected = [];

    for (const rank of [
      Rank.Ace,
      Rank.King,
      Rank.Queen,
      Rank.Jack,
      Rank.Ten,
      Rank.Nine,
      Rank.Eight,
      Rank.Seven,
      Rank.Six,
      Rank.Five,
      Rank.Four,
      Rank.Trey,
      Rank.Deuce,
    ]) {
      for (const suit of [Suit.Spade, Suit.Heart, Suit.Diamond, Suit.Club]) {
        expected.push(new Card(rank, suit));
      }
    }

    expect(CardSet.full()).toEqual(CardSet.from(expected));
  });
});

describe("CardSet.parse()", () => {
  test('CardSet.parse("AsKcQhJd") returns CardSet<AsQhJdKc>', () => {
    expect(CardSet.parse("AsKcQhJd")).toEqual(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ])
    );
  });

  test('CardSet.parse("") returns CardSet<AsQhJdKc>', () => {
    expect(CardSet.parse("")).toEqual(CardSet.empty());
  });

  test('CardSet.parse("AsKC") throws an error because it\'s not a valid string', () => {
    expect(() => CardSet.parse("AsKC")).toThrowErrorMatchingInlineSnapshot(
      `""AsKC".substring(2, 4) is not a valid CardString."`
    );
  });

  test('CardSet.parse("AsKcqh") throws an error because it\'s not a valid string', () => {
    expect(() => CardSet.parse("AsKcqh")).toThrowErrorMatchingInlineSnapshot(
      `""AsKcqh".substring(4, 6) is not a valid CardString."`
    );
  });

  test('CardSet.parse("AKs") throws an error because it\'s not a valid string', () => {
    expect(() => CardSet.parse("AKs")).toThrowErrorMatchingInlineSnapshot(
      `""AKs".substring(0, 2) is not a valid CardString."`
    );
  });

  test('CardSet.parse("44") throws an error because it\'s not a valid string', () => {
    expect(() => CardSet.parse("44")).toThrowErrorMatchingInlineSnapshot(
      `""44".substring(0, 2) is not a valid CardString."`
    );
  });

  test('CardSet.parse("As+") throws an error because it\'s not a valid string', () => {
    expect(() => CardSet.parse("As+")).toThrowErrorMatchingInlineSnapshot(
      `""As+".substring(2, 4) is not a valid CardString."`
    );
  });
});

describe("CardSet#size", () => {
  test("CardSet<AsQhJdKc>.size is 4", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).size
    ).toBe(4);
  });

  test("CardSet<As>.size is 1", () => {
    expect(CardSet.from([new Card(Rank.Ace, Suit.Spade)]).size).toBe(1);
  });

  test("CardSet.full().size is 52", () => {
    expect(CardSet.full().size).toBe(52);
  });
});

describe("CardSet#at()", () => {
  test("CardSet<AsQhJdKc>.at(2) is Card<Jd>", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ])
        .at(2)
        ?.equals(new Card(Rank.Jack, Suit.Diamond))
    ).toBe(true);
  });

  test("CardSet<AsQhJdKc>.at(4) is null because it's out of the bounds", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).at(4)
    ).toBe(null);
  });
});

describe("CardSet#has()", () => {
  test("CardSet<AsQhJdKc>.has(Card<Qh>) returns true", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).has(new Card(Rank.Queen, Suit.Heart))
    ).toBe(true);
  });

  test("CardSet<AsQhJdKc>.has(Card<Ah>) returns false", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).has(new Card(Rank.Ace, Suit.Heart))
    ).toBe(false);
  });

  test("CardSet<AsQhJdKc>.has(CardSet<Qh>) returns true", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).has(CardSet.from([new Card(Rank.Queen, Suit.Heart)]))
    ).toBe(true);
  });

  test("CardSet<AsQhJdKc>.has(CardSet<Ah>) returns false", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).has(CardSet.from([new Card(Rank.Ace, Suit.Heart)]))
    ).toBe(false);
  });

  test("CardSet<AsQhJdKc>.has(CardSet.empty()) returns true", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).has(CardSet.empty())
    ).toBe(true);
  });

  test("CardSet.full().has(CardSet<AsQhJdKc>) returns true", () => {
    expect(
      CardSet.full().has(
        CardSet.from([
          new Card(Rank.Ace, Suit.Spade),
          new Card(Rank.King, Suit.Club),
          new Card(Rank.Queen, Suit.Heart),
          new Card(Rank.Jack, Suit.Diamond),
        ])
      )
    ).toBe(true);
  });

  test("CardSet.full().has(CardSet.full()) returns true", () => {
    expect(CardSet.full().has(CardSet.full())).toBe(true);
  });

  test("CardSet.empty().has(CardSet.empty()) returns true", () => {
    expect(CardSet.empty().has(CardSet.empty())).toBe(true);
  });
});

describe("CardSet#added()", () => {
  test("CardSet<AsQhJdKc>.added(CardSet<AhQsJcKd>) returns CardSet<AsAhQsQhJdJcKdKc>", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).added(
        CardSet.from([
          new Card(Rank.Ace, Suit.Heart),
          new Card(Rank.King, Suit.Diamond),
          new Card(Rank.Queen, Suit.Spade),
          new Card(Rank.Jack, Suit.Club),
        ])
      )
    ).toEqual(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.Ace, Suit.Heart),
        new Card(Rank.King, Suit.Diamond),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Spade),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
        new Card(Rank.Jack, Suit.Club),
      ])
    );
  });

  test("CardSet<AsQhJdKc>.added(Card<2c>) returns CardSet<AsQhJdKc2c>", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).added(new Card(Rank.Deuce, Suit.Club))
    ).toEqual(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
        new Card(Rank.Deuce, Suit.Club),
      ])
    );
  });

  test("CardSet<AsQhJdKc>.added(CardSet.full()) returns CardSet.full()", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).added(CardSet.full())
    ).toEqual(CardSet.full());
  });

  test("CardSet<AsQhJdKc>.added(CardSet.empty()) returns CardSet<AsQhJdKc>", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).added(CardSet.empty())
    ).toEqual(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ])
    );
  });

  test("CardSet.full().added(CardSet.full()) returns CardSet.full()", () => {
    expect(CardSet.full().added(CardSet.full())).toEqual(CardSet.full());
  });

  test("CardSet.empty().added(CardSet.empty()) returns CardSet.empty()", () => {
    expect(CardSet.empty().added(CardSet.empty())).toEqual(CardSet.empty());
  });
});

describe("CardSet#removed()", () => {
  test("CardSet<AsQhJdKc>.removed(CardSet<JdKc>) returns CardSet<AsQh>", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).removed(
        CardSet.from([
          new Card(Rank.King, Suit.Club),
          new Card(Rank.Jack, Suit.Diamond),
        ])
      )
    ).toEqual(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.Queen, Suit.Heart),
      ])
    );
  });

  test("CardSet<AsQhJdKc>.removed(Card<Kc>) returns CardSet<AsQhJd>", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).removed(new Card(Rank.King, Suit.Club))
    ).toEqual(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ])
    );
  });

  test("CardSet<AsQhJdKc>.removed(CardSet<KdJc>) returns CardSet<AsQhJdKc>", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).removed(
        CardSet.from([
          new Card(Rank.King, Suit.Diamond),
          new Card(Rank.Jack, Suit.Club),
        ])
      )
    ).toEqual(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ])
    );
  });

  test("CardSet<AsQhJdKc>.removed(CardSet.full()) returns CardSet.empty()", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).removed(CardSet.full())
    ).toEqual(CardSet.empty());
  });

  test("CardSet<AsQhJdKc>.removed(CardSet.empty()) returns CardSet<AsQhJdKc>", () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).removed(CardSet.empty())
    ).toEqual(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ])
    );
  });

  test("CardSet.full().removed(CardSet.full()) returns CardSet.empty()", () => {
    expect(CardSet.full().removed(CardSet.full())).toEqual(CardSet.empty());
  });

  test("CardSet.empty().removed(CardSet.empty()) returns CardSet.empty()", () => {
    expect(CardSet.empty().removed(CardSet.empty())).toEqual(CardSet.empty());
  });
});

describe("CardSet#format()", () => {
  test('CardSet<AsQhJdKc>.format() returns "AsQhJdKc"', () => {
    expect(
      CardSet.from([
        new Card(Rank.Ace, Suit.Spade),
        new Card(Rank.King, Suit.Club),
        new Card(Rank.Queen, Suit.Heart),
        new Card(Rank.Jack, Suit.Diamond),
      ]).format()
    ).toBe("AsKcQhJd");
  });

  test('CardSet.empty().format() returns ""', () => {
    expect(CardSet.empty().format()).toBe("");
  });
});

test("CardSet is iterable and iterates on each card", () => {
  const cardSet = CardSet.from([
    new Card(Rank.Ace, Suit.Spade),
    new Card(Rank.King, Suit.Club),
    new Card(Rank.Queen, Suit.Heart),
    new Card(Rank.Jack, Suit.Diamond),
  ]);
  const cards = [];

  for (const card of cardSet) {
    cards.push(card);
  }

  expect(cards).toEqual([
    new Card(Rank.Ace, Suit.Spade),
    new Card(Rank.Queen, Suit.Heart),
    new Card(Rank.Jack, Suit.Diamond),
    new Card(Rank.King, Suit.Club),
  ]);
});
