// https://adventofcode.com/2022/day/17

const chamberWidth = 7;
const rowsToCache = 8;

/** Rock shapes are a list of [x,y] coords, where [0,0] is the left-bottom
 * pixel of the rock. In both rocks and chamber representations y=0 is the
 * bottom row */
const rocks = [
  [
    // line
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    // cross
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
  ],
  [
    // reversed L
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    // tower
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [
    // square
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
];

function solve(jets: string[], restingRocksLimit: number) {
  const chamber: boolean[][] = [[]];
  let jetIndex = 0;
  let rockIndex = 0;
  let rockX = 2;
  let rockY = 3;
  let restingRocks = 0;
  let highestRockY = -1;
  let rocksFromCache = 0;

  const cache = new Map<
    string,
    { restingRocks: number; highestRockY: number }
  >();

  while (restingRocks < restingRocksLimit) {
    const jet = jets[jetIndex];
    const rock = rocks[rockIndex];

    function collision() {
      for (const coords of rock) {
        let [x, y] = coords;
        x += rockX;
        y += rockY;
        if (x < 0) return true;
        if (x >= chamberWidth) return true;
        if (y < 0) return true;
        if (chamber[x]?.[y]) return true;
      }
    }

    // Try to move the rock left/right according to the jet and if it causes a
    // collision rollback
    if (jet === ">") {
      rockX++;
      if (collision()) rockX--;
    } else {
      rockX--;
      if (collision()) rockX++;
    }

    // As above, try to move the rock one row down, if it causes a collision it
    // means we are touching the other rocks, so the new one descending must
    // become resting
    rockY--;
    if (collision()) {
      // Move the rock up again so it doesn't overlap the others
      rockY++;
      // Save the rock in the chamber map to make it resting
      for (const coords of rock) {
        let [x, y] = coords;
        x += rockX;
        y += rockY;
        if (!chamber[x]) chamber[x] = [];
        chamber[x][y] = true;
        highestRockY = Math.max(highestRockY, y);
      }
      // Rock is resting, increment counter
      restingRocks++;

      // Setup the next rock to start descending
      rockIndex = (rockIndex + 1) % rocks.length;
      rockX = 2;
      rockY = highestRockY + 1 + 3;
    }

    jetIndex = (jetIndex + 1) % jets.length;

    // Use cache to save memory and time in part two.
    // Remember the current jet, the current rock and the 8 highest rows of the
    // chamber.
    let cacheKey = jetIndex + "|" + rockIndex + "|";
    for (let y = highestRockY; y >= highestRockY - rowsToCache && y >= 0; y--) {
      for (let x = 0; x < chamberWidth; x++) {
        cacheKey += chamber[x]?.[y] ? "#" : ".";
      }
      cacheKey += "|";
    }

    const prevState = cache.get(cacheKey);
    if (prevState) {
      // The current state is identical to another state in the past, meaning
      // that we are in a loop and all the rocks are going to land exactly as
      // before to finally reach this state again, and so on. We can then count
      // how many rocks rested and how much height they created since the last
      // time, and repeat the loop until the end, but paying attention to not
      // exceed restingRocksLimit.
      const restingRocksDiff = restingRocks - prevState.restingRocks;
      const highestRockYDiff = highestRockY - prevState.highestRockY;
      const loops = Math.floor(
        (restingRocksLimit - restingRocks) / restingRocksDiff
      );
      restingRocks += restingRocksDiff * loops;
      // We can't increment highestRockYDiff directly, its value would then be
      // not aligned with the contents of the chamber var, breaking the
      // algorithm. We store then the increment in a separate variable.
      rocksFromCache += highestRockYDiff * loops;
    } else {
      cache.set(cacheKey, { restingRocks, highestRockY });
    }
  }

  return rocksFromCache + highestRockY + 1;
}

let input = Deno.readTextFileSync("inputTest.txt");
// input = Deno.readTextFileSync("input.txt");
const jets = input.split("");

console.log("Part One:", solve(jets, 2022));
console.log("Part Two:", solve(jets, 1000000000000));
