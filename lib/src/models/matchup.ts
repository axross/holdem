import { CardSet, cardSetAdded } from "./card-set";
import { getBestMadeHandFrom, MadeHand } from "./made-hand";

/**
 *
 */
export interface Matchup {
  communityCards: CardSet;
  holeCardPairs: CardSet[];
  hands: MadeHand[];
}

/**
 *
 */
export function showdown(
  holeCardPairs: CardSet[],
  communityCards: CardSet
): Matchup {
  const hands: MadeHand[] = [];

  for (const holeCardPair of holeCardPairs) {
    const madeHand = getBestMadeHandFrom(
      cardSetAdded(holeCardPair, communityCards)
    );

    hands.push(madeHand);
  }

  return {
    communityCards,
    holeCardPairs,
    hands,
  };
}
