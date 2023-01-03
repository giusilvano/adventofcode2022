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

const RIGHT = 0,
  DOWN = 1,
  LEFT = 2,
  UP = 3;

function move3d(
  x: number,
  y: number,
  destFaceX: number,
  destFaceY: number,
  rotation: number
) {}

function solve(map: string[][], path: (number | "R" | "L")[]): number {
  const map2 = structuredClone(map);
  let face = 0;
  let rotation = 0;
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
      const face3d = (face + rotation) % 4;
      if (face3d === RIGHT) map2[y][x] = ">";
      else if (face3d == DOWN) map2[y][x] = "v";
      else if (face3d == LEFT) map2[y][x] = "<";
      else if (face3d == UP) map2[y][x] = "^";

      if (x < 0 || y < 0) console.log("below zero");

      const prevX = x,
        prevY = y;

      if (face3d === RIGHT) x++;
      else if (face3d == DOWN) y++;
      else if (face3d == LEFT) x--;
      else if (face3d == UP) y--;

      let tile = map[y]?.[x];

      if (tile === " " || tile === undefined) {
        const faceX = Math.floor(x / 4);
        const faceY = Math.floor(y / 4);
        if (faceX === 0 && faceY === 0) {
          if (face3d === UP) {
            // Coming up from bottom border, entering down from top border
            rotation += 2;
            x = 12 - x;
            y = 4 - y;
          } else {
            throw new Error();
          }
        } else if (faceX === 1 && faceY === 0) {
          if (face3d === UP) {
            // Coming up from bottom border, entering right from left border
            rotation += 1;
            x = y;
            y = x - 4;
          } else if (face3d === LEFT) {
            // Coming left from right border, entering down from top border
            rotation -= 1;
            y = x - 8 + 4;
            x = y + 4;
          } else {
            throw new Error();
          }
        } else if (faceX === 3 && faceY === 0) {
          if (face3d === RIGHT) {
            rotation += 2;
            x = 16 - (12 - x);
            y = 12 - y;
          } else {
            throw new Error();
          }
        } else if (faceX === 3 && faceY === 1) {
          if (face3d === RIGHT) {
            rotation += 1;
            y = x - 8 + 8;
            x = 16 - (y - 7);
          } else if (face3d === 3) {
            rotation -= 1;
            y = 8 - (x - 12);
            x = 8 + (y - 4);
          } else {
            throw new Error();
          }
        }
        //////
        else if (faceX === 0 && faceY === 2) {
          if (face3d === DOWN) {
            rotation += 2;
            x = 12 - x;
            y = 12 - (y - 8);
          } else {
            throw new Error();
          }
        } else if (faceX === 1 && faceY === 2) {
          if (face3d === DOWN) {
            rotation -= 1;
            y = 12 - (x - 4);
            x = y - 4 + 8;
          } else if (face3d === LEFT) {
            rotation += 1;
            y = 8 - (8 - x);
            x = 4 + (12 - y);
          } else {
            throw new Error();
          }
        } else if (x < 0) {
          x = 16 + x;
        } else if (y < 0) {
          y = 12 + y;
        } else if (x >= 16) {
          x = x - 16;
        } else if (y >= 12) {
          y = y - 12;
        }
      }

      tile = map[y]?.[x];

      if (tile === undefined || tile === " ") console.log("out of board");

      if (tile === "#") {
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
// input = Deno.readTextFileSync("input.txt");

const { map, path } = parseInput(input);

// part2: 5031

console.log("Part One:", solve(map, path)); //106094
// console.log("Part Two:", solve(monkeys, true));
