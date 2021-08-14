import { HandRange } from "../models/hand-range";
import {
  CardSet,
  cardSetDifference,
  cardSetHas,
  cardSetSize,
  cardSetUnion,
  FULL_DECK,
} from "../models/card-set";
import { Matchup, showdown } from "../models/matchup";

export class MontecarloSimulator {
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

  simulateTimes(n: number): Matchup[] {
    const matchups: Matchup[] = [];
    const handRanges = this.handRanges.map((hr) => [...hr]);

    for (let i = 0; i < n; ++i) {
      let deck = FULL_DECK;
      let communityCards = this.communityCards;
      const holeCardPairs = handRanges.map(
        (hr) => hr[Math.floor(Math.random() * hr.length)]!
      );
      let isPossible = true;

      for (const cardPair of holeCardPairs) {
        if (!cardSetHas(deck, cardPair)) {
          isPossible = false;

          break;
        }

        deck = cardSetDifference(deck, cardPair);
      }

      if (!isPossible) continue;

      for (let i = cardSetSize(communityCards); i < 5; ) {
        const card = 2 ** Math.floor(Math.random() * 52);

        if (cardSetHas(deck, card)) {
          deck = cardSetDifference(deck, card);
          communityCards = cardSetUnion(communityCards, card);

          i += 1;
        }
      }

      matchups.push(showdown(holeCardPairs, communityCards));
    }

    return matchups;
  }

  // /// Creates
  // constructor({
  //   communityCards,
  //   handRanges,
  // }: {
  //   communityCards: CommunityCards;
  //   handRanges: HandRange[];
  // }) {
  //   this.communityCards = communityCards;
  //   this.handRanges = handRanges;
  //   this.handRangeArrayList = handRanges.map((hr) => [...hr]);
  //   this.prioritizedHandRangeIndexList = Array.from(handRanges, (_, i) => i);
  //   this.prioritizedHandRangeIndexList.sort((a, b) => {
  //     const aCombinationSize = this.handRanges[a]!.size;
  //     const bCombinationSize = this.handRanges[b]!.size;

  //     if (aCombinationSize == 1) return -1;
  //     if (bCombinationSize == 1) return 1;

  //     if (
  //       aCombinationSize <= handRanges.length * 2 &&
  //       bCombinationSize <= handRanges.length * 2
  //     ) {
  //       return aCombinationSize - bCombinationSize;
  //     }

  //     if (aCombinationSize <= handRanges.length * 2) return -1;
  //     if (bCombinationSize <= handRanges.length * 2) return 1;

  //     return 0;
  //   });
  // }

  // readonly communityCards: CommunityCards;

  // readonly handRanges: HandRange[];

  // private readonly handRangeArrayList: CardPair[][];

  // private readonly prioritizedHandRangeIndexList: number[];

  // /// Returns matchup evaluation result. Card pairs as player hands and community cards are randomly picked.
  // evaluate(): Matchup {
  //   const deck = new Set<Card>([
  //     "As",
  //     "Ks",
  //     "Qs",
  //     "Js",
  //     "Ts",
  //     "9s",
  //     "8s",
  //     "7s",
  //     "6s",
  //     "5s",
  //     "4s",
  //     "3s",
  //     "2s",
  //     "Ah",
  //     "Kh",
  //     "Qh",
  //     "Jh",
  //     "Th",
  //     "9h",
  //     "8h",
  //     "7h",
  //     "6h",
  //     "5h",
  //     "4h",
  //     "3h",
  //     "2h",
  //     "Ad",
  //     "Kd",
  //     "Qd",
  //     "Jd",
  //     "Td",
  //     "9d",
  //     "8d",
  //     "7d",
  //     "6d",
  //     "5d",
  //     "4d",
  //     "3d",
  //     "2d",
  //     "Ac",
  //     "Kc",
  //     "Qc",
  //     "Jc",
  //     "Tc",
  //     "9c",
  //     "8c",
  //     "7c",
  //     "6c",
  //     "5c",
  //     "4c",
  //     "3c",
  //     "2c",
  //   ]);

  //   deck.delete(this.communityCards.substring(0, 2) as Card);
  //   deck.delete(this.communityCards.substring(2, 4) as Card);
  //   deck.delete(this.communityCards.substring(4, 6) as Card);
  //   deck.delete(this.communityCards.substring(6, 8) as Card);
  //   deck.delete(this.communityCards.substring(8) as Card);

  //   let filledCommunityCards = this.communityCards;
  //   let holeCardPairs: CardPair[] = [];
  //   let i = 0;

  //   while (
  //     (holeCardPairs.length !== this.handRanges.length ||
  //       holeCardPairs.some((hcp) => !hcp)) &&
  //     i < 100000
  //   ) {
  //     filledCommunityCards = this.communityCards;
  //     holeCardPairs = [];

  //     for (const index of this.prioritizedHandRangeIndexList) {
  //       const playerHandRange = this.handRangeArrayList[index]!;
  //       const chosenHoleCards =
  //         playerHandRange[Math.floor(Math.random() * playerHandRange.length)]!;

  //       if (
  //         !deck.has(chosenHoleCards.substring(0, 2) as Card) ||
  //         !deck.has(chosenHoleCards.substring(2) as Card)
  //       ) {
  //         console.log("br");

  //         break;
  //       }

  //       deck.delete(chosenHoleCards.substring(0, 2) as Card);
  //       deck.delete(chosenHoleCards.substring(2) as Card);

  //       holeCardPairs[index] = chosenHoleCards;
  //     }

  //     while (filledCommunityCards.length < 10) {
  //       const deckArr = [...deck];
  //       const chosen = deckArr[Math.floor(Math.random() * deckArr.length)]!;

  //       deck.delete(chosen);
  //       filledCommunityCards += chosen;
  //     }

  //     i += 1;
  //   }

  //   console.log(i, {
  //     holeCardPairs,
  //     filledCommunityCards,
  //   });

  //   return showdown(holeCardPairs, filledCommunityCards);
  // }
}
