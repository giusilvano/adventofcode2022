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
      if (face + rotation === 0) map2[y][x] = ">";
      else if (face + rotation == 1) map2[y][x] = "v";
      else if (face + rotation == 2) map2[y][x] = "<";
      else if (face + rotation == 3) map2[y][x] = "^";

      if (x < 0 || y < 0) console.log("below zero");

      const prevX = x,
        prevY = y;

      if (face + rotation === 0) x++;
      else if (face + rotation == 1) y++;
      else if (face + rotation == 2) x--;
      else if (face + rotation == 3) y--;

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
      if (tile === " " || tile === undefined) {
        // if (x >= 100 && y >= 50) {
        //   if (face + rotation === 1) {
        //     // Coming down, entering right
        //     rotation++;
        //     x = 99 - (y - 50); //99
        //     y = 49 + (x - 100); //50
        //   } else if (face + rotation === 0) {
        //     // Coming right, entering up
        //     rotation--;
        //     x = 99 + (y - 50);
        //     y = 50 - (x - 100);
        //   }
        if (x < 4 && y < 4) {
          if (face + rotation === 3) {
            // Coming up from bottom border, entering down from top border
            rotation += 2;
            x = 12 - x;
            y = 4 - y;
          } else {
            throw new Error();
          }
        } else if (x < 8 && y < 4) {
          if (face + rotation === 3) {
            // Coming up from bottom border, entering right from left border
            rotation += 1;
            x = y;
            y = x - 4;
          } else if (face + rotation === 2) {
            // Coming left from right border, entering down from top border
            rotation -= 1;
            y = x - 8 + 4;
            x = y + 4;
          } else {
            throw new Error();
          }
        } else if (x >= 12 && y < 4) {
          if (face + rotation === 0) {
            rotation += 2;
            x = 16 - (12 - x);
            y = 12 - y;
          } else {
            throw new Error();
          }
        } else if (x >= 12 && y < 8) {
          if (face + rotation === 0) {
            rotation += 1;
            y = x - 8 + 8;
            x = 16 - (y - 4);
          } else if (face + rotation === 3) {
            rotation -= 1;
            y = 8 - (x - 12);
            x = 8 + (y - 4);
          } else {
            throw new Error();
          }
        }
        //////
        else if (x < 4 && y >= 4) {
          if (face + rotation === 1) {
            rotation += 2;
            x = 12 - x;
            y = 12 - (y - 8);
          } else {
            throw new Error();
          }
        } else if (x < 8 && y >= 4) {
          if (face + rotation === 1) {
            // Coming up from bottom border, entering right from left border
            rotation -= 1;
            y = 12 - (x - 4);
            x = y - 4 + 8;
          } else if (face + rotation === 2) {
            // Coming left from right border, entering down from top border
            rotation += 1;
            y = 8 - (8 - x);
            x = 4 + (12 - y);
          } else {
            throw new Error();
          }
        } else if (x < 0) {
          x = 16 - x;
        } else if (y < 0) {
          y = 12 - y;
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

console.log("Part One:", solve(map, path)); //106094
// console.log("Part Two:", solve(monkeys, true));
