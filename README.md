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
const aceOfSpade = CardUtils.create("A", "s");
const deuceOfSpade = CardUtils.create("2", "s");
const kingOfClub = CardUtils.create("K", "c");
```

#### `CardUtils.parse(value: string): Card`

Parses a string into a Card.

```ts
CardUtils.parse("As") === CardUtils.create("A", "s");
CardUtils.parse("2s") === CardUtils.create("2", "s");
CardUtils.parse("Kc") === CardUtils.create("K", "c");
```

#### `CardUtils.format(card: Card): CardString`

Returns a CardString of a Card.

```ts
CardUtils.format(CardUtils.create("A", "s")) ===
  ("As" as CardString);
CardUtils.format(CardUtils.create("2", "s")) ===
  ("2s" as CardString);
CardUtils.format(CardUtils.create("K", "c")) ===
  ("Kc" as CardString);
```

#### `CardUtils.rankOf(card: Card): Rank`

Extract the Rank from a Card.

```ts
CardUtils.rankOf(CardUtils.parse("As")) === "A";
CardUtils.rankOf(CardUtils.parse("3h")) === "3";
CardUtils.rankOf(CardUtils.parse("Td")) === "T";
CardUtils.rankOf(CardUtils.parse("6c")) === "6";
```

#### `CardUtils.suitOf(card: Card): Suit`

Extract the Rank from a Card.

```ts
CardUtils.suitOf(CardUtils.parse("As")) === "s";
CardUtils.suitOf(CardUtils.parse("3h")) === "h";
CardUtils.suitOf(CardUtils.parse("Td")) === "d";
CardUtils.suitOf(CardUtils.parse("6c")) === "c";
```

### Rank

### RankUtils

A utility function set for Ranks.

#### `RankUtils.parse(char: string): Rank`

Parses a char (= 1-charactor-length string) into a Rank.

```ts
RankUtils.parse("A") === "A";
RankUtils.parse("T") === "T";
RankUtils.parse("5") === "5";
```

Only `"A"`, `"K"`, `"Q"`, `"J"`, `"T"`, `"9"`, `"8"`, `"7"`, `"6"`, `"5"`, `"4"`, `"3"` or `"2"` is acceptable.

```ts
RankUtils.parse("a"); // => Error: "a" is not a valid string value for RankUtils.parse().
```

For consistency reason, it needs to be a string even for number-based ranks (e.g. `"4"`).

```ts
RankUtils.parse("4") === "4";
RankUtils.parse(4); // Error: 4 is not a valid string value for RankUtils.parse().
```

#### `RankUtils.format(rank: Rank): string`

Stringifies a Rank.

```ts
RankUtils.format("A") === "A";
RankUtils.format("T") === "T";
RankUtils.format("5") === "5";
```

You can utilize this function to build a CardString.

```ts
const aceChar = RankUtils.format("A");
const spadeChar = RankUtils.format("s");
const aceOfSpade: CardString = `${aceChar}${spadeChar}`;
```

### Suit

### SuitUtils

#### `SuitUtils.fromChar(char: string): Suit`

#### `SuitUtils.toChar(suit: Suit): string`
