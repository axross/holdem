import { PerformanceObserver, performance } from "perf_hooks";
import { PlayerHand, PlayingCard } from "../src";

const TIMES = 100000;

const observer = new PerformanceObserver((list) => {
  if (list.getEntriesByName("Player Hand Initialization").length < TIMES) {
    return;
  }

  const handInitializationDurations = list
    .getEntriesByName("Player Hand Initialization")
    .map(({ duration }) => duration);
  const accessingPowerDurations = list
    .getEntriesByName("Accessing Hand Power")
    .map(({ duration }) => duration);

  console.log(
    "hand initialization: min: ",
    Math.min(...handInitializationDurations),
    "ms"
  );
  console.log(
    "hand initialization: max: ",
    Math.max(...handInitializationDurations),
    "ms"
  );
  console.log(
    "hand initialization: avg: ",
    handInitializationDurations.reduce((s, v) => s + v, 0) /
      handInitializationDurations.length,
    "ms"
  );

  console.log(
    "accessing power: min: ",
    Math.min(...accessingPowerDurations),
    "ms"
  );
  console.log(
    "accessing power: max: ",
    Math.max(...accessingPowerDurations),
    "ms"
  );
  console.log(
    "accessing power: avg: ",
    accessingPowerDurations.reduce((s, v) => s + v, 0) /
      accessingPowerDurations.length,
    "ms"
  );

  observer.disconnect();
});

observer.observe({ entryTypes: ["measure"], buffered: true });

for (let i = 0; i < TIMES; ++i) {
  performance.mark("Initial");

  performance.mark("Before Deck Initialization");

  const deck = createDeck();

  performance.mark("Before Hole Card Initialization");

  const holeCards = [deck.pop()!, deck.pop()!];

  performance.mark("Before Community Card Initialization");

  const communityCards = [
    deck.pop()!,
    deck.pop()!,
    deck.pop()!,
    deck.pop()!,
    deck.pop()!,
  ];

  performance.mark("Before Player Hand Initialization");

  const playerHand = new PlayerHand({ holeCards, communityCards });

  performance.mark("Before Accessing Hand Power");

  playerHand.power;

  performance.mark("Final");

  performance.measure(
    "Player Hand Initialization",
    "Before Player Hand Initialization",
    "Before Accessing Hand Power"
  );
  performance.measure(
    "Accessing Hand Power",
    "Before Accessing Hand Power",
    "Final"
  );
}

function createDeck() {
  const cards = [
    PlayingCard.aceSpade,
    PlayingCard.deuceSpade,
    PlayingCard.threeSpade,
    PlayingCard.fourSpade,
    PlayingCard.fiveSpade,
    PlayingCard.sixSpade,
    PlayingCard.sevenSpade,
    PlayingCard.eightSpade,
    PlayingCard.nineSpade,
    PlayingCard.tenSpade,
    PlayingCard.jackSpade,
    PlayingCard.queenSpade,
    PlayingCard.kingSpade,
    PlayingCard.aceHeart,
    PlayingCard.deuceHeart,
    PlayingCard.threeHeart,
    PlayingCard.fourHeart,
    PlayingCard.fiveHeart,
    PlayingCard.sixHeart,
    PlayingCard.sevenHeart,
    PlayingCard.eightHeart,
    PlayingCard.nineHeart,
    PlayingCard.tenHeart,
    PlayingCard.jackHeart,
    PlayingCard.queenHeart,
    PlayingCard.kingHeart,
    PlayingCard.aceDiamond,
    PlayingCard.deuceDiamond,
    PlayingCard.threeDiamond,
    PlayingCard.fourDiamond,
    PlayingCard.fiveDiamond,
    PlayingCard.sixDiamond,
    PlayingCard.sevenDiamond,
    PlayingCard.eightDiamond,
    PlayingCard.nineDiamond,
    PlayingCard.tenDiamond,
    PlayingCard.jackDiamond,
    PlayingCard.queenDiamond,
    PlayingCard.kingDiamond,
    PlayingCard.aceClub,
    PlayingCard.deuceClub,
    PlayingCard.threeClub,
    PlayingCard.fourClub,
    PlayingCard.fiveClub,
    PlayingCard.sixClub,
    PlayingCard.sevenClub,
    PlayingCard.eightClub,
    PlayingCard.nineClub,
    PlayingCard.tenClub,
    PlayingCard.jackClub,
    PlayingCard.queenClub,
    PlayingCard.kingClub,
  ];

  // shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}
