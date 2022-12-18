/**
 * Day 3: Rucksack Reorganization
 * https://adventofcode.com/2022/day/2
 */

const input = await Deno.readTextFile("input.txt");

const data = input.split("\n");

function priority(letter: string) {
  if (letter === letter.toLowerCase()) {
    return letter.charCodeAt(0) - 96;
  } else {
    return letter.charCodeAt(0) - 65 + 27;
  }
}

let part1 = 0;
let part2 = 0;

let member = 0;

let cache: any = {};
for (const row of data) {
  const firstHalf = new Set<number>();
  const secondHalf = new Set<number>();
  for (let i = 0; i < row.length / 2; i++) {
    const char = priority(row.charAt(i));
    if (!cache[char]) cache[char] = [];
    cache[char][member] = 1;
    firstHalf.add(char);
  }
  for (let i = row.length / 2; i < row.length; i++) {
    const char = priority(row.charAt(i));
    if (!cache[char]) cache[char] = [];
    cache[char][member] = 1;
    secondHalf.add(char);
  }
  for (const elem of firstHalf) {
    if (secondHalf.has(elem)) {
      part1 += elem;
    }
  }

  if (member === 2) {
    for (const [key, val] of Object.entries(cache)) {
      if ((val as any)[0] && (val as any)[1] && (val as any)[2])
        part2 += Number(key);
    }
    member = 0;
    cache = {};
  } else {
    member += 1;
  }
}
console.log(member);
console.log(part1, part2);
