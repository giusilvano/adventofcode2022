/**
 * Day 21: Monkey Map
 * https://adventofcode.com/2022/day/22
 */

function parseInput(input: string) {
  const map: string[][] = [];
  const rows = input.split("\n");
  for (let i = 0; i < rows.length - 2; i++) map.push([...rows[i]]);

  const pathString = rows[rows.length - 1];
  const path = pathString
    .replaceAll(/(R|L)/g, " $1 ")
    .trim()
    .split(" ")
    .map((item) => (["R", "L"].includes(item) ? item : Number(item))) as (
    | number
    | "R"
    | "L"
  )[];
  return { map, path };
}

function printMap(map: string[][]) {
  console.log(map.map((row) => row.join("")).join("\n"));
}

function solve(map: string[][], path: (number | "R" | "L")[]): number {
  const map2 = structuredClone(map);
  let face = 0;
  let x = map[0].indexOf("."),
    y = 0;

  // Mark starting position
  // map[y][x] = "A";

  for (const movement of path) {
    if (movement === "R") {
      face++;
      if (face === 4) face = 0;
      continue;
    }
    if (movement === "L") {
      face--;
      if (face === -1) face = 3;
      continue;
    }

    for (let i = 0; i < movement; i++) {
      if (face === 0) map2[y][x] = ">";
      else if (face == 1) map2[y][x] = "v";
      else if (face == 2) map2[y][x] = "<";
      else if (face == 3) map2[y][x] = "^";

      if (x < 0 || y < 0) console.log("below zero");

      const prevX = x,
        prevY = y;

      if (face === 0) x++;
      else if (face == 1) y++;
      else if (face == 2) x--;
      else if (face == 3) y--;

      let tile = map[y]?.[x];

      function Xstart(y: number) {
        for (let x = 0; x < map[x].length; x++)
          if (map[y]?.[x] !== undefined && map[y]?.[x] !== " ") return x;
        throw new Error();
      }
      function Xend(y: number) {
        for (let x = map[y].length - 1; x >= 0; x--)
          if (map[y]?.[x] !== undefined && map[y]?.[x] !== " ") return x;
        throw new Error();
      }
      function Ystart(x: number) {
        for (let y = 0; y < map.length; y++)
          if (map[y]?.[x] !== undefined && map[y]?.[x] !== " ") return y;
        throw new Error();
      }
      function Yend(x: number) {
        for (let y = map.length - 1; y >= 0; y--)
          if (map[y]?.[x] !== undefined && map[y]?.[x] !== " ") return y;
        throw new Error();
      }
      let hey = false;
      if (tile === " " || tile === undefined) {
        hey = true;
        if (face === 0) x = Xstart(y);
        else if (face == 1) y = Ystart(x);
        else if (face == 2) x = Xend(y);
        else if (face == 3) y = Yend(x);
      }

      tile = map[y]?.[x];

      if (tile === undefined || tile === " ") console.log("out of board");

      if (tile === "#") {
        if (hey) console.log("hey");
        x = prevX;
        y = prevY;
        break;
      }
    }
  }

  if (face === 0) map2[y][x] = ">";
  else if (face == 1) map2[y][x] = "v";
  else if (face == 2) map2[y][x] = "<";
  else if (face == 3) map2[y][x] = "^";
  printMap(map2);

  return 1000 * (y + 1) + 4 * (x + 1) + face;
}

let input = Deno.readTextFileSync("inputTest.txt");
input = Deno.readTextFileSync("input.txt");

const { map, path } = parseInput(input);

console.log("Part One:", solve(map, path)); //106094
// console.log("Part Two:", solve(monkeys, true));
