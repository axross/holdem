# holdem

A fast implementation of Texas Hold'em poker odds calculator and its related data models.

[![npm version](https://badge.fury.io/js/bemmer.svg)](http://badge.fury.io/js/bemmer)
[![license](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](LICENSE)

<img src="banner.png" alt="holdem" width="640">

- 🏃‍♀️ Blazing fast odds evaluation
- ⚙️ Customizable and providing useful helpers
- 💯 Written in 100% pure universal JavaScript - run on both Node and browsers
- ✅ Fully tested

## API

table comes here

### Rank

A enum-like representation of rank in playing cards.

```ts
Rank.Ace;    // => A of playing cards
Rank.Deuce;  // => 2 of playing cards
```

#### `Rank#parse(char: string): Rank`

Parses a char (= 1-charactor-length string) into a Rank.

```ts
Rank.parse("A") === Rank.Ace;
Rank.parse("T") === Rank.Ten;
Rank.parse("5") === Rank.Five;
```

Only `"A"`, `"K"`, `"Q"`, `"J"`, `"T"`, `"9"`, `"8"`, `"7"`, `"6"`, `"5"`, `"4"`, `"3"` or `"2"` is acceptable.


```ts
Rank.parse("a");  // => Error: "a" is not a valid string value for Rank.parse().
```

For consistency reason, it needs to be a string even for number-based ranks (e.g. `"4"`).

```ts
Rank.parse("4") === Rank.Four;
Rank.parse(4);  // => Error: 4 is not a valid string value for Rank.parse().
```

#### `Rank#compare(other: Rank): number`

Compares two ranks in power order and returns integer compatible with [`Array#sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

```ts
Rank.Ace.compare(Rank.King);   // => negative integer
Rank.King.compare(Rank.Ace);   // => positive integer
Rank.Ace.compare(Rank.Ace);    // => 0
Rank.Ace.compare(Rank.Deuce);  // => positive integer
```

#### `Rank#format(): string`

Returns a char for the Rank. The returning string is compatible for `Rank.parse()`.

```ts
Rank.Ace.format() === "A";
Rank.Ten.format() === "T";
Rank.Five.format() === "5";
```

### Suit

A enum-like representation of suit in playing cards.

```ts
Suit.Spade;    // => spade of playing cards
Suit.Diamond;  // => diamond of playing cards
```

#### `Suit.parse(char: string): Suit`

Parses a char (= 1-charactor-length string) into a Suit.

```ts
Suit.parse("s") === "s";
Suit.parse("h") === "h";
Suit.parse("d") === "d";
Suit.parse("c") === "c";
```

Only `"s"`, `"h"`, `"d"`, or `"c"` is acceptable.

```ts
Suit.parse("S");  // => Error: "S" is not a valid string value for Suit.parse().
```

#### `Suit#compare(other: Suit): number`

Compares two ranks in index order and returns integer compatible with [`Array#sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

It results in the ordinal order that how it should usually be in poker.

```ts
Suit.Spade.compare(Suit.Heart);   // => negative integer
Suit.Club.compare(Suit.Diamond);  // => positive integer
Suit.Heart.compare(Suit.Heart);   // => 0
```

#### `Suit#format(): string`

Returns a char for the Suit. The returning string is compatible for `Suit.parse()`.

```ts
Suit.Spade.format() === "s";
Suit.Diamond.format() === "d";
```

### Card

A class representing a piece of playing cards.

#### `Card.parse(expression: string): Card`

Parses a string into a Card.

```ts
Card.parse("As").equals(new Card(Rank.Ace, Suit.Spade));    // => true
Card.parse("2s").equals(new Card(Rank.Deuce, Suit.Spade));  // => true
Card.parse("Kc").equals(new Card(Rank.King, Suit.Club));    // => true
```

#### `new Card(rank: Rank, suit: Suit): Card`

Creates a Card from a given pair of Rank and Suit.

```ts
new Card(Rank.Ace, Suit.Spade);
```

#### `Card#rank: Rank`

Rank of the Card.

```ts
new Card(Rank.Ace, Suit.Spade).rank === Rank.Ace;    // => true
new Card(Rank.Trey, Suit.Heart).rank === Rank.Trey;  // => true
new Card(Rank.Ten, Suit.Diamond).rank === Rank.Ten;  // => true
new Card(Rank.Six, Suit.Club).rank === Rank.Six;     // => true
```

#### `Card#suit: Suit`

Suit of the Card.

```ts
new Card(Rank.Ace, Suit.Spade).suit === Suit.Spade;      // => true
new Card(Rank.Trey, Suit.Heart).suit === Suit.Heart;     // => true
new Card(Rank.Ten, Suit.Diamond).suit === Suit.Diamond;  // => true
new Card(Rank.Six, Suit.Club).suit === Suit.Club;        // => true
```

#### `Card#compare(other: Card): number`

Compares two cards in power order and returns integer compatible with [`Array#sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

```ts
new Card(Rank.Ace, Suit.Spade).compare(new Card(Rank.Ace, Suit.Diamond));  // => negative integer
new Card(Rank.Ace, Suit.Diamond).compare(new Card(Rank.Six, Suit.Heart));  // => negative integer
new Card(Rank.Queen, Suit.Spade).compare(new Card(Rank.Ace, Suit.Heart));  // => positive integer
new Card(Rank.Ace, Suit.Club).compare(new Card(Rank.Ace, Suit.Club));      // => 0
```

#### `Card#equals(other: Card): boolean`

Whether the given card has the same rank and suit or not.

```ts
new Card(Rank.Ace, Suit.Spade).equals(new Card(Rank.Ace, Suit.Spade));    // => true
new Card(Rank.Ace, Suit.Spade).equals(new Card(Rank.Ace, Suit.Diamond));  // => false
new Card(Rank.Ace, Suit.Spade).equals(new Card(Rank.Deuce, Suit.Spade));  // => false
```

#### `Card#format(): string`

Stringifies a Card.

```ts
new Card(Rank.Ace, Suit.Spade).format() === "As";
new Card(Rank.Deuce, Suit.Spade).format() === "2s";
new Card(Rank.King, Suit.Club).format() === "Kc";
```

### CardSet

Immutable and performant set of Card(s).

#### `CardSet.empty(): CardSet`

An empty CardSet.

#### `CardSet.full(): CardSet`

A CardSet that has all the cards.

#### `CardSet.from(cards: Iterable<Card>): CardSet`

Creates a CardSet from Cards.

```ts
const cardSet = CardSet.from([
  new Card(Rank.Ace, Suit.Spade),
  new Card(Rank.King, Rank.Club),
  new Card(Rank.Queen, Rank.Queen),
  new Card(Rank.Jack, Rank.Diamond),
]);
```

#### `CardSet.parse(value: string): CardSet`

Parses a string into CardSet.

```ts
CardSetUtils.parse("AsQhJdKc") === CardSet.from([
  new Card(Rank.Ace, Suit.Spade),
  new Card(Rank.King, Rank.Club),
  new Card(Rank.Queen, Rank.Queen),
  new Card(Rank.Jack, Rank.Diamond),
]);  // => true
CardSetUtils.parse("") === CardSetUtils.empty;  // => true
```

#### `CardSet#size: number`

Returns number of cards in a CardSet.

```ts
const cardSet = CardSet.from([
  new Card(Rank.Ace, Suit.Spade),
  new Card(Rank.King, Rank.Club),
  new Card(Rank.Queen, Rank.Queen),
  new Card(Rank.Jack, Rank.Diamond),
]);

cardSet.size;          // => 4
CardSet.empty().size;  // => 0
CardSet.full().size;   // => 52
```

#### `CardSet#has(other: Card | CardSet): boolean`

Returns whether a CardSet contains a Card or all the Card in another CardSet.

```ts
const cardSet = CardSet.from([
  new Card(Rank.Ace, Suit.Spade),
  new Card(Rank.King, Suit.Club),
  new Card(Rank.Queen, Suit.Heart),
  new Card(Rank.Jack, Suit.Diamond),
]);

cardSet.has(CardSet.from([
  new Card(Rank.Ace, Suit.Spade),
  new Card(Rank.Queen, Suit.Heart),
]));  // => true

cardSet.has(CardSet.from([
  new Card(Rank.Ace, Suit.Spade),
  new Card(Rank.Ace, Suit.Heart),
]));  // => false

cardSet.has(new Card(Rank.Ace, Suit.Spade));  // => true

cardSet.has(CardSet.empty());  // => true
```

#### `CardSet#at(index: number): Card | null`

Returns Card at the index.

```ts
const cardSet = CardSet.from([
  new Card(Rank.Ace, Suit.Spade),
  new Card(Rank.King, Suit.Club),
  new Card(Rank.Queen, Suit.Heart),
  new Card(Rank.Jack, Suit.Diamond),
]);

cardSet.at(2);  // => Card<Jd>
```

#### `CardSet#added(other: Card | CardSet): CardSet`

Returns an union of CardSet(s).

```ts
CardSetUtils.union(
  CardSet.from([
    new Card(Rank.Ace, Suit.Spade),
    new Card(Rank.Queen, Rank.Queen),
  ]),
  CardSet.from([
    new Card(Rank.King, Rank.Club),
    new Card(Rank.Jack, Rank.Diamond),
  ]),
) === CardSet.from([
  new Card(Rank.Ace, Suit.Spade),
  new Card(Rank.King, Rank.Club),
  new Card(Rank.Queen, Rank.Queen),
  new Card(Rank.Jack, Rank.Diamond),
]);
```

#### `CardSet#removed(other: Card | CardSet): CardSet`

Returns a difference (=relative complement) of CardSet(s).

```ts
CardSet.from([
  new Card(Rank.Ace, Suit.Spade),
  new Card(Rank.Queen, Rank.Queen),
]).union(
  CardSet.from([
    new Card(Rank.King, Rank.Club),
    new Card(Rank.Jack, Rank.Diamond),
  ]),
).equals(
  CardSet.from([
    new Card(Rank.Ace, Suit.Spade),
    new Card(Rank.King, Rank.Club),
    new Card(Rank.Queen, Rank.Queen),
    new Card(Rank.Jack, Rank.Diamond),
  ])
);  // => true
```

#### `CardSet#format(): string`

Stringifies a CardSet.

```ts
CardSet.from([
  new Card(Rank.Ace, Suit.Spade),
  new Card(Rank.Queen, Rank.Queen),
  new Card(Rank.Jack, Rank.Diamond),
  new Card(Rank.King, Rank.Club),
]).format() === "AsQhJdKc";
```

### HandRange

An immutable map class that represents a set of CardPair(s) and their existance probability.

As HandRange is iterable of `[CardSet, number]`, you can use this in for loop.

```ts
for (const [cardSet, probability] of HandRange.parse("88-66")) {
  // ...
}
```

#### `HandRange.empty(): HandRange`

Returns an empty HandRange.

```ts
const handRange = HandRange.empty();
```

#### `HandRange.parse(): HandRange`

Parses a string and returns a HandRange.

The parameter string needs to be comma-separated parts. Each parts should be `<hand>:<probability>` where `<hand>` is the following specifiers and `<probability>` is float.

- `AsKc` - specific pair of cards.
- `66` - all pocket pair combinations of six.
- `AKs` - all suited pair combinations of ace and king.
- `T9o` - all ofsuit pair combinations of ten and nine.
- `JJ-99` - all pocket combinations of `JJ`, `TT` and `99`.
- `86s-84s` - all suited combinations of `86s`, `85s` and `84s`.
- `AJo-A9o` - all ofsuite combinations of `AJo`, `ATo` and `A9o`.
- `JJ+` - equivalent to `AA-JJ`.
- `85s+` - equivalent to `87s-85s`.
- `AQo+` - equivalent to `AKo-AQo`.

The probability can be omitted. `AsKs` works as same as `AsKs:1`.


```ts
const handRange = HandRange.parse("88-66:0.66,JJ+:0.5,44,AQs-A9s:0.2");
```

#### `HandRange.from(): HandRange`

Returns a HandRange that contains all the given entries of CardSet and its existance probability.

```ts
const handRange = HandRange.from([
  CardSet.parse("AsKs"),
  CardSet.parse("8h8d"),
  CardSet.parse("6s5s"),
]);
```

#### `HandRange#size: number`

Number of entries in the HandRange.

```ts
const handRange = HandRange.parse("88-66");
handRange.size;  // => 18
```

#### `HandRange#get(cardSet: CardSet): number | null`

Returns probability for the given CardSet.

```ts
const handRange = HandRange.parse("88:1,77:0.5,66:0.25");
const probability = handRange.get(CardSet.parse("7s7d"));
```

#### `HandRange#added(other: HandRange): HandRange`

Returns an union of the HandRange and the given one.

```ts
const handRange = HandRange.parse("88-66");
const ninesAdded = handRange.added(HandRange.parse("99"));
```

#### `HandRange#removed(other: HandRange): HandRange`

Returns a new HandRange that the given hand range removed.

```ts
const handRange = HandRange.parse("88-66");
const sevensRemoved = handRange.removed(HandRange.parse("77"));
```

#### `HandRange#onlyRankPairs(): Map<string, number>`

Returns a map of rank pair string and its probability. Map key is string representation of rank pair such as `AsKh`. Detatched card pairs are ignored.

```ts
const handRange = HandRange.parse("AKs:0.5");
const onlyRankPairs = handRange.onlyRankPairs();

onlyRankPairs.entries();  // => Iterable of ["AsKs", 0.5], ["AhKh", 0.5], ...
```

#### `HandRange#format(): string`

Returns formatted string representation of the HandRange. Each card pairs will be merged and grouped into rank pairs.

```ts
const handRange = HandRange.parse("AsKs:1,AhKh:1,AdKd:1,AcKc:1");

handRange.format();  // => "AKs:1"
```

### Evaluator

A class that evaluates equity of each player in a certain situation.

You can use either of these implementations:

- `new MontecarloEvaluator()` - randomly decides the possible situations can come and evaluate equities.
- `new ExhaustiveEvaluator()` - exhaustively iterates all the possible situations and evaluate equities.

Evaluator implements `Iterable<Matchup>` so you can use it in for-loop.

```ts
const evaluator = new ExhaustiveEvaluator({
  board: CardSet.parse("AsKcQh2d"),
  players: [
    HandRange.parse("KdJd"),
    HandRange.parse("Ah3h"),
  ],
});

for (const matchup of evaluator) {
  // ...
}
```

#### `Evaluator#board: CardSet`

The initial board cards for the situation.

#### `Evaluator#players: HandRange[]`

The HandRange(s) that the players have.

### MontecarloEvaluator

An Evaluator that does montecarlo simulation for certain times.

Do not forget to call `#take()` because this evaluator can run unlimited times.

```ts
const evaluator = new MontecarloEvaluator({
  board: CardSet.parse("AsKcQh2d"),
  players: [
    HandRange.parse("KdJd"),
    HandRange.parse("Ah3h"),
  ],
});

for (const matchup of evaluator.take(10000)) {
  // ...
}
```

#### `MontecarloEvaluator#take(times: number): Iterable<Matchup>`

Limits times to run and returns `Iterable<Matchup>`.

```ts
const evaluator = new MontecarloEvaluator({
  board: CardSet.parse("AsKcQh2d"),
  players: [
    HandRange.parse("KdJd"),
    HandRange.parse("Ah3h"),
  ],
});

for (const matchup of evaluator.take(10000)) {
  // ...
}
```

### ExhaustiveEvaluator

An Evaluator that exhaustively simulates all the possible situations. This is suitable for the situation that has only small number of possible futures.

```ts
const evaluator = new ExhaustiveEvaluator({
  board: CardSet.parse("AsKcQh2d"),
  players: [
    HandRange.parse("KdJd"),
    HandRange.parse("Ah3h"),
  ],
});

for (const matchup of evaluator) {
  // ...
}
```

### Matchup

The eventual situation of the evaluation and its result.

#### `Matchup#board: CardSet`

The eventual board card in the situation.

#### `Matchup#players: { cards: CardSet; hand: MadeHand; win: boolean }[]`

Result of each player in the situation.

#### `Matchup#wonPlayerCount: number`

Number of the players won the pot.

### MadeHand

The final hand that player made at showdown.

#### `MadeHand#powerIndex: number`

The power index of the MadeHand. `0` is the strongest (the top straight flush), `7462` is the worst trash hand.

#### `MadeHand#type: "highcard" | "pair" | "two-pairs" | "trips" | "straight" | "flush" | "full-house" | "quads" | "straight-flush"`

The type of MadeHand.

## Contributing

Please folk and clone the repository and run `npm install`. Make a pull request towards `main` branch in this repository.

## License

[MIT](https://github.com/axross/holdem/blob/main/LICENSE)
