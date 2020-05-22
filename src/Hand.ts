import * as Immutable from "immutable";
import PlayingCard from "./PlayingCard";
import PlayerHand from "./PlayerHand";

export default class Hand {
  constructor({
    playerInitialStackSizes,
    playerCards,
    smallBlindSize,
    antiSize,
    communityCards,
    preflopActions,
    flopActions,
    turnActions,
    riverActions,
  }: {
    playerInitialStackSizes: Map<number, number>;
    playerCards: Map<number, [PlayingCard, PlayingCard]>;
    smallBlindSize: number;
    antiSize: number;
    communityCards: PlayingCard[];
    preflopActions: HandAction[];
    flopActions: HandAction[];
    turnActions: HandAction[];
    riverActions: HandAction[];
  }) {
    this.playerInitialStackSizes = playerInitialStackSizes;
    this.playerCards = playerCards;
    this.smallBlindSize = smallBlindSize;
    this.antiSize = antiSize;
    this.communityCards = communityCards;
    this.#preflopActions = preflopActions;
    this.#flopActions = flopActions;
    this.#turnActions = turnActions;
    this.#riverActions = riverActions;
  }

  readonly playerInitialStackSizes: Map<number, number>;
  readonly playerCards: Map<number, [PlayingCard, PlayingCard]>;
  readonly smallBlindSize: number;
  readonly antiSize: number;
  readonly communityCards: PlayingCard[];

  readonly #preflopActions: HandAction[];
  readonly #flopActions: HandAction[];
  readonly #turnActions: HandAction[];
  readonly #riverActions: HandAction[];
  #snapshots?: HandSnapshot[];

  get playerLength(): number {
    return this.playerInitialStackSizes.size;
  }

  get snapshots(): HandSnapshot[] {
    if (!this.#snapshots) {
      this.buildSnapshots();
    }

    return this.#snapshots!;
  }

  get wonPlayerIndexes(): Set<number> {
    return this.snapshots[
      this.snapshots.length - 1
    ].activePlayerIndexes.toJS() as any;
  }

  get finalPotSize(): number {
    return this.snapshots[this.snapshots.length - 2].potSize;
  }

  get lastStreet(): HandStreet {
    return this.snapshots[this.snapshots.length - 1].street as any;
  }

  private buildSnapshots(): void {
    // previous had not been set here
    // do not refer this until the first snapshot has been pushed
    let last!: HandSnapshot;

    const pushSnapshot = (snapshot: HandSnapshot) => {
      if (!this.#snapshots) {
        this.#snapshots = [];
      }

      this.#snapshots.push(snapshot);
      last = snapshot;
    };

    // snapshot as the initial state
    pushSnapshot({
      street: HandSnapshotStreet.beginning,
      potSize: 0,
      activePlayerIndexes: Immutable.Set(this.playerInitialStackSizes.keys()),
      playerStackSizes: Immutable.Map(this.playerInitialStackSizes),
      playerLastActions: Immutable.Map(),
      actionPlayerIndex: null,
    });

    // snapshot for anti forced bet
    if (this.antiSize > 0) {
      pushSnapshot({
        street: HandSnapshotStreet.beginning,
        potSize: this.antiSize * this.playerInitialStackSizes.size,
        activePlayerIndexes: last.activePlayerIndexes,
        playerStackSizes: last.playerStackSizes.map((v) => v - this.antiSize),
        playerLastActions: last.playerLastActions.map(() => ({
          type: HandSnapshotActionType.forcedBet,
          betSize: this.antiSize,
        })),
        actionPlayerIndex: null,
      });
    }

    // snapshot for small blind forced bet
    pushSnapshot({
      street: HandSnapshotStreet.preflop,
      potSize: last.potSize + this.smallBlindSize,
      activePlayerIndexes: last.activePlayerIndexes,
      playerStackSizes: last.playerStackSizes.update(
        0,
        (stackSize) => stackSize - this.smallBlindSize
      ),
      playerLastActions: last.playerLastActions.set(0, {
        type: HandSnapshotActionType.forcedBet,
        betSize: this.smallBlindSize,
      }),
      actionPlayerIndex: 0,
    });

    // snapshot for big blind forced bet
    pushSnapshot({
      street: HandSnapshotStreet.preflop,
      potSize: last.potSize + 1,
      activePlayerIndexes: last.activePlayerIndexes,
      playerStackSizes: last.playerStackSizes.update(
        1,
        (stackSize) => stackSize - 1
      ),
      playerLastActions: last.playerLastActions.set(1, {
        type: HandSnapshotActionType.forcedBet,
        betSize: 1,
      }),
      actionPlayerIndex: 1,
    });

    // snapshots for every preflop actions
    for (const action of this.#preflopActions) {
      pushSnapshot({
        street: HandSnapshotStreet.preflop,
        potSize:
          last.potSize -
          (last.playerLastActions.get(action.playerIndex)?.betSize ?? 0) +
          action.betSize,
        activePlayerIndexes:
          action.type === HandActionType.fold
            ? last.activePlayerIndexes.delete(action.playerIndex)
            : last.activePlayerIndexes,
        playerStackSizes: last.playerStackSizes.update(
          action.playerIndex,
          (stackSize) =>
            stackSize +
            (last.playerLastActions.get(action.playerIndex)?.betSize ?? 0) -
            action.betSize
        ),
        playerLastActions: last.playerLastActions.set(action.playerIndex, {
          type: handActionTypeToHandSnapshotActionType(action.type),
          betSize: action.betSize,
        }),
        actionPlayerIndex: action.playerIndex,
      });
    }

    if (last.activePlayerIndexes.size === 1) {
      // the hand finished here
      pushSnapshot({
        street: HandSnapshotStreet.preflop,
        potSize: 0,
        activePlayerIndexes: last.activePlayerIndexes,
        playerStackSizes: last.playerStackSizes.update(
          last.activePlayerIndexes.first(),
          (stackSize) => stackSize + last.potSize
        ),
        playerLastActions: Immutable.Map(),
        actionPlayerIndex: last.activePlayerIndexes.first(),
      });

      return;
    }

    // snapshot as the initial state on flop
    pushSnapshot({
      street: HandSnapshotStreet.flop,
      potSize: last.potSize,
      activePlayerIndexes: last.activePlayerIndexes,
      playerStackSizes: last.playerStackSizes,
      playerLastActions: Immutable.Map(),
      actionPlayerIndex: null,
    });

    // snapshots for every flop actions
    for (const action of this.#flopActions) {
      pushSnapshot({
        street: HandSnapshotStreet.flop,
        potSize:
          last.potSize -
          (last.playerLastActions.get(action.playerIndex)?.betSize ?? 0) +
          action.betSize,
        activePlayerIndexes:
          action.type === HandActionType.fold
            ? last.activePlayerIndexes.delete(action.playerIndex)
            : last.activePlayerIndexes,
        playerStackSizes: last.playerStackSizes.update(
          action.playerIndex,
          (stackSize) =>
            stackSize +
            (last.playerLastActions.get(action.playerIndex)?.betSize ?? 0) -
            action.betSize
        ),
        playerLastActions: last.playerLastActions.set(action.playerIndex, {
          type: handActionTypeToHandSnapshotActionType(action.type),
          betSize: action.betSize,
        }),
        actionPlayerIndex: action.playerIndex,
      });
    }

    if (last.activePlayerIndexes.size === 1) {
      // the hand finished here
      pushSnapshot({
        street: HandSnapshotStreet.flop,
        potSize: 0,
        activePlayerIndexes: last.activePlayerIndexes,
        playerStackSizes: last.playerStackSizes.update(
          last.activePlayerIndexes.first(),
          (stackSize) => stackSize + last.potSize
        ),
        playerLastActions: Immutable.Map(),
        actionPlayerIndex: last.activePlayerIndexes.first(),
      });

      return;
    }

    // snapshot as the initial state on turn
    pushSnapshot({
      street: HandSnapshotStreet.flop,
      potSize: last.potSize,
      activePlayerIndexes: last.activePlayerIndexes,
      playerStackSizes: last.playerStackSizes,
      playerLastActions: Immutable.Map(),
      actionPlayerIndex: null,
    });

    // snapshots for every turn actions
    for (const action of this.#turnActions) {
      pushSnapshot({
        street: HandSnapshotStreet.turn,
        potSize:
          last.potSize -
          (last.playerLastActions.get(action.playerIndex)?.betSize ?? 0) +
          action.betSize,
        activePlayerIndexes:
          action.type === HandActionType.fold
            ? last.activePlayerIndexes.delete(action.playerIndex)
            : last.activePlayerIndexes,
        playerStackSizes: last.playerStackSizes.update(
          action.playerIndex,
          (stackSize) =>
            stackSize +
            (last.playerLastActions.get(action.playerIndex)?.betSize ?? 0) -
            action.betSize
        ),
        playerLastActions: last.playerLastActions.set(action.playerIndex, {
          type: handActionTypeToHandSnapshotActionType(action.type),
          betSize: action.betSize,
        }),
        actionPlayerIndex: action.playerIndex,
      });
    }

    if (last.activePlayerIndexes.size === 1) {
      // the hand finished here
      pushSnapshot({
        street: HandSnapshotStreet.turn,
        potSize: 0,
        activePlayerIndexes: last.activePlayerIndexes,
        playerStackSizes: last.playerStackSizes.update(
          last.activePlayerIndexes.first(),
          (stackSize) => stackSize + last.potSize
        ),
        playerLastActions: Immutable.Map(),
        actionPlayerIndex: last.activePlayerIndexes.first(),
      });

      return;
    }

    // snapshot as the initial state on river
    pushSnapshot({
      street: HandSnapshotStreet.river,
      potSize: last.potSize,
      activePlayerIndexes: last.activePlayerIndexes,
      playerStackSizes: last.playerStackSizes,
      playerLastActions: Immutable.Map(),
      actionPlayerIndex: null,
    });

    // snapshots for every river actions
    for (const action of this.#riverActions) {
      pushSnapshot({
        street: HandSnapshotStreet.river,
        potSize:
          last.potSize -
          (last.playerLastActions.get(action.playerIndex)?.betSize ?? 0) +
          action.betSize,
        activePlayerIndexes:
          action.type === HandActionType.fold
            ? last.activePlayerIndexes.delete(action.playerIndex)
            : last.activePlayerIndexes,
        playerStackSizes: last.playerStackSizes.update(
          action.playerIndex,
          (stackSize) =>
            stackSize +
            (last.playerLastActions.get(action.playerIndex)?.betSize ?? 0) -
            action.betSize
        ),
        playerLastActions: last.playerLastActions.set(action.playerIndex, {
          type: handActionTypeToHandSnapshotActionType(action.type),
          betSize: action.betSize,
        }),
        actionPlayerIndex: action.playerIndex,
      });
    }

    if (last.activePlayerIndexes.size === 1) {
      // the hand finished here
      pushSnapshot({
        street: HandSnapshotStreet.river,
        potSize: 0,
        activePlayerIndexes: last.activePlayerIndexes,
        playerStackSizes: last.playerStackSizes.update(
          last.activePlayerIndexes.first(),
          (stackSize) => stackSize + last.potSize
        ),
        playerLastActions: Immutable.Map(),
        actionPlayerIndex: last.activePlayerIndexes.first(),
      });

      return;
    }

    let wonPlayerIndexes = Immutable.Set();
    let wonPlayerPower = -Infinity;

    for (const playerIndex of last.activePlayerIndexes) {
      const holeCards = this.playerCards.get(playerIndex);

      if (!holeCards) {
        throw new Error();
      }

      const playerHand = new PlayerHand({
        holeCards,
        communityCards: this.communityCards,
      });

      if (playerHand.power > wonPlayerPower) {
        wonPlayerIndexes = wonPlayerIndexes.clear().add(playerIndex);
        wonPlayerPower = playerHand.power;
      }
    }

    pushSnapshot({
      street: HandSnapshotStreet.showdown,
      potSize: 0,
      activePlayerIndexes: wonPlayerIndexes,
      playerStackSizes: last.playerStackSizes.map((stackSize, i) =>
        wonPlayerIndexes.has(i)
          ? stackSize + last.potSize / wonPlayerIndexes.size
          : stackSize
      ),
      playerLastActions: wonPlayerIndexes.toMap().map(() => ({
        type: HandSnapshotActionType.acquirePot,
        betSize: last.potSize / wonPlayerIndexes.size,
      })),
      actionPlayerIndex: null,
    });
  }
}

function handActionTypeToHandSnapshotActionType(
  type: HandActionType
): HandSnapshotActionType {
  switch (type) {
    case HandActionType.fold:
      return HandSnapshotActionType.fold;
    case HandActionType.check:
      return HandSnapshotActionType.check;
    case HandActionType.call:
      return HandSnapshotActionType.call;
    case HandActionType.bet:
      return HandSnapshotActionType.bet;
    case HandActionType.raise:
      return HandSnapshotActionType.raise;
  }
}

export enum HandStreet {
  preflop = "PREFLOP",
  flop = "FLOP",
  turn = "TURN",
  river = "RIVER",
  showdown = "SHOWDOWN",
}

export interface HandAction {
  type: HandActionType;
  playerIndex: number;
  betSize: number;
}

export enum HandActionType {
  fold = "FOLD",
  check = "CHECK",
  call = "CALL",
  bet = "BET",
  raise = "RAISE",
}

export interface HandSnapshot {
  street: HandSnapshotStreet;
  potSize: number;
  activePlayerIndexes: Immutable.Set<number>;
  playerStackSizes: Immutable.Map<number, number>;
  playerLastActions: Immutable.Map<
    number,
    { type: HandSnapshotActionType; betSize: number }
  >;
  actionPlayerIndex: number | null;
}

export enum HandSnapshotActionType {
  forcedBet = "FORCED_BET",
  fold = "FOLD",
  check = "CHECK",
  call = "CALL",
  bet = "BET",
  raise = "RAISE",
  acquirePot = "ACQUIRE_POT",
}

export enum HandSnapshotStreet {
  beginning = "BEGINNING",
  preflop = "PREFLOP",
  flop = "FLOP",
  turn = "TURN",
  river = "RIVER",
  showdown = "SHOWDOWN",
}
