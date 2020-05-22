import PlayingCard from "./PlayingCard";
import { HandStreet } from "./Hand";

export default class PlayerHandMatchup {
  constructor({
    playerCards,
    communityCards,
  }: {
    playerCards: PlayingCard[][];
    communityCards: PlayingCard[];
  }) {
    this.playerCards = playerCards;
    this.communityCards = communityCards;
  }

  readonly playerCards: PlayingCard[][];
  readonly communityCards: PlayingCard[];

  private readonly _playerEquities?: number[];

  get playerEquities(): number[] {
    if (!this._playerEquities) {
      this.calculate();
    }

    return this._playerEquities!;
  }

  get wonPlayerIndexes(): Set<number> {
    if (this.communityCards.length !== 5) {
      throw new Error();
    }

    return new Set();
  }

  private calculate(): void {
    if (this.communityCards.length === 5) {
      this.judge();
    }

    if (this.communityCards.length === 4) {
    }
  }

  private judge() {}
}
