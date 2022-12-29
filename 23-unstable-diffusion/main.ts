/**
 * Day 23: Unstable Diffusion
 * https://adventofcode.com/2022/day/23
 */

interface Position {
  x: number;
  y: number;
}

function key(y: number, x: number) {
  return `${y} ${x}`;
}

function parseInput(input: string) {
  const elfs: { [k: string]: Position } = {};
  const map = input
    .split("\n")
    .map((row) => row.split("").map((char) => (char === "#" ? 1 : 0)));
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x]) elfs[key(y, x)] = { x, y };
    }
  }
  return { elfs, map };
}

function solve(input: any, maxRounds?: number) {
  let { elfs } = input;
  elfs = structuredClone(elfs);

  const directions = ["N", "S", "W", "E"];
  // const steps = [
  //   { x: 0, y: -1 },
  //   { x: 0, y: +1 },
  //   { x: -1, y: 0 },
  //   { x: 1, y: 0 },
  // ];
  let rounds = 0;
  while (true) {
    const proposals: any = {};
    for (const elf of Object.values(elfs) as any) {
      const { x, y } = elf;
      if (
        !elfs[key(y - 1, x - 1)] &&
        !elfs[key(y - 1, x)] &&
        !elfs[key(y - 1, x + 1)] &&
        !elfs[key(y, x + 1)] &&
        !elfs[key(y + 1, x + 1)] &&
        !elfs[key(y + 1, x)] &&
        !elfs[key(y + 1, x - 1)] &&
        !elfs[key(y, x - 1)]
      )
        continue;
      for (const direction of directions) {
        if (
          direction === "N" &&
          !elfs[key(y - 1, x - 1)] &&
          !elfs[key(y - 1, x)] &&
          !elfs[key(y - 1, x + 1)]
        ) {
          const keyy = key(y - 1, x);
          if (!proposals[keyy])
            proposals[keyy] = { destination: { x, y: y - 1 }, elffs: [] };
          proposals[keyy].elffs.push(elf);
          break;
        }
        if (
          direction === "S" &&
          !elfs[key(y + 1, x - 1)] &&
          !elfs[key(y + 1, x)] &&
          !elfs[key(y + 1, x + 1)]
        ) {
          const keyy = key(y + 1, x);
          if (!proposals[keyy])
            proposals[keyy] = { destination: { x, y: y + 1 }, elffs: [] };
          proposals[keyy].elffs.push(elf);
          break;
        }
        if (
          direction === "W" &&
          !elfs[key(y - 1, x - 1)] &&
          !elfs[key(y, x - 1)] &&
          !elfs[key(y + 1, x - 1)]
        ) {
          const keyy = key(y, x - 1);
          if (!proposals[keyy])
            proposals[keyy] = { destination: { x: x - 1, y }, elffs: [] };
          proposals[keyy].elffs.push(elf);
          break;
        }
        if (
          direction === "E" &&
          !elfs[key(y - 1, x + 1)] &&
          !elfs[key(y, x + 1)] &&
          !elfs[key(y + 1, x + 1)]
        ) {
          const keyy = key(y, x + 1);
          if (!proposals[keyy])
            proposals[keyy] = { destination: { x: x + 1, y }, elffs: [] };
          proposals[keyy].elffs.push(elf);
          break;
        }
      }
    }
    let movedElfs = 0;
    for (const proposal of Object.values(proposals)) {
      const { destination, elffs } = proposal as any;
      if (elffs.length > 1) continue;
      delete elfs[key(elffs[0].y, elffs[0].x)];
      const { y, x } = destination;
      elfs[key(y, x)] = { y, x };
      movedElfs++;
    }

    directions.push(directions.shift()!);
    rounds++;

    if (movedElfs === 0) break;
    if (rounds === maxRounds) break;

    // draw(elfs);
  }

  return { elfs, rounds };
}

function draw(elfs: { [k: string]: Position }) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const elf of Object.values(elfs)) {
    minX = Math.min(minX, elf.x);
    minY = Math.min(minY, elf.y);
    maxX = Math.max(maxX, elf.x);
    maxY = Math.max(maxY, elf.y);
  }
  let str = "";
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      str += elfs[key(y, x)] ? "#" : ".";
    }
    str += "\n";
  }

  console.log(str);
}

function countEmptyGround(elfs: { [k: string]: Position }) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const elf of Object.values(elfs)) {
    minX = Math.min(minX, elf.x);
    minY = Math.min(minY, elf.y);
    maxX = Math.max(maxX, elf.x);
    maxY = Math.max(maxY, elf.y);
  }
  let count = 0;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (!elfs[key(y, x)]) count++;
    }
  }

  return count;
}

let input = Deno.readTextFileSync("inputTest.txt");
input = Deno.readTextFileSync("input.txt");

const { elfs } = solve(parseInput(input), 10);

// 3970 part1
// 923  part2
console.log("Part One:", countEmptyGround(elfs));

const { rounds } = solve(parseInput(input));

console.log("Part Two:", rounds);
