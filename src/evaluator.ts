import { CardUtils } from "./card";
import { CardSet, CardSetUtils } from "./card-set";
import { HandRange, HandRangeUtils } from "./hand-range";
import { MadeHand, MadeHandUtils } from "./made-hand";

/**
 *
 */
export interface Evaluator extends Iterable<Matchup> {
  /**
   *
   */
  communityCards: CardSet;

  /**
   *
   */
  players: HandRange[];
}

/**
 * Compares hands in best form that each one can make.
 *
 * @internal
 */
export function showdown(
  holeCardPairs: CardSet[],
  communityCards: CardSet
): Matchup {
  const hands: MadeHand[] = [];
  const wonPlayerIndexes = new Set<number>();
  let maxPower = -1;

  for (const [i, holeCardPair] of holeCardPairs.entries()) {
    const madeHand = MadeHandUtils.findBestFrom(
      CardSetUtils.union(holeCardPair, communityCards)
    );
    const power = MadeHandUtils.power(madeHand);

    hands.push(madeHand);

    if (power >= maxPower) {
      if (power > maxPower) {
        wonPlayerIndexes.clear();

        maxPower = power;
      }

      wonPlayerIndexes.add(i);
    }
  }

  return {
    communityCards,
    holeCardPairs,
    hands,
    wonPlayerIndexes,
  };
}

/**
 *
 */
export interface Matchup {
  readonly communityCards: CardSet;

  readonly holeCardPairs: CardSet[];

  readonly hands: MadeHand[];

  readonly wonPlayerIndexes: Set<number>;
}

/**
 *
 */
export class MontecarloEvaluator implements Evaluator {
  constructor({
    communityCards,
    players,
  }: {
    communityCards: CardSet;
    players: HandRange[];
  }) {
    this.communityCards = communityCards;
    this.players = players;
    this.playersArray = this.players.map((hr) => HandRangeUtils.toCardSetEnumeration(hr, 12));
  }

  /**
   *
   */
  readonly communityCards: CardSet;

  /**
   *
   */
  readonly players: HandRange[];

  private readonly playersArray: CardSet[][];

  take(times: number): Iterable<Matchup> {
    const self = this;

    return {
      [Symbol.iterator]: function* (): Iterator<Matchup> {
        const gen = self[Symbol.iterator]();

        for (let i = 0; i < times; ++i) {
          const { value, done } = gen.next();

          yield value;

          if (done) break;
        }
      },
    };
  }

  *[Symbol.iterator](): Iterator<Matchup> {
    while (true) {
      let deck = CardSetUtils.diff(CardSetUtils.full, this.communityCards);
      let communityCards = this.communityCards;
      const holeCardPairs = this.playersArray.map(
        (hr) => hr[~~(Math.random() * hr.length)]!
      );
      let isPossible = true;

      for (const cardPair of holeCardPairs) {
        if (!CardSetUtils.has(deck, cardPair)) {
          isPossible = false;

          break;
        }

        deck = CardSetUtils.diff(deck, cardPair);
      }

      if (!isPossible) continue;

      for (let i = CardSetUtils.size(communityCards); i < 5; ) {
        const card = CardUtils.random();

        if (CardSetUtils.has(deck, card)) {
          deck = CardSetUtils.diff(deck, card);
          communityCards = CardSetUtils.union(communityCards, card);

          i += 1;
        }
      }

      yield showdown(holeCardPairs, communityCards);
    }
  }
}

/**
 *
 */
export class ExhaustiveEvaluator implements Evaluator {
  constructor({
    communityCards,
    players,
  }: {
    communityCards: CardSet;
    players: HandRange[];
  }) {
    this.communityCards = communityCards;
    this.players = players;
  }

  readonly communityCards: CardSet;

  readonly players: HandRange[];

  *[Symbol.iterator](): Iterator<Matchup> {
    const players = this.players.map((hr) => HandRangeUtils.toCardSetEnumeration(hr, 12));
    const stack: {
      deck: CardSet;
      holeCardPairs: CardSet[];
      communityCards: CardSet;
    }[] = [];

    stack.push({
      deck: CardSetUtils.diff(CardSetUtils.full, this.communityCards),
      holeCardPairs: [],
      communityCards: this.communityCards,
    });

    while (stack.length >= 1) {
      const { deck, holeCardPairs, communityCards } = stack.pop()!;

      if (holeCardPairs.length < players.length) {
        const nextPlayerIndex = holeCardPairs.length;

        for (const holeCardPair of players[nextPlayerIndex]!) {
          if (!CardSetUtils.has(deck, holeCardPair)) continue;

          stack.push({
            deck: CardSetUtils.diff(deck, holeCardPair),
            holeCardPairs: [...holeCardPairs, holeCardPair],
            communityCards,
          });
        }

        continue;
      }

      if (CardSetUtils.size(communityCards) < 5) {
        for (const card of CardSetUtils.iterate(deck)) {
          stack.push({
            deck: CardSetUtils.diff(deck, card),
            holeCardPairs,
            communityCards: CardSetUtils.union(communityCards, card),
          });
        }

        continue;
      }

      yield showdown(holeCardPairs, communityCards);
    }
  }
}
