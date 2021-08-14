import {
  CardSet,
  cardSetDifference,
  cardSetForEach,
  cardSetHas,
  cardSetSize,
  cardSetUnion,
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

  evaluate(): Matchup[] {
    const matchups: Matchup[] = [];
    const handRanges = this.handRanges.map((hr) => [...hr]);
    const stack: {
      deck: CardSet;
      holeCardPairs: CardSet[];
      communityCards: CardSet;
    }[] = [];

    // console.log(
    //   handRanges,
    //   handRanges.map((p) => p.map((cs) => cardSetToString(cs)))
    // );

    // card, deck, cardpair, communityCardsをビットの数値にすれば早そう

    stack.push({
      deck: cardSetDifference(FULL_DECK, this.communityCards),
      holeCardPairs: [],
      communityCards: this.communityCards,
    });

    while (stack.length >= 1) {
      const { deck, holeCardPairs, communityCards } = stack.pop()!;

      // console.log({
      //   deck,
      //   holeCardPairs: holeCardPairs.map((cs) => cardSetToString(cs)),
      //   communityCards: cardSetToString(communityCards),
      // });

      if (holeCardPairs.length < handRanges.length) {
        const nextPlayerIndex = holeCardPairs.length;

        for (const holeCardPair of handRanges[nextPlayerIndex]!) {
          if (!cardSetHas(deck, holeCardPair)) continue;

          stack.push({
            deck: cardSetDifference(deck, holeCardPair),
            holeCardPairs: [...holeCardPairs, holeCardPair],
            communityCards,
          });
        }

        continue;
      }

      if (cardSetSize(communityCards) < 5) {
        cardSetForEach(deck, (card) => {
          stack.push({
            deck: cardSetDifference(deck, card),
            holeCardPairs,
            communityCards: cardSetUnion(communityCards, card),
          });
        });

        continue;
      }

      matchups.push(showdown(holeCardPairs, communityCards));

      // console.log({
      //   communityCards: cardSetToString(a.communityCards),
      //   holeCardPairs: a.holeCardPairs.map((v) => cardSetToString(v)),
      //   hands: a.hands,
      //   bestHands: a.bestHands,
      // });
    }

    return matchups;
  }
}
