/**
 * Day 18: Boiling Boulders
 * https://adventofcode.com/2022/day/18
 */

let input = Deno.readTextFileSync("inputTest.txt");
input = Deno.readTextFileSync("input.txt");

// We will use Set and Map for faster lookups, and those data structures are
// not able to match keys in the form or coords arrays [x, y, z], so we need to
// use a string representation

function toString(x: number, y: number, z: number) {
  return `${x},${y},${z}`;
}

function fromString(cubeString: string) {
  return cubeString.split(",").map(Number);
}

// Parse input

const cubes = new Set<string>();
let minX = Infinity,
  minY = Infinity,
  minZ = Infinity;
let maxX = -1,
  maxY = -1,
  maxZ = -1;
for (const cubeString of input.split("\n")) {
  cubes.add(cubeString);
  const [x, y, z] = fromString(cubeString);
  minX = Math.min(minX, x);
  minY = Math.min(minY, y);
  minZ = Math.min(minZ, z);
  maxX = Math.max(maxX, x);
  maxY = Math.max(maxY, y);
  maxZ = Math.max(maxZ, z);
}

function getSurface(skipInnerSpaces = false) {
  const knownSpaces = new Map<string, boolean>();
  let surface = 0;
  for (const cubeString of cubes) {
    const [x, y, z] = fromString(cubeString);
    // Count all the sides not adjacent to another cube
    if (isSpace(x + 1, y, z, skipInnerSpaces, knownSpaces)) surface++;
    if (isSpace(x - 1, y, z, skipInnerSpaces, knownSpaces)) surface++;
    if (isSpace(x, y + 1, z, skipInnerSpaces, knownSpaces)) surface++;
    if (isSpace(x, y - 1, z, skipInnerSpaces, knownSpaces)) surface++;
    if (isSpace(x, y, z + 1, skipInnerSpaces, knownSpaces)) surface++;
    if (isSpace(x, y, z - 1, skipInnerSpaces, knownSpaces)) surface++;
  }
  return surface;
}

/**
 * Returns true if the coords point at an empty space, false otherwise.
 * If skipInnerSpaces=true the function will return true only for exterior
 * spaces, and false for everything else including spaces trapped between cubes.
 *
 * @param skipInnerSpaces if true, the function returns true only for exterior
 *                        spaces
 * @param knownSpaces     used when skipInnerSpaces=true, cache for the search
 *                        of exterior spaces
 * @param visited         used when skipInnerSpaces=true, list of visited coords
 *                        to avoid the search returning on its previous step and
 *                        create an infinite recursion loop
 */
function isSpace(
  x: number,
  y: number,
  z: number,
  skipInnerSpaces: boolean,
  knownSpaces: Map<string, boolean>,
  visited: Set<string> = new Set<string>()
): boolean {
  // If coords are outside the boundaries they are spaces indeed
  if (x < minX || y < minY || z < minZ) return true;
  if (x > maxX || y > maxY || z > maxZ) return true;

  const cubeString = toString(x, y, z);

  if (!skipInnerSpaces) {
    // When every space counts we can simply check if any cube matches coords
    return !cubes.has(cubeString);
  }

  // If we have to consider only the exterior spaces it's more complex:
  // we start scanning around in every direction until we reach the coords
  // boundaries or we find another space already assessed before.
  // Every space adjacent to an exterior space is itself exterior too, and same
  // is for inner spaces.

  // Skip visited coords and prevent infinite recursions
  if (visited.has(cubeString)) return false;
  if (cubes.has(cubeString)) return false;

  // knownSpaces stores true for exterior spaces, false for interior ones
  const knownSpace = knownSpaces.get(cubeString);
  if (knownSpace !== undefined) return knownSpace;

  visited = new Set<string>([...visited, cubeString]);
  const isOuterSpace =
    isSpace(x + 1, y, z, true, knownSpaces, visited) ||
    isSpace(x - 1, y, z, true, knownSpaces, visited) ||
    isSpace(x, y + 1, z, true, knownSpaces, visited) ||
    isSpace(x, y - 1, z, true, knownSpaces, visited) ||
    isSpace(x, y, z + 1, true, knownSpaces, visited) ||
    isSpace(x, y, z - 1, true, knownSpaces, visited);

  knownSpaces.set(cubeString, isOuterSpace);
  return isOuterSpace;
}

console.log("Part One:", getSurface());
console.log("Part Two:", getSurface(true));
