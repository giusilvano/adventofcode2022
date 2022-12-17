// https://adventofcode.com/2022/day/17

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
  const chamberWidth = 7;
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

    const jet = jets[jetIndex];
    const rock = rocks[rockIndex];

    if (jet === ">") {
      rockX++;
      if (collision()) rockX--;
    } else {
      rockX--;
      if (collision()) rockX++;
    }

    rockY--;
    if (collision()) {
      rockY++;
      for (const coords of rock) {
        let [x, y] = coords;
        x += rockX;
        y += rockY;
        if (!chamber[x]) chamber[x] = [];
        chamber[x][y] = true;
        highestRockY = Math.max(highestRockY, y);
      }
      restingRocks++;

      rockIndex = (rockIndex + 1) % rocks.length;
      rockX = 2;
      rockY = highestRockY + 1 + 3;
    }

    jetIndex = (jetIndex + 1) % jets.length;

    // Check cache

    let cacheKey = jetIndex + "|" + rockIndex + "|";
    for (let y = highestRockY; y >= highestRockY - 8 && y >= 0; y--) {
      for (let x = 0; x < chamberWidth; x++) {
        cacheKey += chamber[x]?.[y] ? "#" : ".";
      }
      cacheKey += "|";
    }

    const prevState = cache.get(cacheKey);
    if (prevState) {
      const restingRocksDiff = restingRocks - prevState.restingRocks;
      const highestRockYDiff = highestRockY - prevState.highestRockY;
      const loops = Math.floor(
        (restingRocksLimit - restingRocks) / restingRocksDiff
      );
      restingRocks += restingRocksDiff * loops;
      rocksFromCache += highestRockYDiff * loops;
    } else {
      cache.set(cacheKey, { restingRocks, highestRockY });
    }
  }

  return rocksFromCache + highestRockY + 1;
}

let input = Deno.readTextFileSync("inputTest.txt");
input = Deno.readTextFileSync("input.txt");
const jets = input.split("");

console.log("Part One:", solve(jets, 2022));
console.log("Part Two:", solve(jets, 1000000000000));
