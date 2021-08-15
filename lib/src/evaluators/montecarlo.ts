import { HandRange } from "../models/hand-range";
import {
  CardSet,
  cardSetRemoved,
  cardSetHas,
  cardSetSize,
  cardSetAdded,
  FULL_DECK,
} from "../models/card-set";
import { Matchup, showdown } from "../models/matchup";

/**
 *
 */
export class MontecarloEvaluator {
  constructor({
    communityCards,
    handRanges,
  }: {
    communityCards: CardSet;
    handRanges: HandRange[];
  }) {
    this.communityCards = communityCards;
    this.handRanges = handRanges;
  }

  /**
   *
   */
  readonly communityCards: CardSet;

  /**
   *
   */
  readonly handRanges: HandRange[];

  /**
   *
   */
  evaluateTimes(n: number): Matchup[] {
    const matchups: Matchup[] = [];
    const handRanges = this.handRanges.map((hr) => [...hr]);

    for (let i = 0; matchups.length < n && i < n * 100; ++i) {
      let deck = cardSetRemoved(FULL_DECK, this.communityCards);
      let communityCards = this.communityCards;
      const holeCardPairs = handRanges.map(
        (hr) => hr[~~(Math.random() * hr.length)]!
      );
      let isPossible = true;

      for (const cardPair of holeCardPairs) {
        if (!cardSetHas(deck, cardPair)) {
          isPossible = false;

          break;
        }

        deck = cardSetRemoved(deck, cardPair);
      }

      if (!isPossible) continue;

      for (let i = cardSetSize(communityCards); i < 5; ) {
        const card = 2 ** ~~(Math.random() * 52);

        if (cardSetHas(deck, card)) {
          deck = cardSetRemoved(deck, card);
          communityCards = cardSetAdded(communityCards, card);

          i += 1;
        }
      }

      matchups.push(showdown(holeCardPairs, communityCards));
    }

    return matchups;
  }
}
