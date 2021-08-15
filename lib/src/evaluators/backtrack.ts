import {
  CardSet,
  cardSetRemoved,
  cardSetForEach,
  cardSetHas,
  cardSetSize,
  cardSetAdded,
  FULL_DECK,
} from "../models/card-set";
import { HandRange } from "../models/hand-range";
import { Matchup, showdown } from "../models/matchup";

export class BacktrackEvaluator {
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

  readonly communityCards: CardSet;

  readonly handRanges: HandRange[];

  get space(): number {
    let space = 1;

    for (const handRange of this.handRanges) {
      space *= handRange.size;
    }

    for (let i = cardSetSize(this.communityCards); i < 5; ++i) {
      space *= 52 - this.handRanges.length * 2 - i;
    }

    return space;
  }

  evaluate(): Matchup[] {
    const matchups: Matchup[] = [];
    const handRanges = this.handRanges.map((hr) => [...hr]);
    const stack: {
      deck: CardSet;
      holeCardPairs: CardSet[];
      communityCards: CardSet;
    }[] = [];

    stack.push({
      deck: cardSetRemoved(FULL_DECK, this.communityCards),
      holeCardPairs: [],
      communityCards: this.communityCards,
    });

    while (stack.length >= 1) {
      const { deck, holeCardPairs, communityCards } = stack.pop()!;

      if (holeCardPairs.length < handRanges.length) {
        const nextPlayerIndex = holeCardPairs.length;

        for (const holeCardPair of handRanges[nextPlayerIndex]!) {
          if (!cardSetHas(deck, holeCardPair)) continue;

          stack.push({
            deck: cardSetRemoved(deck, holeCardPair),
            holeCardPairs: [...holeCardPairs, holeCardPair],
            communityCards,
          });
        }

        continue;
      }

      if (cardSetSize(communityCards) < 5) {
        cardSetForEach(deck, (card) => {
          stack.push({
            deck: cardSetRemoved(deck, card),
            holeCardPairs,
            communityCards: cardSetAdded(communityCards, card),
          });
        });

        continue;
      }

      matchups.push(showdown(holeCardPairs, communityCards));
    }

    return matchups;
  }
}
