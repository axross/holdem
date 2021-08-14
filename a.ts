import { compile, tokenize } from "./lib/index";
import { BacktrackEvaluator } from "./lib/src/evaluators/backtrack";
import { MontecarloSimulator } from "./lib/src/evaluators/montecarlo";
import { stringToCardSet } from "./lib/src/models/card-set";

const handRanges = [
  compile(tokenize("AhAd")),
  compile(tokenize("AKsKK")),
  compile(tokenize("64s+")),
];

const communityCards = stringToCardSet("3cQc8s");

console.log(handRanges.reduce((t, hr) => t * hr.size, 1) * 46 * 45);

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

console.time("MontecarloSimulator.initialize");

const simulator = new MontecarloSimulator({
  communityCards,
  handRanges,
});

console.timeEnd("MontecarloSimulator.initialize");

console.time("MontecarloSimulator.simulate");

const matchups2 = simulator.simulateTimes(100000);

console.timeEnd("MontecarloSimulator.simulate");

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
