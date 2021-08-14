import { CardSet, stringToCardSet } from "./card-set";

export type HandRange = Set<CardSet>;

export type HandRangeTokenSet = Set<string>;

/**
 * Parses the given string and returns a HandRangeTokenSet.
 *
 * This ignores invalid expressions in the given string.
 */
export function tokenize(expressions: string): HandRangeTokenSet {
  const tokenSet: HandRangeTokenSet = new Set();
  const matches = expressions.matchAll(
    /[AKQJT98765432][shdc]?[AKQJT98765432](\+|[so]\+?|[shdc])?(-[AKQJT98765432][AKQJT98765432][so]?)?/g
  );

  for (const match of matches) {
    const token = match[0]!;

    // example: ATo-A3o
    if (token.length === 7) {
      const high = token[0]!;
      const kickerTop = token[1]!;
      const kickerBottom = token[5]!;

      for (
        let i = ranks.indexOf(kickerTop);
        i <= ranks.indexOf(kickerBottom);
        ++i
      ) {
        if (token[2] === "s") {
          tokenSet.add(`${high}${ranks[i]!}s`);
        } else {
          tokenSet.add(`${high}${ranks[i]!}o`);
        }
      }

      continue;
    }

    // example: 44+
    if (token.length === 3 && token[2] === "+" && token[0] === token[1]) {
      for (let i = 0; i <= ranks.indexOf(token[0]!); ++i) {
        tokenSet.add(`${ranks[i]!}${ranks[i]!}`);
      }

      continue;
    }

    // example: AJs+, AJ+
    if (
      (token.length === 3 && token[2] === "+" && token[0] !== token[1]) ||
      (token.length === 4 && token[3] === "+")
    ) {
      const high = token[0]!;
      const kicker = token[1]!;

      for (let i = ranks.indexOf(high) + 1; i <= ranks.indexOf(kicker); ++i) {
        if (token[2] === "s") {
          tokenSet.add(`${high}${ranks[i]!}s`);
        } else {
          tokenSet.add(`${high}${ranks[i]!}o`);
        }
      }

      continue;
    }

    // example: AhKc
    if (token.length === 4 && token[3] !== "+") {
      tokenSet.add(token);

      continue;
    }

    // example: AJ, AJo
    if (token[2] === "s") {
      tokenSet.add(`${token[0]}${token[1]}s`);
    } else {
      if (token[0] === token[1]) {
        tokenSet.add(`${token[0]}${token[1]}`);
      } else {
        tokenSet.add(`${token[0]}${token[1]}o`);
      }
    }
  }

  return tokenSet;
}

/**
 *
 */
export function compile(tokens: Iterable<string>): HandRange {
  const handRange: HandRange = new Set();

  for (const token of tokens) {
    if (token.length === 4) {
      handRange.add(stringToCardSet(token));

      continue;
    }

    const high = token[0]!;
    const kicker = token[1]!;

    if (token[2] === "s") {
      for (const card of createSuitedSet(high, kicker)) {
        handRange.add(card);
      }
    } else {
      for (const card of createOfsuitSet(high, kicker)) {
        handRange.add(card);
      }
    }
  }

  return handRange;
}

function createSuitedSet(rankA: string, rankB: string): HandRange {
  const handRange: HandRange = new Set();

  handRange.add(stringToCardSet(`${rankA}s${rankB}s`));
  handRange.add(stringToCardSet(`${rankA}h${rankB}h`));
  handRange.add(stringToCardSet(`${rankA}d${rankB}d`));
  handRange.add(stringToCardSet(`${rankA}c${rankB}c`));

  return handRange;
}

function createOfsuitSet(rankA: string, rankB: string): HandRange {
  const handRange: HandRange = new Set();

  handRange.add(stringToCardSet(`${rankA}s${rankB}h`));
  handRange.add(stringToCardSet(`${rankA}s${rankB}d`));
  handRange.add(stringToCardSet(`${rankA}s${rankB}c`));
  handRange.add(stringToCardSet(`${rankA}h${rankB}d`));
  handRange.add(stringToCardSet(`${rankA}h${rankB}c`));
  handRange.add(stringToCardSet(`${rankA}d${rankB}c`));

  return handRange;
}

const ranks: string[] = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];
