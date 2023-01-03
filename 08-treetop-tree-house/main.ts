/**
 * Day 8: Treetop Tree House
 * https://adventofcode.com/2022/day/8
 */

let input = await Deno.readTextFile("inputTest.txt");
input = await Deno.readTextFile("input.txt");

const forest = input.split("\n").map((row) => row.split("").map(Number));
const forestSize = forest.length;

let visibleTrees = 0;
const scenicScores = [];

for (let row = 0; row < forest.length; row++) {
  for (let col = 0; col < forest[row].length; col++) {
    const tree = forest[row][col];

    let visibleFromOutside = false;
    let viewDistance;
    let scenicScore = 1;
    let i;

    for (i = row - 1, viewDistance = 0; i >= 0; i--) {
      viewDistance++;
      if (forest[i][col] >= tree) break;
    }
    if (i === -1) visibleFromOutside = true;
    scenicScore *= viewDistance;

    for (i = row + 1, viewDistance = 0; i < forestSize; i++) {
      viewDistance++;
      if (forest[i][col] >= tree) break;
    }
    if (i === forestSize) visibleFromOutside = true;
    scenicScore *= viewDistance;

    for (i = col - 1, viewDistance = 0; i >= 0; i--) {
      viewDistance++;
      if (forest[row][i] >= tree) break;
    }
    if (i === -1) visibleFromOutside = true;
    scenicScore *= viewDistance;

    for (i = col + 1, viewDistance = 0; i < forestSize; i++) {
      viewDistance++;
      if (forest[row][i] >= tree) break;
    }
    if (i === forestSize) visibleFromOutside = true;
    scenicScore *= viewDistance;

    if (visibleFromOutside) visibleTrees++;
    scenicScores.push(scenicScore);
  }
}

console.log(visibleTrees); //1823
console.log(Math.max(...scenicScores)); //211680
