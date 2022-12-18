/**
 * Day 2: Rock Paper Scissors
 * https://adventofcode.com/2022/day/2
 */

const scoresPartOne: { [key: string]: number } = {
  "A X": 1 + 3,
  "B X": 1 + 0,
  "C X": 1 + 6,
  "A Y": 2 + 6,
  "B Y": 2 + 3,
  "C Y": 2 + 0,
  "A Z": 3 + 0,
  "B Z": 3 + 6,
  "C Z": 3 + 3,
};

const scoresPartTwo: { [key: string]: number } = {
  "A X": 3 + 0,
  "B X": 1 + 0,
  "C X": 2 + 0,
  "A Y": 1 + 3,
  "B Y": 2 + 3,
  "C Y": 3 + 3,
  "A Z": 2 + 6,
  "B Z": 3 + 6,
  "C Z": 1 + 6,
};

let partOne = 0;
let partTwo = 0;

const input = Deno.readTextFileSync("input.txt");
const rows = input.split("\n");

for (const row of rows) {
  partOne += scoresPartOne[row];
  partTwo += scoresPartTwo[row];
}

console.log("Part One:", partOne);
console.log("Part Two:", partTwo);
