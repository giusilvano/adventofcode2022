/**
 * Day 24: Blizzard Basin
 * https://adventofcode.com/2022/day/24
 */

const RIGHT = ">",
  DOWN = "v",
  LEFT = "<",
  UP = "^",
  WAIT = "W";

type Direction = typeof RIGHT | typeof DOWN | typeof LEFT | typeof UP;

interface Position {
  x: number;
  y: number;
}

const steps = {
  [RIGHT]: { x: 1, y: 0 },
  [DOWN]: { x: 0, y: 1 },
  [LEFT]: { x: -1, y: 0 },
  [UP]: { x: 0, y: -1 },
  [WAIT]: { x: 0, y: 0 },
};

const charss: any = {
  [RIGHT]: ">",
  [LEFT]: "<",
  [UP]: "^",
  [DOWN]: "v",
};

interface ParsedInput {
  width: number;
  height: number;
  blizzardsMaps: { [key in Direction]: boolean[][] };
}

function parseInput(input: string): ParsedInput {
  input = input.trim();
  const map = input
    .split("\n")
    .map((row) => row.substring(1, row.length - 1).split(""));
  map.shift();
  map.pop();

  const width = map[0].length;
  const height = map.length;

  const blizzardsMaps: ParsedInput["blizzardsMaps"] = {
    [DOWN]: [],
    [RIGHT]: [],
    [LEFT]: [],
    [UP]: [],
  };
  for (let y = 0; y < height; y++) {
    blizzardsMaps[DOWN][y] = [];
    blizzardsMaps[RIGHT][y] = [];
    blizzardsMaps[LEFT][y] = [];
    blizzardsMaps[UP][y] = [];
    for (let x = 0; x < width; x++) {
      const char = map[y][x];
      if (char !== ".") blizzardsMaps[char as Direction][y][x] = true;
    }
  }

  return { width, height, blizzardsMaps };
}

function getStateKey(x: number, y: number, time: number) {
  return `${x} ${y} ${time}`;
}

function solve(
  input: ParsedInput,
  start: Position,
  end: Position,
  time: number
) {
  const { width, height, blizzardsMaps } = input;
  let shortestTimeToEnd = Infinity;
  let shortestMovesToEnd;

  const queue = [{ ...start, time, moves: "" }];
  const visited = new Set<string>([getStateKey(start.x, start.y, time)]);

  function wrapIndex(i: number, length: number) {
    i %= length;
    if (i < 0) i = length + i;
    return i;
  }

  while (queue.length) {
    const prevState = queue.shift()!;

    if (
      prevState.time +
        Math.abs(end.x - prevState.x) +
        Math.abs(end.y - prevState.y) >
      shortestTimeToEnd
    )
      continue;

    const time = prevState.time + 1;

    for (const [direction, move] of Object.entries(steps)) {
      const x = prevState.x + move.x;
      const y = prevState.y + move.y;
      const moves = prevState.moves + direction;
      const state = { x, y, time, moves };
      const stateKey = getStateKey(x, y, time);

      if (x === end.x && y === end.y) {
        if (time < shortestTimeToEnd) {
          shortestTimeToEnd = time;
          shortestMovesToEnd = moves;
        }
        continue;
      }

      if (x === start.x && y === start.y) {
        if (!visited.has(stateKey)) {
          queue.push(state);
          visited.add(stateKey);
        }
        continue;
      }

      if (x < 0 || y < 0) continue;
      if (x >= width || y >= height) continue;

      let avoidsBlizzards = true;
      for (const blizDirection in blizzardsMaps) {
        let { x: blizX, y: blizY } = steps[blizDirection as Direction];
        blizX = wrapIndex(blizX * -1 * time + x, width);
        blizY = wrapIndex(blizY * -1 * time + y, height);
        if (blizzardsMaps[blizDirection as Direction][blizY][blizX]) {
          avoidsBlizzards = false;
          break;
        }
      }
      if (!avoidsBlizzards) continue;

      if (visited.has(stateKey)) continue;

      queue.push(state);
      visited.add(stateKey);
    }
  }

  function print(time: number) {
    let str = "#";
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const chars: string[] = [];
        for (const blizDirection in blizzardsMaps) {
          let { x: blizX, y: blizY } = steps[blizDirection as Direction];
          blizX = wrapIndex(blizX * -1 * time + x, width);
          blizY = wrapIndex(blizY * -1 * time + y, height);
          if (blizzardsMaps[blizDirection as Direction][blizY][blizX])
            chars.push(charss[blizDirection]);
        }
        if (chars.length === 0) str += ".";
        else if (chars.length === 1) str += chars[0];
        else str += chars.length;
      }
      str += "#\n#";
    }
    console.log(str);
    return str;
  }

  console.log(shortestMovesToEnd);
  return shortestTimeToEnd;
}

let input = Deno.readTextFileSync("inputTest.txt").trim();
input = Deno.readTextFileSync("input.txt").trim();

const data = parseInput(input);

const start = { x: 0, y: -1 };
const end = { x: data.width - 1, y: data.height };

const startToEndTime = solve(data, start, end, 0);

console.log("Part One:", startToEndTime); // 18, 288

const backToStartTime = solve(data, end, start, startToEndTime);

const backToEndTime = solve(data, start, end, backToStartTime);

console.log("Part Two:", backToEndTime); // 54, 861
