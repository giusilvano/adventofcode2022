// https://adventofcode.com/2022/day/13

// First part
let input = await Deno.readTextFile("inputTest.txt");
input = await Deno.readTextFile("input.txt");

const rows = input
  .split("\n")
  .map((r) => r.split(" -> ").map((i) => i.split(",").map((j) => Number(j))));
// console.log(rows);

function key(x: number, y: number) {
  return `${x}|${y}`;
}

const map: any = {};
const sandKey = key(500, 0);
map[sandKey] = "+";

function snap() {
  let out = "";
  const startX = 494;
  let x = 494,
    y = 0;
  const maxX = 503,
    maxY = 9;
  while (y <= maxY) {
    let line = "";
    while (x <= maxX) {
      line += map[key(x, y)] || ".";
      x++;
    }
    out += line + "\n";
    x = startX;
    y++;
  }
  console.log(out);
}

let maxY = 0;

for (const row of rows) {
  let curX, curY;
  for (const coord of row) {
    if (curX === undefined || curY === undefined) {
      [curX, curY] = coord;
      continue;
    }
    let [x, y] = coord;
    map[key(curX, curY)] = "#";
    if (curY > maxY) maxY = curY;
    while (curX !== x || curY !== y) {
      if (x > curX) curX++;
      if (x < curX) curX--;
      if (y > curY) curY++;
      if (y < curY) curY--;
      map[key(curX, curY)] = "#";
      if (curY > maxY) maxY = curY;
    }
    [curX, curY] = coord;
  }
}

const sandUnits = 24;
let restSand = 0;

let fallOut = false;
while (!fallOut) {
  let x = 500,
    y = 0;
  while (true) {
    if (y > maxY) {
      fallOut = true;
      break;
    }
    if (!map[key(x, y + 1)]) {
      y++;
      continue;
    }
    if (!map[key(x - 1, y + 1)]) {
      y++;
      x--;
      continue;
    }
    if (!map[key(x + 1, y + 1)]) {
      y++;
      x++;
      continue;
    }
    map[key(x, y)] = "o";
    restSand++;
    break;
  }
}

console.log(restSand); // 24, 832

const floor = maxY + 2;
let flowing = true;
while (flowing) {
  let x = 500,
    y = 0;
  while (true) {
    if (y < floor - 1 && !map[key(x, y + 1)]) {
      y++;
      continue;
    }
    if (y < floor - 1 && !map[key(x - 1, y + 1)]) {
      y++;
      x--;
      continue;
    }
    if (y < floor - 1 && !map[key(x + 1, y + 1)]) {
      y++;
      x++;
      continue;
    }
    map[key(x, y)] = "o";
    restSand++;

    if (x === 500 && y === 0) {
      flowing = false;
    }
    break;
  }
}

// snap();
console.log(restSand); // 93, 27601
