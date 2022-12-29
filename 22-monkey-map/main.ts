/**
 * Day 22: Monkey Map
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

type Face = typeof RIGHT | typeof DOWN | typeof LEFT | typeof UP;

const delta = {
  [RIGHT]: { x: 1, y: 0 },
  [DOWN]: { x: 0, y: 1 },
  [LEFT]: { x: -1, y: 0 },
  [UP]: { x: 0, y: -1 },
};

// const input = Deno.readTextFileSync("inputTest.txt");
// const cubeSize = 4;
// const connections1 = {
//   [`0 2 ${RIGHT}`]: `2 3 ${LEFT}`,
//   [`0 2 ${LEFT}`]: `1 1 ${DOWN}`,
//   [`0 2 ${UP}`]: `1 0 ${DOWN}`,
//   [`1 0 ${DOWN}`]: `2 2 ${UP}`,
//   [`1 0 ${LEFT}`]: `2 3 ${UP}`,
//   [`1 1 ${DOWN}`]: `2 2 ${RIGHT}`,
//   [`1 2 ${RIGHT}`]: `2 3 ${DOWN}`,
// };

const input = Deno.readTextFileSync("input.txt");
const cubeSize = 50;
const connections1 = {
  [`0 1 ${LEFT}`]: `2 0 ${RIGHT}`,
  [`0 1 ${UP}`]: `3 0 ${RIGHT}`,
  [`0 2 ${RIGHT}`]: `2 1 ${LEFT}`,
  [`0 2 ${DOWN}`]: `1 1 ${LEFT}`,
  [`0 2 ${UP}`]: `3 0 ${UP}`,
  [`1 1 ${LEFT}`]: `2 0 ${DOWN}`,
  [`3 0 ${RIGHT}`]: `2 1 ${UP}`,
};

function decodeEdge(string: string) {
  return string.split(" ").map(Number);
}

function encodeEdge(facetY: number, facetX: number, face: number) {
  return [facetY, facetX, face].join(" ");
}

const connections = { ...connections1 };
for (const [edge1, edge2] of Object.entries(connections1)) {
  const [y1, x1, face1] = decodeEdge(edge1);
  const [y2, x2, face2] = decodeEdge(edge2);
  connections[encodeEdge(y2, x2, (face2 + 2) % 4)] = encodeEdge(
    y1,
    x1,
    (face1 + 2) % 4
  );
}

function move3d(y: number, x: number, face: Face) {
  const facetY = Math.floor(y / cubeSize),
    facetX = Math.floor(x / cubeSize);
  const key = encodeEdge(facetY, facetX, face);
  if (!Object.hasOwn(connections, key)) throw new Error();
  const edgeString = connections[key];
  const [newFacetY, newFacetX, newFace] = decodeEdge(edgeString);

  y += delta[face].y;
  x += delta[face].x;
  if (y < 0) y = cubeSize + y;
  if (x < 0) x = cubeSize + x;
  y %= cubeSize;
  x %= cubeSize;
  while (face !== newFace) {
    const tmpY = y;
    y = x;
    x = cubeSize - 1 - tmpY;
    face++;
    face %= 4;
  }

  y += newFacetY * cubeSize;
  x += newFacetX * cubeSize;
  return { y, x, face };
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
      if (face === RIGHT) map2[y][x] = ">";
      else if (face == DOWN) map2[y][x] = "v";
      else if (face == LEFT) map2[y][x] = "<";
      else if (face == UP) map2[y][x] = "^";

      if (x < 0 || y < 0) console.log("below zero");

      const prevX = x,
        prevY = y,
        prevFace = face;

      if (face === RIGHT) x++;
      else if (face == DOWN) y++;
      else if (face == LEFT) x--;
      else if (face == UP) y--;

      let tile = map[y]?.[x];

      if (tile === " " || tile === undefined) {
        ({ y, x, face } = move3d(prevY, prevX, prevFace as Face));
      }

      tile = map[y]?.[x];

      if (tile === undefined || tile === " ") console.log("out of board");

      if (tile === "#") {
        x = prevX;
        y = prevY;
        face = prevFace;
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

const { map, path } = parseInput(input);

console.log("Part One:", solve(map, path)); // 6032, 106094
// console.log("Part Two:", solve(monkeys, true)); // 5031, 162038
