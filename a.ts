import { compile, tokenize } from "./lib/index";
import { BacktrackEvaluator } from "./lib/src/evaluators/backtrack";
import { MontecarloEvaluator } from "./lib/src/evaluators/montecarlo";
import { stringToCardSet } from "./lib/src/models/card-set";

const handRanges = [
  compile(tokenize("As3h")),
  compile(tokenize("8d8h")),
  compile(tokenize("QcJc")),
];

const communityCards = stringToCardSet("3c6dTs");

console.log(
  new BacktrackEvaluator({
    communityCards,
    handRanges,
  }).space
);

console.time("BacktrackEvaluator.initialize");

const evaluator = new BacktrackEvaluator({
  communityCards,
  handRanges,
});

console.timeEnd("BacktrackEvaluator.initialize");

console.time("BacktrackEvaluator.evaluate");

const matchups = evaluator.evaluate();

console.timeEnd("BacktrackEvaluator.evaluate");

console.log(matchups.length);

console.log(
  matchups.reduce(
    (wins, matchup) => {
      let best = Number.POSITIVE_INFINITY;
      let winners = [];

      for (const [i, hand] of matchup.hands.entries()) {
        if (hand < best) {
          best = hand;
          winners.push(i);
        }
      }

      const nextWins = [...wins];

      for (const winner of winners) {
        nextWins[winner] += 1;
      }

      return nextWins;
    },
    handRanges.map(() => 0)
  )
);

console.time("MontecarloEvaluator.initialize");

const simulator = new MontecarloEvaluator({
  communityCards,
  handRanges,
});

console.timeEnd("MontecarloEvaluator.initialize");

console.time("MontecarloEvaluator.evaluate");

const matchups2 = simulator.evaluateTimes(100000);

console.timeEnd("MontecarloEvaluator.evaluate");

console.log(matchups2.length);

console.log(
  matchups2.reduce(
    (wins, matchup) => {
      let best = Number.POSITIVE_INFINITY;
      let winners = [];

      for (const [i, hand] of matchup.hands.entries()) {
        if (hand < best) {
          best = hand;
          winners.push(i);
        }
      }

      const nextWins = [...wins];

      for (const winner of winners) {
        nextWins[winner] += 1;
      }

      return nextWins;
    },
    handRanges.map(() => 0)
  )
);
