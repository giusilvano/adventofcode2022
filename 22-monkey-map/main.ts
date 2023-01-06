/**
 * Day 22: Monkey Map
 * https://adventofcode.com/2022/day/22
 */

type Map = string[][];
type Instruction = number | "R" | "L";

const RIGHT = 0,
  DOWN = 1,
  LEFT = 2,
  UP = 3;

type Face = typeof RIGHT | typeof DOWN | typeof LEFT | typeof UP;

const faceChar = {
  [RIGHT]: ">",
  [DOWN]: "v",
  [LEFT]: "<",
  [UP]: "^",
};

const delta = {
  [RIGHT]: { x: 1, y: 0 },
  [DOWN]: { x: 0, y: 1 },
  [LEFT]: { x: -1, y: 0 },
  [UP]: { x: 0, y: -1 },
};

function parseInput(input: string) {
  input = input.trimEnd();

  // Parse map
  const map: Map = [];
  const rows = input.split("\n");
  for (let i = 0; i < rows.length - 2; i++) map.push([...rows[i]]);

  // Parse instructions
  const instructionsString = rows[rows.length - 1];
  const instructions = instructionsString
    .replaceAll(/(R|L)/g, " $1 ") // Put spaces around the Rs and Ls
    .trim()
    .split(" ")
    .map((item) =>
      ["R", "L"].includes(item) ? item : Number(item)
    ) as Instruction[];

  return { map, instructions };
}

function printMap(map: Map) {
  console.log("\n" + map.map((row) => row.join("")).join("\n") + "\n");
}

function getCubeSize(map: Map) {
  let nonEmptyCoords = 0;
  for (const row of map) {
    for (const tile of row) {
      if (tile !== undefined && tile !== " ") nonEmptyCoords++;
    }
  }
  // Every map must contain all the 6 faces of the cube.
  // If we divide by 6 the number of non-empty cells we obtain the area of one
  // face, then we can get the side using the square root.
  return Math.sqrt(nonEmptyCoords / 6);
}

function decodeEdge(string: string) {
  return string.split(" ").map(Number) as [number, number, Face];
}

function encodeEdge(facetY: number, facetX: number, face: number) {
  return [facetY, facetX, face].join(" ");
}

function getEdgesAdjacencies(cubeSize: number) {
  const baseAdjacencies =
    cubeSize === 4
      ? {
          [`0 2 ${RIGHT}`]: `2 3 ${LEFT}`,
          [`0 2 ${LEFT}`]: `1 1 ${DOWN}`,
          [`0 2 ${UP}`]: `1 0 ${DOWN}`,
          [`1 0 ${DOWN}`]: `2 2 ${UP}`,
          [`1 0 ${LEFT}`]: `2 3 ${UP}`,
          [`1 1 ${DOWN}`]: `2 2 ${RIGHT}`,
          [`1 2 ${RIGHT}`]: `2 3 ${DOWN}`,
        }
      : {
          [`0 1 ${LEFT}`]: `2 0 ${RIGHT}`,
          [`0 1 ${UP}`]: `3 0 ${RIGHT}`,
          [`0 2 ${RIGHT}`]: `2 1 ${LEFT}`,
          [`0 2 ${DOWN}`]: `1 1 ${LEFT}`,
          [`0 2 ${UP}`]: `3 0 ${UP}`,
          [`1 1 ${LEFT}`]: `2 0 ${DOWN}`,
          [`3 0 ${RIGHT}`]: `2 1 ${UP}`,
        };

  // Generate mirror connections
  const connections = { ...baseAdjacencies };
  for (const [edge1, edge2] of Object.entries(baseAdjacencies)) {
    const [y1, x1, face1] = decodeEdge(edge1);
    const [y2, x2, face2] = decodeEdge(edge2);
    connections[encodeEdge(y2, x2, (face2 + 2) % 4)] = encodeEdge(
      y1,
      x1,
      (face1 + 2) % 4
    );
  }

  return connections;
}

function wrapCoordCube(
  y: number,
  x: number,
  face: Face,
  cubeSize: number,
  connections: { [k: string]: string }
) {
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

function wrapCoord(y: number, x: number, face: Face, map: Map) {
  const isTileEmpty = () => map[y]?.[x] !== " " && map[y]?.[x] !== undefined;

  switch (face) {
    case RIGHT:
      for (x = 0; x < map[y].length; x++) if (isTileEmpty()) return { y, x };
      break;
    case DOWN:
      for (y = 0; y < map.length; y++) if (isTileEmpty()) return { y, x };
      break;
    case LEFT:
      for (x = map[y].length - 1; x >= 0; x--)
        if (isTileEmpty()) return { y, x };
      break;
    case UP:
      for (y = map.length - 1; y >= 0; y--) if (isTileEmpty()) return { y, x };
      break;
  }

  throw new Error(); // Execution should never end here
}

function walk(map: string[][], instructions: Instruction[], wrapCube = false) {
  let y = 0,
    x = map[0].indexOf("."),
    face = 0 as Face;

  const mapWithPath = structuredClone(map);
  // Mark starting position
  mapWithPath[y][x] = faceChar[face];

  let cubeSize, connections;
  if (wrapCube) {
    cubeSize = getCubeSize(map);
    connections = getEdgesAdjacencies(cubeSize);
  }

  for (const movement of instructions) {
    if (typeof movement === "string") {
      if (movement === "R") face++;
      else if (movement === "L") face--;

      if (face === 4) face = 0;
      if (face === -1) face = 3;

      mapWithPath[y][x] = faceChar[face as Face];
      continue;
    }

    for (let i = 0; i < movement; i++) {
      const prevY = y,
        prevX = x,
        prevFace = face;

      y += delta[face].y;
      x += delta[face].x;

      let tile = map[y]?.[x];

      if (tile === " " || tile === undefined) {
        if (wrapCube) {
          ({ y, x, face } = wrapCoordCube(
            prevY,
            prevX,
            prevFace,
            cubeSize as number,
            connections as { [x: string]: string }
          ));
        } else {
          ({ y, x } = wrapCoord(prevY, prevX, prevFace, map));
        }
        tile = map[y][x];
      }

      if (tile === "#") {
        x = prevX;
        y = prevY;
        face = prevFace;
        break;
      }

      mapWithPath[y][x] = faceChar[face];
    }
  }

  const password = 1000 * (y + 1) + 4 * (x + 1) + face;

  return { password, mapWithPath };
}

function solve(
  title: string,
  input: string,
  expectedPart1: number,
  expectedPart2: number
) {
  console.log(`\n~~~ ${title} ~~~\n`);

  const { map, instructions } = parseInput(input);

  let { password, mapWithPath } = walk(map, instructions);
  console.log("Part One:", password);
  if (password !== expectedPart1) console.log("ERROR: expected", expectedPart1);
  if (map.length < 30) printMap(mapWithPath);

  ({ password, mapWithPath } = walk(map, instructions, true));
  console.log("Part Two:", password);
  if (password !== expectedPart2) console.log("ERROR: expected", expectedPart2);
  if (map.length < 30) printMap(mapWithPath);
}

solve("Sample input", Deno.readTextFileSync("input-sample.txt"), 6032, 5031);
solve("Real input", Deno.readTextFileSync("input.txt"), 106094, 162038);
console.log();
