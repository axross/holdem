import { Simulator } from "./simulator";
import { tokenize, compile } from "../models/hand-range";

describe("Simulator", () => {
  describe("#nanika", () => {
    test("it is sorted so that it can make matchup combinations as much as possible", () => {
      const simulator = new Simulator({
        communityCards: "QsJs5sAs",
        handRanges: [
          compile(tokenize("44+A2s+K9s+Q9s+J9s+T9sATo+KTo+QJo")),
          compile(
            tokenize(
              "55+A2s+K2s+Q5s+J7s+T7s+96s+85s+75s+64s+54sA4o+K9o+Q9o+JTo+"
            )
          ),
          compile(tokenize("7h7s")),
        ],
      });

      //anyOf(equals([2, 0, 1]), equals([2, 1, 0])),
      expect(simulator["prioritizedHandRangeIndexList"]).toEqual([2, 0, 1]);
    });
  });

  describe("#evaluate()", () => {
    it("chooses card pairs as much as possible", () => {
      const simulator = new Simulator({
        communityCards: "AsKs8s7h6d",
        handRanges: [
          compile(tokenize("AhAd")),
          compile(tokenize("AKsKK")),
          compile(tokenize("AKs")),
        ],
      });

      console.dir(simulator.evaluate(), { depth: 100 });

      expect(() => simulator.evaluate()).not.toThrow();
    });
  });
});

// void main() {
//   group("Simulator", () {

//     group("#evaluate()", () {
//       test("it chooses card pairs as much as possible", () {
//         expect(
//           () => Simulator(
//             communityCards: {
//               Card(rank: Rank.ace, suit: Suit.spade),
//               Card(rank: Rank.king, suit: Suit.spade),
//               Card(rank: Rank.eight, suit: Suit.spade),
//               Card(rank: Rank.seven, suit: Suit.heart),
//               Card(rank: Rank.six, suit: Suit.diamond),
//             },
//             handRanges: [
//               HandRange({
//                 CardPair(
//                   Card(rank: Rank.ace, suit: Suit.heart),
//                   Card(rank: Rank.ace, suit: Suit.diamond),
//                 ),
//               }),
//               HandRange({
//                 RankPair.suited(high: Rank.ace, kicker: Rank.king),
//                 RankPair.ofsuit(high: Rank.king, kicker: Rank.king),
//               }),
//               HandRange({
//                 RankPair.suited(high: Rank.ace, kicker: Rank.king),
//               }),
//             ],
//           ).evaluate(),
//           isNot(throwsA(isA<NoPossibleMatchupException>())),
//         );
//       });

//       test(
//           "it throws NoPossibleMatchupException when there's no possible card combination",
//           () {
//         expect(
//           () => Simulator(
//             communityCards: {
//               Card(rank: Rank.ace, suit: Suit.spade),
//               Card(rank: Rank.king, suit: Suit.spade),
//               Card(rank: Rank.eight, suit: Suit.spade),
//               Card(rank: Rank.seven, suit: Suit.heart),
//               Card(rank: Rank.six, suit: Suit.diamond),
//             },
//             handRanges: [
//               HandRange({
//                 CardPair(
//                   Card(rank: Rank.ace, suit: Suit.heart),
//                   Card(rank: Rank.ace, suit: Suit.diamond),
//                 ),
//               }),
//               HandRange({
//                 RankPair.suited(high: Rank.ace, kicker: Rank.king),
//               }),
//               HandRange({
//                 RankPair.suited(high: Rank.ace, kicker: Rank.king),
//               }),
//             ],
//           ).evaluate(),
//           throwsA(isA<NoPossibleMatchupException>()),
//         );

//         expect(
//           () => Simulator(
//             communityCards: {
//               Card(rank: Rank.ten, suit: Suit.spade),
//               Card(rank: Rank.nine, suit: Suit.spade),
//               Card(rank: Rank.eight, suit: Suit.spade),
//               Card(rank: Rank.seven, suit: Suit.heart),
//               Card(rank: Rank.six, suit: Suit.diamond),
//             },
//             handRanges: [
//               HandRange({
//                 CardPair(
//                   Card(rank: Rank.six, suit: Suit.spade),
//                   Card(rank: Rank.seven, suit: Suit.spade),
//                 )
//               }),
//               HandRange({
//                 RankPair.suited(high: Rank.seven, kicker: Rank.six),
//               }),
//               HandRange({
//                 RankPair.suited(high: Rank.seven, kicker: Rank.six),
//               }),
//             ],
//           ).evaluate(),
//           throwsA(isA<NoPossibleMatchupException>()),
//         );
//       });

//       test("the win probability is within the range of accuracy", () {
//         final simulator = Simulator(
//           communityCards: {
//             Card(rank: Rank.eight, suit: Suit.spade),
//             Card(rank: Rank.jack, suit: Suit.spade),
//             Card(rank: Rank.five, suit: Suit.diamond),
//             Card(rank: Rank.king, suit: Suit.heart),
//           },
//           handRanges: [
//             HandRange({
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.ace),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.king),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.queen),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.ten, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.nine, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.eight, kicker: Rank.eight),
//               RankPair.ofsuit(high: Rank.seven, kicker: Rank.seven),
//               RankPair.ofsuit(high: Rank.six, kicker: Rank.six),
//               RankPair.ofsuit(high: Rank.five, kicker: Rank.five),
//               RankPair.suited(high: Rank.ace, kicker: Rank.king),
//               RankPair.suited(high: Rank.ace, kicker: Rank.queen),
//               RankPair.suited(high: Rank.ace, kicker: Rank.jack),
//               RankPair.suited(high: Rank.ace, kicker: Rank.ten),
//               RankPair.suited(high: Rank.ace, kicker: Rank.nine),
//               RankPair.suited(high: Rank.ace, kicker: Rank.eight),
//               RankPair.suited(high: Rank.ace, kicker: Rank.seven),
//               RankPair.suited(high: Rank.ace, kicker: Rank.six),
//               RankPair.suited(high: Rank.ace, kicker: Rank.five),
//               RankPair.suited(high: Rank.ace, kicker: Rank.four),
//               RankPair.suited(high: Rank.ace, kicker: Rank.three),
//               RankPair.suited(high: Rank.ace, kicker: Rank.deuce),
//               RankPair.suited(high: Rank.king, kicker: Rank.queen),
//               RankPair.suited(high: Rank.king, kicker: Rank.jack),
//               RankPair.suited(high: Rank.king, kicker: Rank.ten),
//               RankPair.suited(high: Rank.king, kicker: Rank.nine),
//               RankPair.suited(high: Rank.king, kicker: Rank.eight),
//               RankPair.suited(high: Rank.king, kicker: Rank.seven),
//               RankPair.suited(high: Rank.king, kicker: Rank.six),
//               RankPair.suited(high: Rank.king, kicker: Rank.five),
//               RankPair.suited(high: Rank.king, kicker: Rank.four),
//               RankPair.suited(high: Rank.king, kicker: Rank.three),
//               RankPair.suited(high: Rank.king, kicker: Rank.deuce),
//               RankPair.suited(high: Rank.queen, kicker: Rank.jack),
//               RankPair.suited(high: Rank.queen, kicker: Rank.ten),
//               RankPair.suited(high: Rank.queen, kicker: Rank.nine),
//               RankPair.suited(high: Rank.queen, kicker: Rank.eight),
//               RankPair.suited(high: Rank.queen, kicker: Rank.seven),
//               RankPair.suited(high: Rank.queen, kicker: Rank.six),
//               RankPair.suited(high: Rank.queen, kicker: Rank.five),
//               RankPair.suited(high: Rank.jack, kicker: Rank.ten),
//               RankPair.suited(high: Rank.jack, kicker: Rank.nine),
//               RankPair.suited(high: Rank.jack, kicker: Rank.eight),
//               RankPair.suited(high: Rank.jack, kicker: Rank.seven),
//               RankPair.suited(high: Rank.ten, kicker: Rank.nine),
//               RankPair.suited(high: Rank.ten, kicker: Rank.eight),
//               RankPair.suited(high: Rank.ten, kicker: Rank.seven),
//               RankPair.suited(high: Rank.nine, kicker: Rank.eight),
//               RankPair.suited(high: Rank.nine, kicker: Rank.seven),
//               RankPair.suited(high: Rank.nine, kicker: Rank.six),
//               RankPair.suited(high: Rank.eight, kicker: Rank.seven),
//               RankPair.suited(high: Rank.eight, kicker: Rank.six),
//               RankPair.suited(high: Rank.eight, kicker: Rank.five),
//               RankPair.suited(high: Rank.seven, kicker: Rank.six),
//               RankPair.suited(high: Rank.seven, kicker: Rank.five),
//               RankPair.suited(high: Rank.six, kicker: Rank.five),
//               RankPair.suited(high: Rank.six, kicker: Rank.four),
//               RankPair.suited(high: Rank.five, kicker: Rank.four),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.king),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.queen),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.eight),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.seven),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.six),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.five),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.four),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.queen),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.ten),
//             }),
//             HandRange({
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.ace),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.king),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.queen),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.ten, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.nine, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.eight, kicker: Rank.eight),
//               RankPair.ofsuit(high: Rank.seven, kicker: Rank.seven),
//               RankPair.ofsuit(high: Rank.six, kicker: Rank.six),
//               RankPair.ofsuit(high: Rank.five, kicker: Rank.five),
//               RankPair.suited(high: Rank.ace, kicker: Rank.king),
//               RankPair.suited(high: Rank.ace, kicker: Rank.queen),
//               RankPair.suited(high: Rank.ace, kicker: Rank.jack),
//               RankPair.suited(high: Rank.ace, kicker: Rank.ten),
//               RankPair.suited(high: Rank.ace, kicker: Rank.nine),
//               RankPair.suited(high: Rank.ace, kicker: Rank.eight),
//               RankPair.suited(high: Rank.ace, kicker: Rank.seven),
//               RankPair.suited(high: Rank.ace, kicker: Rank.six),
//               RankPair.suited(high: Rank.ace, kicker: Rank.five),
//               RankPair.suited(high: Rank.ace, kicker: Rank.four),
//               RankPair.suited(high: Rank.ace, kicker: Rank.three),
//               RankPair.suited(high: Rank.ace, kicker: Rank.deuce),
//               RankPair.suited(high: Rank.king, kicker: Rank.queen),
//               RankPair.suited(high: Rank.king, kicker: Rank.jack),
//               RankPair.suited(high: Rank.king, kicker: Rank.ten),
//               RankPair.suited(high: Rank.king, kicker: Rank.nine),
//               RankPair.suited(high: Rank.king, kicker: Rank.eight),
//               RankPair.suited(high: Rank.king, kicker: Rank.seven),
//               RankPair.suited(high: Rank.king, kicker: Rank.six),
//               RankPair.suited(high: Rank.king, kicker: Rank.five),
//               RankPair.suited(high: Rank.king, kicker: Rank.four),
//               RankPair.suited(high: Rank.king, kicker: Rank.three),
//               RankPair.suited(high: Rank.king, kicker: Rank.deuce),
//               RankPair.suited(high: Rank.queen, kicker: Rank.jack),
//               RankPair.suited(high: Rank.queen, kicker: Rank.ten),
//               RankPair.suited(high: Rank.queen, kicker: Rank.nine),
//               RankPair.suited(high: Rank.queen, kicker: Rank.eight),
//               RankPair.suited(high: Rank.queen, kicker: Rank.seven),
//               RankPair.suited(high: Rank.queen, kicker: Rank.six),
//               RankPair.suited(high: Rank.queen, kicker: Rank.five),
//               RankPair.suited(high: Rank.jack, kicker: Rank.ten),
//               RankPair.suited(high: Rank.jack, kicker: Rank.nine),
//               RankPair.suited(high: Rank.jack, kicker: Rank.eight),
//               RankPair.suited(high: Rank.jack, kicker: Rank.seven),
//               RankPair.suited(high: Rank.ten, kicker: Rank.nine),
//               RankPair.suited(high: Rank.ten, kicker: Rank.eight),
//               RankPair.suited(high: Rank.ten, kicker: Rank.seven),
//               RankPair.suited(high: Rank.nine, kicker: Rank.eight),
//               RankPair.suited(high: Rank.nine, kicker: Rank.seven),
//               RankPair.suited(high: Rank.nine, kicker: Rank.six),
//               RankPair.suited(high: Rank.eight, kicker: Rank.seven),
//               RankPair.suited(high: Rank.eight, kicker: Rank.six),
//               RankPair.suited(high: Rank.eight, kicker: Rank.five),
//               RankPair.suited(high: Rank.seven, kicker: Rank.six),
//               RankPair.suited(high: Rank.seven, kicker: Rank.five),
//               RankPair.suited(high: Rank.six, kicker: Rank.five),
//               RankPair.suited(high: Rank.six, kicker: Rank.four),
//               RankPair.suited(high: Rank.five, kicker: Rank.four),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.king),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.queen),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.eight),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.seven),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.six),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.five),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.four),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.queen),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.ten),
//             }),
//             HandRange({
//               RankPair.suited(high: Rank.ace, kicker: Rank.deuce),
//               RankPair.suited(high: Rank.ace, kicker: Rank.three),
//               RankPair.suited(high: Rank.ace, kicker: Rank.four),
//               RankPair.suited(high: Rank.ace, kicker: Rank.five),
//               RankPair.suited(high: Rank.ace, kicker: Rank.six),
//               RankPair.suited(high: Rank.ace, kicker: Rank.seven),
//               RankPair.suited(high: Rank.ace, kicker: Rank.eight),
//               RankPair.suited(high: Rank.ace, kicker: Rank.nine),
//               RankPair.suited(high: Rank.ace, kicker: Rank.ten),
//               RankPair.suited(high: Rank.ace, kicker: Rank.jack),
//               RankPair.suited(high: Rank.ace, kicker: Rank.queen),
//               RankPair.suited(high: Rank.ace, kicker: Rank.king),
//               RankPair.ofsuit(high: Rank.five, kicker: Rank.five),
//               RankPair.ofsuit(high: Rank.six, kicker: Rank.six),
//               RankPair.ofsuit(high: Rank.seven, kicker: Rank.seven),
//               RankPair.ofsuit(high: Rank.eight, kicker: Rank.eight),
//               RankPair.ofsuit(high: Rank.nine, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.ten, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.queen),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.king),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.ace),
//             }),
//             HandRange({
//               RankPair.suited(high: Rank.ace, kicker: Rank.deuce),
//               RankPair.suited(high: Rank.ace, kicker: Rank.three),
//               RankPair.suited(high: Rank.ace, kicker: Rank.four),
//               RankPair.suited(high: Rank.ace, kicker: Rank.five),
//               RankPair.suited(high: Rank.ace, kicker: Rank.six),
//               RankPair.suited(high: Rank.ace, kicker: Rank.seven),
//               RankPair.suited(high: Rank.ace, kicker: Rank.eight),
//               RankPair.suited(high: Rank.ace, kicker: Rank.nine),
//               RankPair.suited(high: Rank.ace, kicker: Rank.ten),
//               RankPair.suited(high: Rank.ace, kicker: Rank.jack),
//               RankPair.suited(high: Rank.ace, kicker: Rank.queen),
//               RankPair.suited(high: Rank.ace, kicker: Rank.king),
//               RankPair.ofsuit(high: Rank.five, kicker: Rank.five),
//               RankPair.ofsuit(high: Rank.six, kicker: Rank.six),
//               RankPair.ofsuit(high: Rank.seven, kicker: Rank.seven),
//               RankPair.ofsuit(high: Rank.eight, kicker: Rank.eight),
//               RankPair.ofsuit(high: Rank.nine, kicker: Rank.nine),
//               RankPair.ofsuit(high: Rank.ten, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.queen),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.king),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.ace),
//             }),
//             HandRange({
//               RankPair.suited(high: Rank.eight, kicker: Rank.seven),
//               RankPair.suited(high: Rank.nine, kicker: Rank.eight),
//               RankPair.suited(high: Rank.seven, kicker: Rank.six),
//               RankPair.ofsuit(high: Rank.ten, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.queen),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.king),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.ace),
//             }),
//             HandRange({
//               RankPair.suited(high: Rank.eight, kicker: Rank.seven),
//               RankPair.suited(high: Rank.nine, kicker: Rank.eight),
//               RankPair.suited(high: Rank.seven, kicker: Rank.six),
//               RankPair.ofsuit(high: Rank.ten, kicker: Rank.ten),
//               RankPair.ofsuit(high: Rank.jack, kicker: Rank.jack),
//               RankPair.ofsuit(high: Rank.queen, kicker: Rank.queen),
//               RankPair.ofsuit(high: Rank.king, kicker: Rank.king),
//               RankPair.ofsuit(high: Rank.ace, kicker: Rank.ace),
//             }),
//           ],
//         );

//         final winCounts = [0, 1, 2, 3, 4, 5];

//         for (int i = 0; i < 10000; ++i) {
//           final matchup = simulator.evaluate();

//           for (final index in matchup.bestHandIndexes) {
//             winCounts[index] += 1;
//           }
//         }

//         expect(
//           winCounts[0],
//           allOf(greaterThanOrEqualTo(1175 - 150), lessThan(1175 + 150)),
//         );
//         expect(
//           winCounts[1],
//           allOf(greaterThanOrEqualTo(1175 - 150), lessThan(1175 + 150)),
//         );
//         expect(
//           winCounts[2],
//           allOf(greaterThanOrEqualTo(1450 - 150), lessThan(1450 + 150)),
//         );
//         expect(
//           winCounts[3],
//           allOf(greaterThanOrEqualTo(1450 - 150), lessThan(1450 + 150)),
//         );
//         expect(
//           winCounts[4],
//           allOf(greaterThanOrEqualTo(2425 - 150), lessThan(2425 + 150)),
//         );
//         expect(
//           winCounts[5],
//           allOf(greaterThanOrEqualTo(2425 - 150), lessThan(2425 + 150)),
//         );
//       });
//     });
//   });

//   group("MatchupResult", () {
//     group("#wonPlayerIndex", () {
//       test("it always contains either or all player index", () {
//         final simulator = Simulator(
//           communityCards: {},
//           handRanges: [
//             HandRange({
//               CardPair(
//                 Card(rank: Rank.ace, suit: Suit.spade),
//                 Card(rank: Rank.king, suit: Suit.spade),
//               )
//             }),
//             HandRange({
//               CardPair(
//                 Card(rank: Rank.eight, suit: Suit.diamond),
//                 Card(rank: Rank.eight, suit: Suit.club),
//               ),
//             }),
//           ],
//         );

//         expect(
//           simulator.evaluate().bestHandIndexes,
//           anyOf(contains(0), contains(1)),
//         );
//       });
//     });
//   });
// }
