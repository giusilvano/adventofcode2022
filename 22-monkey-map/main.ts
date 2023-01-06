/**
 * Day 22: Monkey Map
 * https://adventofcode.com/2022/day/22
 */

type Map = string[][];
type Instruction = number | "R" | "L";
type EdgesConnections = { [k: string]: string };

enum Face {
  RIGHT = 0,
  DOWN = 1,
  LEFT = 2,
  UP = 3,
}

const faceChar = {
  [Face.RIGHT]: ">",
  [Face.DOWN]: "v",
  [Face.LEFT]: "<",
  [Face.UP]: "^",
};

const delta = {
  [Face.RIGHT]: { x: 1, y: 0 },
  [Face.DOWN]: { x: 0, y: 1 },
  [Face.LEFT]: { x: -1, y: 0 },
  [Face.UP]: { x: 0, y: -1 },
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
  // Every map must contain all the 6 facets of the cube.
  // If we divide by 6 the number of non-empty tiles we obtain the area of one
  // facet, then we can get the side using the square root.

  let nonEmptyTiles = 0;
  for (const row of map) {
    for (const tile of row) {
      if (tile !== " " && tile !== undefined) nonEmptyTiles++;
    }
  }
  return Math.sqrt(nonEmptyTiles / 6);
}

function decodeEdge(string: string) {
  return string.split(" ").map(Number) as [number, number, Face];
}

function encodeEdge(facetY: number, facetX: number, face: number) {
  return [facetY, facetX, face].join(" ");
}

function getEdgesConnections(cubeSize: number): EdgesConnections {
  // Edges connections are now hardcoded for my specific inputs.
  // TODO: find edges programmatically for any input

  // The facets coords are relative to the input map, not to the real cube.
  // Input map is divided by "squares" using the size of the cube, so the facet
  // at "0 2" is the the 3rd square of the 1st row (0 based indexes).
  // So for example `0 2 RIGHT`: `2 3 LEFT` means that when we exit the facet
  // at row=0,col=2 facing RIGHT we end up in the facet row=2,col=3 facing LEFT.

  const baseConnections =
    cubeSize === 4
      ? {
          [`0 2 ${Face.RIGHT}`]: `2 3 ${Face.LEFT}`,
          [`0 2 ${Face.LEFT}`]: `1 1 ${Face.DOWN}`,
          [`0 2 ${Face.UP}`]: `1 0 ${Face.DOWN}`,
          [`1 0 ${Face.DOWN}`]: `2 2 ${Face.UP}`,
          [`1 0 ${Face.LEFT}`]: `2 3 ${Face.UP}`,
          [`1 1 ${Face.DOWN}`]: `2 2 ${Face.RIGHT}`,
          [`1 2 ${Face.RIGHT}`]: `2 3 ${Face.DOWN}`,
        }
      : {
          [`0 1 ${Face.LEFT}`]: `2 0 ${Face.RIGHT}`,
          [`0 1 ${Face.UP}`]: `3 0 ${Face.RIGHT}`,
          [`0 2 ${Face.RIGHT}`]: `2 1 ${Face.LEFT}`,
          [`0 2 ${Face.DOWN}`]: `1 1 ${Face.LEFT}`,
          [`0 2 ${Face.UP}`]: `3 0 ${Face.UP}`,
          [`1 1 ${Face.LEFT}`]: `2 0 ${Face.DOWN}`,
          [`3 0 ${Face.RIGHT}`]: `2 1 ${Face.UP}`,
        };

  // Generate mirror connections
  const connections = { ...baseConnections };
  for (const [edge1, edge2] of Object.entries(baseConnections)) {
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
  edgesConnections: EdgesConnections
) {
  const facetY = Math.floor(y / cubeSize),
    facetX = Math.floor(x / cubeSize);

  const sourceEdgeString = encodeEdge(facetY, facetX, face);
  const targetEdgeString = edgesConnections[sourceEdgeString];

  const [newFacetY, newFacetX, newFace] = decodeEdge(targetEdgeString);

  // Increment the coords normally as we were in 2d space
  y += delta[face].y;
  x += delta[face].x;
  // Convert the coords to be relative to just a facet, not the entire map
  y %= cubeSize;
  x %= cubeSize;
  if (y < 0) y = cubeSize + y;
  if (x < 0) x = cubeSize + x;

  // Rotate coords clockwise until the face matches the new one
  while (face !== newFace) {
    const tmpY = y;
    y = x;
    x = cubeSize - 1 - tmpY;
    face++;
    face %= 4;
  }

  // Transfer the rotated coords to the right facet on the map
  y += newFacetY * cubeSize;
  x += newFacetX * cubeSize;

  return { y, x, face };
}

function wrapCoord(y: number, x: number, face: Face, map: Map) {
  const isTileEmpty = () => map[y]?.[x] !== " " && map[y]?.[x] !== undefined;

  switch (face) {
    case Face.RIGHT:
      for (x = 0; x < map[y].length; x++) if (isTileEmpty()) return { y, x };
      break;
    case Face.DOWN:
      for (y = 0; y < map.length; y++) if (isTileEmpty()) return { y, x };
      break;
    case Face.LEFT:
      for (x = map[y].length - 1; x >= 0; x--)
        if (isTileEmpty()) return { y, x };
      break;
    case Face.UP:
      for (y = map.length - 1; y >= 0; y--) if (isTileEmpty()) return { y, x };
      break;
  }

  throw new Error(); // Execution should never end here
}

function walk(map: string[][], instructions: Instruction[], wrapCube = false) {
  let y = 0,
    x = map[0].indexOf("."),
    face = Face.RIGHT;

  const mapWithPath = structuredClone(map);
  // Mark starting position
  mapWithPath[y][x] = faceChar[face];

  let cubeSize: number, edgesConnections: EdgesConnections;
  if (wrapCube) {
    cubeSize = getCubeSize(map);
    edgesConnections = getEdgesConnections(cubeSize);
  }

  for (const movement of instructions) {
    if (typeof movement === "string") {
      if (movement === "R") face++;
      else if (movement === "L") face--;

      if ((face as number) === 4) face = 0;
      if ((face as number) === -1) face = 3;

      mapWithPath[y][x] = faceChar[face];
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
            cubeSize!,
            edgesConnections!
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
