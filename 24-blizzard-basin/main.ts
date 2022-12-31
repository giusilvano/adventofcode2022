/**
 * Day 24: Blizzard Basin
 * https://adventofcode.com/2022/day/24
 */

enum Move {
  Right = ">",
  Down = "v",
  Left = "<",
  Up = "^",
  Wait = ".",
}

type Blizzard = Exclude<Move, Move.Wait>;

interface Coord {
  row: number;
  col: number;
}

const deltas = {
  [Move.Right]: { col: 1, row: 0 },
  [Move.Down]: { col: 0, row: 1 },
  [Move.Left]: { col: -1, row: 0 },
  [Move.Up]: { col: 0, row: -1 },
  [Move.Wait]: { col: 0, row: 0 },
};

interface Input {
  width: number;
  height: number;
  blizzardsMaps: { [key in Blizzard]: boolean[][] };
}

function parseInput(input: string): Input {
  input = input.trim();
  const map = input
    .split("\n")
    // Remove left and right walls from the input
    .map((row) => row.substring(1, row.length - 1).split(""));
  // Remove first and last row to make processing easier
  map.shift();
  map.pop();

  const width = map[0].length;
  const height = map.length;

  // We save the blizzards in 4 separated maps, one for each direction
  const blizzardsMaps: Input["blizzardsMaps"] = {
    [Move.Down]: [],
    [Move.Right]: [],
    [Move.Left]: [],
    [Move.Up]: [],
  };
  for (let row = 0; row < height; row++) {
    blizzardsMaps[Move.Down][row] = [];
    blizzardsMaps[Move.Right][row] = [];
    blizzardsMaps[Move.Left][row] = [];
    blizzardsMaps[Move.Up][row] = [];
    for (let col = 0; col < width; col++) {
      const char = map[row][col];
      if (char !== ".") blizzardsMaps[char as Blizzard][row][col] = true;
    }
  }

  return { width, height, blizzardsMaps };
}

function getStateKey(row: number, col: number, time: number) {
  return `${col} ${row} ${time}`;
}

// Makes i behave as a circular index: if i=length returns 0, if i=-1 returns
// length-1 and so on
function wrapIndex(i: number, length: number) {
  i %= length;
  if (i < 0) i = length + i;
  return i;
}

// Returns true if there's a blizzard at the coord and time provided.
// Blizzards are checked using the 4 separate blizzards maps and just shifting
// indexes at every time increase. Data in memory is not altered, resulting in
// a much faster computation.
function hasBlizzard(input: Input, row: number, col: number, time: number) {
  const { width, height, blizzardsMaps } = input;
  for (const blizzard in blizzardsMaps) {
    let { row: blizRow, col: blizCol } = deltas[blizzard as Blizzard];
    blizRow = wrapIndex(blizRow * -1 * time + row, height);
    blizCol = wrapIndex(blizCol * -1 * time + col, width);
    if (blizzardsMaps[blizzard as Blizzard][blizRow][blizCol]) return true;
  }
  return false;
}

// Prints a map with the blizzards at the time provided, in the same style of
// the ones in the challenge prompt.
function print(input: Input, time: number) {
  const { width, height, blizzardsMaps } = input;
  let str = "#." + "#".repeat(width) + "\n";
  for (let row = 0; row < height; row++) {
    str += "#";
    for (let col = 0; col < width; col++) {
      const chars: string[] = [];
      for (const blizDirection in blizzardsMaps) {
        let { row: blizRow, col: blizCol } = deltas[blizDirection as Move];
        blizRow = wrapIndex(blizRow * -1 * time + row, height);
        blizCol = wrapIndex(blizCol * -1 * time + col, width);
        if (blizzardsMaps[blizDirection as Blizzard][blizRow][blizCol])
          chars.push(blizDirection);
      }
      if (chars.length === 0) str += ".";
      else if (chars.length === 1) str += chars[0];
      else str += chars.length;
    }
    str += "#\n";
  }
  str += "#".repeat(width) + ".#";

  console.log(str);
  return str;
}

function getShortestPath(input: Input, start: Coord, end: Coord, time: number) {
  const { width, height } = input;

  // BFS over the possible moves

  const queue = [{ ...start, time, moves: "" }];
  const visited = new Set<string>([getStateKey(start.row, start.col, time)]);

  while (queue.length) {
    const prevState = queue.shift()!;

    for (const [direction, delta] of Object.entries(deltas)) {
      const row = prevState.row + delta.row;
      const col = prevState.col + delta.col;
      const time = prevState.time + 1;
      const moves = prevState.moves + direction;
      const state = { row, col, time, moves };
      const stateKey = getStateKey(row, col, time);

      if (row === end.row && col === end.col) {
        // Being in a BFS, as soon as we find a solution it is the shortest path
        return { time, moves };
      }

      // If we are on the starting position we don't need to check blizzards or
      // coordinates validity
      if (!(row === start.row && col === start.col)) {
        if (
          row < 0 ||
          col < 0 ||
          row >= height ||
          col >= width ||
          hasBlizzard(input, row, col, time)
        ) {
          continue;
        }
      }

      if (visited.has(stateKey)) continue;

      queue.push(state);
      visited.add(stateKey);
    }
  }

  throw new Error("No valid path found");
}

let inputString = Deno.readTextFileSync("inputTest.txt").trim();
inputString = Deno.readTextFileSync("input.txt").trim();

const input = parseInput(inputString);

const start = { row: -1, col: 0 };
const end = { row: input.height, col: input.width - 1 };

const { time: startToEndTime, moves: startToEndMoves } = getShortestPath(
  input,
  start,
  end,
  0
);

const { time: backToStartTime, moves: backToStartMoves } = getShortestPath(
  input,
  end,
  start,
  startToEndTime
);

const { time: backToEndTime, moves: backToEndMoves } = getShortestPath(
  input,
  start,
  end,
  backToStartTime
);

console.log("Part One:", startToEndTime); // 18, 288
console.log("Part Two:", backToEndTime, "\n"); // 54, 861

console.log("Start to end moves:", startToEndMoves, "\n");
console.log("Back to start moves:", backToStartMoves, "\n");
console.log("Back to end moves:", backToEndMoves, "\n");
