import { describe } from "@jest/globals";
import { ExhaustiveEvaluator, MontecarloEvaluator } from "./evaluator";
import { CardSet } from "./card-set";
import { HandRange } from "./hand-range";

describe("MontecarloEvaluator", () => {
  it("evaluates the situation (situation #1)", () => {
    const players = [HandRange.parse("KdJd"), HandRange.parse("Ah3h")];
    const evaluator = new MontecarloEvaluator({
      board: CardSet.parse("AsKcQh2d"),
      players,
      probabilityResolution: 1,
    });

    const playerWinCounts = Array.from(players, () => 0);
    let timesEvaluated = 0;

    for (const matchup of evaluator.take(100000)) {
      for (const [i, player] of matchup.players.entries()) {
        if (player.win) {
          playerWinCounts[i] += 1 / matchup.wonPlayerCount;
        }
      }

      timesEvaluated += 1;
    }

    expect(playerWinCounts[0]! / timesEvaluated).toBeCloseTo(9 / 44, 2);
    expect(playerWinCounts[1]! / timesEvaluated).toBeCloseTo(35 / 44, 2);
  });

  it("evaluates the situation (situation #2)", () => {
    const players = [
      HandRange.parse("AKs"),
      HandRange.parse("Th9h"),
      HandRange.parse("6s6h"),
    ];
    const evaluator = new MontecarloEvaluator({
      board: CardSet.parse("4s5hQhTd"),
      players,
      probabilityResolution: 1,
    });

    const playerWinCounts = Array.from(players, () => 0);
    let timesEvaluated = 0;

    for (const matchup of evaluator.take(100000)) {
      for (const [i, player] of matchup.players.entries()) {
        if (player.win) {
          playerWinCounts[i] += 1 / matchup.wonPlayerCount;
        }
      }

      timesEvaluated += 1;
    }

    expect(playerWinCounts[0]! / timesEvaluated).toBeCloseTo(36 / 168, 2);
    expect(playerWinCounts[1]! / timesEvaluated).toBeCloseTo(124 / 168, 2);
    expect(playerWinCounts[2]! / timesEvaluated).toBeCloseTo(8 / 168, 2);
  });
});

describe("ExhaustiveEvaluator", () => {
  it("evaluates the situation (situation #1)", () => {
    const players = [HandRange.parse("KdJd"), HandRange.parse("Ah3h")];
    const evaluator = new ExhaustiveEvaluator({
      board: CardSet.parse("AsKcQh2d"),
      players,
      probabilityResolution: 1,
    });

    const playerWinCounts = Array.from(players, () => 0);
    let timesEvaluated = 0;

    for (const matchup of evaluator) {
      for (const [i, player] of matchup.players.entries()) {
        if (player.win) {
          playerWinCounts[i] += 1 / matchup.wonPlayerCount;
        }
      }

      timesEvaluated += 1;
    }

    expect(playerWinCounts[0]! / timesEvaluated).toBeCloseTo(9 / 44, 2);
    expect(playerWinCounts[1]! / timesEvaluated).toBeCloseTo(35 / 44, 2);
  });

  it("evaluates the situation (situation #2)", () => {
    const players = [
      HandRange.parse("AKs"),
      HandRange.parse("Th9h"),
      HandRange.parse("6s6h"),
    ];
    const evaluator = new ExhaustiveEvaluator({
      board: CardSet.parse("4s5hQhTd"),
      players,
      probabilityResolution: 1,
    });

    const playerWinCounts = Array.from(players, () => 0);
    let timesEvaluated = 0;

    for (const matchup of evaluator) {
      for (const [i, player] of matchup.players.entries()) {
        if (player.win) {
          playerWinCounts[i] += 1 / matchup.wonPlayerCount;
        }
      }

      timesEvaluated += 1;
    }

    expect(playerWinCounts[0]! / timesEvaluated).toBeCloseTo(36 / 168, 2);
    expect(playerWinCounts[1]! / timesEvaluated).toBeCloseTo(124 / 168, 2);
    expect(playerWinCounts[2]! / timesEvaluated).toBeCloseTo(8 / 168, 2);
  });
});
