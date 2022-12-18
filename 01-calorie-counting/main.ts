/**
 * Day 1: Calorie Counting
 * https://adventofcode.com/2022/day/1
 */

const input = await Deno.readTextFile("input.txt");

const rows = input.split("\n");

// Init elfs array with just one elf with 0 calories
let elfs: number[] = [0];

for (const row of rows) {
  if (row === "") {
    // An empty line means we are starting the calories group of a different
    // elf: add it to the array starting with 0 calories
    elfs.push(0);
  } else {
    // Add calories to the last elf in the list
    elfs[elfs.length - 1] += Number(row);
  }
}

console.log("Part One:", Math.max(...elfs));

elfs = elfs.sort((a, b) => b - a);

console.log("Part Two:", elfs[0] + elfs[1] + elfs[2]);
