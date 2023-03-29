# holdem

## API

### Card

Card is expressed in integer binary (2^0 <= n <= 2^51). `0b1` is ace of spade. `0b10` is deuce of spade. `0b1000000000000000000000000000000000000000000000000000n` is king of club.

Normally you can create Cards by using `CardUtils.create()` and/or `CardUtils.parse()`.

### CardUtils

An utility function set for Cards.

#### `CardUtils.create(rank: Rank, suit: Suit): Card`

Creates a Card from a given pair of Rank and Suit.

```ts
const aceOfSpade = CardUtils.create(Rank.Ace, Suit.Spade);
const deuceOfSpade = CardUtils.create(Rank.Deuce, Suit.Spade);
const kingOfClub = CardUtils.create(Rank.King, Suit.Club);
```

#### `CardUtils.parse(value: string): Card`

Parses a string into a Card.

```ts
CardUtils.parse("As") === CardUtils.create(Rank.Ace, Suit.Spade);
CardUtils.parse("2s") === CardUtils.create(Rank.Deuce, Suit.Spade);
CardUtils.parse("Kc") === CardUtils.create(Rank.King, Suit.Club);
```

#### `CardUtils.format(card: Card): CardString`

Returns a CardString of a Card.

```ts
CardUtils.format(CardUtils.create(Rank.Ace, Suit.Spade)) ===
  ("As" as CardString);
CardUtils.format(CardUtils.create(Rank.Deuce, Suit.Spade)) ===
  ("2s" as CardString);
CardUtils.format(CardUtils.create(Rank.King, Suit.Club)) ===
  ("Kc" as CardString);
```

#### `CardUtils.rankOf(card: Card): Rank`

Extract the Rank from a Card.

```ts
CardUtils.rankOf(CardUtils.parse("As")) === Rank.Ace;
CardUtils.rankOf(CardUtils.parse("3h")) === Rank.Trey;
CardUtils.rankOf(CardUtils.parse("Td")) === Rank.Ten;
CardUtils.rankOf(CardUtils.parse("6c")) === Rank.Six;
```

#### `CardUtils.suitOf(card: Card): Suit`

Extract the Rank from a Card.

```ts
CardUtils.suitOf(CardUtils.parse("As")) === Suit.Spade;
CardUtils.suitOf(CardUtils.parse("3h")) === Suit.Heart;
CardUtils.suitOf(CardUtils.parse("Td")) === Suit.Diamond;
CardUtils.suitOf(CardUtils.parse("6c")) === Suit.Club;
```

### Rank

### RankUtils

A utility function set for Ranks.

#### `RankUtils.parse(char: string): Rank`

Parses a char (= 1-charactor-length string) into a Rank.

```ts
RankUtils.parse("A") === Rank.Ace;
RankUtils.parse("T") === Rank.Ten;
RankUtils.parse("5") === Rank.Five;
```

Only `"A"`, `"K"`, `"Q"`, `"J"`, `"T"`, `"9"`, `"8"`, `"7"`, `"6"`, `"5"`, `"4"`, `"3"` or `"2"` is acceptable.

```ts
RankUtils.parse("a"); // => Error: "a" is not a valid string value for RankUtils.parse().
```

For consistency reason, it needs to be a string even for number-based ranks (e.g. `"4"`).

```ts
RankUtils.parse("4") === Rank.Four;
RankUtils.parse(4); // Error: 4 is not a valid string value for RankUtils.parse().
```

#### `RankUtils.format(rank: Rank): string`

Stringifies a Rank.

```ts
RankUtils.format(Rank.Ace) === "A";
RankUtils.format(Rank.Ten) === "T";
RankUtils.format(Rank.Five) === "5";
```

You can utilize this function to build a CardString.

```ts
const aceChar = RankUtils.format(Rank.Ace);
const spadeChar = RankUtils.format(Suit.Spade);
const aceOfSpade: CardString = `${aceChar}${spadeChar}`;
```

### Suit

### SuitUtils

#### `SuitUtils.fromChar(char: string): Suit`

#### `SuitUtils.toChar(suit: Suit): string`
