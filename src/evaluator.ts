import { Card } from "./card";
import { CardSet } from "./card-set";
import { HandRange } from "./hand-range";
import { MadeHand } from "./made-hand";
import { Rank } from "./rank";
import { Suit } from "./suit";

/**
 * A class that evaluates equity of each player in a certain situation.
 *
 * You can use either of:
 *
 * - `new MontecarloEvaluator()` - randomly decides the possible situations can come and evaluate equities.
 * - `new ExhaustiveEvaluator()` - exhaustively iterates all the possible situations and evaluate equities.
 *
 * Evaluator implements `Iterable<Matchup>` so you can use it in for-loop.
 *
 * @example
 * ```ts
 * const evaluator = new ExhaustiveEvaluator({
 *   board: CardSet.parse("AsKcQh2d"),
 *   players: [
 *     HandRange.parse("KdJd"),
 *     HandRange.parse("Ah3h"),
 *   ],
 * });
 *
 * for (const matchup of evaluator) {
 *   // ...
 * }
 * ```
 */
export abstract class Evaluator implements Iterable<Matchup> {
  constructor({
    board,
    players,
    probabilityResolution = 12,
  }: {
    board: Evaluator["board"];
    players: Evaluator["players"];
    /**
     * The resolution of probability. Default is `12`.
     */
    probabilityResolution?: number;
  }) {
    this.board = board;
    this.players = players;
    this.resolvedPlayers = this.players.map((handRange) => {
      const cardSetList = [];

      for (const [cardSet, probability] of handRange) {
        for (
          let i = 0;
          i < Math.round(probability * probabilityResolution);
          ++i
        ) {
          cardSetList.push(cardSet);
        }
      }

      return cardSetList;
    });
  }

  /**
   * The initial board cards for the situation.
   */
  readonly board: CardSet;

  /**
   * The HandRange(s) that the players have.
   */
  readonly players: HandRange[];

  protected readonly resolvedPlayers: CardSet[][];

  abstract [Symbol.iterator](): Iterator<Matchup>;

  /**
   * Compares hands in best form that each one can make.
   *
   * @internal
   */
  protected showdown(holeCardPairs: CardSet[], board: CardSet): Matchup {
    const players: Pick<Matchup["players"][0], "cards" | "hand">[] = [];
    const wonPlayerIndexes = new Set<number>();
    let strongestPowerIndex = Number.MAX_SAFE_INTEGER;

    for (const [i, holeCardPair] of holeCardPairs.entries()) {
      const madeHand = MadeHand.findBestFrom(holeCardPair.added(board));

      if (madeHand.powerIndex <= strongestPowerIndex) {
        if (madeHand.powerIndex < strongestPowerIndex) {
          wonPlayerIndexes.clear();

          strongestPowerIndex = madeHand.powerIndex;
        }

        wonPlayerIndexes.add(i);
      }

      players.push({
        cards: holeCardPair,
        hand: madeHand,
      });
    }

    return {
      board,
      players: players.map((p, i) => ({ ...p, win: wonPlayerIndexes.has(i) })),
      wonPlayerCount: wonPlayerIndexes.size,
    };
  }
}

/**
 * The eventual situation of the evaluation and its result.
 */
export interface Matchup {
  /**
   * The eventual board card in the situation.
   */
  readonly board: CardSet;

  /**
   * Result of each player in the situation.
   */
  readonly players: {
    cards: CardSet;
    hand: MadeHand;
    win: boolean;
  }[];

  /**
   * Number of the players won the pot.
   */
  readonly wonPlayerCount: number;
}

/**
 * An Evaluator that does montecarlo simulation for certain times.
 *
 * Do not forget to call `#take()` because this evaluator can run unlimited times.
 *
 * @example
 * ```ts
 * const evaluator = new MontecarloEvaluator({
 *   board: CardSet.parse("AsKcQh2d"),
 *   players: [
 *     HandRange.parse("KdJd"),
 *     HandRange.parse("Ah3h"),
 *   ],
 * });
 *
 * for (const matchup of evaluator.take(10000)) {
 *   // ...
 * }
 * ```
 */
export class MontecarloEvaluator extends Evaluator {
  /**
   * Limits times to run and returns `Iterable<Matchup>`.
   *
   * @example
   * ```ts
   * const evaluator = new MontecarloEvaluator({
   *   board: CardSet.parse("AsKcQh2d"),
   *   players: [
   *     HandRange.parse("KdJd"),
   *     HandRange.parse("Ah3h"),
   *   ],
   * });
   *
   * for (const matchup of evaluator.take(10000)) {
   *   // ...
   * }
   * ```
   */
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
      let deck = CardSet.full().removed(this.board);
      let board = this.board;
      const holeCardPairs = this.resolvedPlayers.map(
        (hr) => hr[~~(Math.random() * hr.length)]!
      );
      let isPossible = true;

      for (const cardPair of holeCardPairs) {
        if (!deck.has(cardPair)) {
          isPossible = false;

          break;
        }

        deck = deck.removed(cardPair);
      }

      if (!isPossible) continue;

      for (let i = board.size; i < 5; ) {
        const card = pickRandomCard();

        if (deck.has(card)) {
          deck = deck.removed(card);
          board = board.added(card);

          i += 1;
        }
      }

      yield this.showdown(holeCardPairs, board);
    }
  }
}

/**
 * An Evaluator that exhaustively simulates all the possible situations. This is suitable for the situation that has only small number of possible futures.
 *
 * @example
 * ```ts
 * const evaluator = new ExhaustiveEvaluator({
 *   board: CardSet.parse("AsKcQh2d"),
 *   players: [
 *     HandRange.parse("KdJd"),
 *     HandRange.parse("Ah3h"),
 *   ],
 * });
 *
 * for (const matchup of evaluator) {
 *   // ...
 * }
 * ```
 */
export class ExhaustiveEvaluator extends Evaluator {
  *[Symbol.iterator](): Iterator<Matchup> {
    const stack: {
      deck: CardSet;
      holeCardPairs: CardSet[];
      board: CardSet;
    }[] = [];

    stack.push({
      deck: CardSet.full().removed(this.board),
      holeCardPairs: [],
      board: this.board,
    });

    while (stack.length >= 1) {
      const { deck, holeCardPairs, board } = stack.pop()!;

      if (holeCardPairs.length < this.resolvedPlayers.length) {
        const nextPlayerIndex = holeCardPairs.length;

        for (const holeCardPair of this.resolvedPlayers[nextPlayerIndex]!) {
          if (!deck.has(holeCardPair)) continue;

          stack.push({
            deck: deck.removed(holeCardPair),
            holeCardPairs: [...holeCardPairs, holeCardPair],
            board,
          });
        }

        continue;
      }

      if (board.size < 5) {
        for (const card of deck) {
          stack.push({
            deck: deck.removed(card),
            holeCardPairs,
            board: board.added(card),
          });
        }

        continue;
      }

      yield this.showdown(holeCardPairs, board);
    }
  }
}

/**
 * Returns a randomly-chosen Card.
 *
 * @example
 * ```ts
 * pickRandomCard();  // => Card (at random)
 * ```
 */
function pickRandomCard(): Card {
  return new Card(
    ranks[Math.floor(Math.random() * ranks.length)]!,
    suits[Math.floor(Math.random() * suits.length)]!
  );
}

const ranks: Rank[] = [
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
];

const suits: Suit[] = [Suit.Spade, Suit.Heart, Suit.Diamond, Suit.Club];
