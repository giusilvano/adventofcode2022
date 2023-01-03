/**
 * Day 4: Camp Cleanup
 * https://adventofcode.com/2022/day/4
 */

const input = await Deno.readTextFile("input.txt");

const pairs = input
  .split("\n")
  .map((pairString) =>
    pairString
      .split(",")
      .map((rangeString) => rangeString.split("-").map(Number))
  );

let part1 = 0;
let part2 = 0;

for (let i = 0; i < pairs.length; i++) {
  const [first, second] = pairs[i];
  if (
    (first[0] >= second[0] && first[1] <= second[1]) ||
    (second[0] >= first[0] && second[1] <= first[1])
  ) {
    part1 += 1; // 483
  }

  if (!(second[0] > first[1] || second[1] < first[0])) {
    part2 += 1; // 874
  }
}
console.log(part1, part2);
