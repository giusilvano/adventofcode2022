/**
 * Day 23: Unstable Diffusion
 * https://adventofcode.com/2022/day/23
 */

interface Elf {
  row: number;
  col: number;
}

type ElvesMap = Map<string, Elf>;

function key(row: number, col: number) {
  return `${row} ${col}`;
}

function parseInput(input: string) {
  const map = input
    .split("\n")
    .map((row) => row.split("").map((char) => (char === "#" ? 1 : 0)));

  // For faster and easier access elves are stored in a map where the key is a
  // string representing its coordinates and the value is an object containing
  // the raw numberic coords
  const elves = new Map<string, Elf>();

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col]) elves.set(key(row, col), { row, col });
    }
  }
  return elves;
}

function solve(elves: ElvesMap, maxRounds?: number) {
  elves = new Map(elves);

  const directions = ["N", "S", "W", "E"];

  let rounds = 0;
  while (true) {
    const proposals = new Map<string, Elf & { proposerElfsKeys: string[] }>();
    for (const elf of elves.values()) {
      const { row, col } = elf;
      const elfKey = key(row, col);

      // Store the state of surrounding cells in variables so they can be reused
      // below without doing another lookup in the elves map, resulting in a
      // faster execution
      const isNWfree = !elves.has(key(row - 1, col - 1)),
        isNfree = !elves.has(key(row - 1, col)),
        isNEfree = !elves.has(key(row - 1, col + 1)),
        isEfree = !elves.has(key(row, col + 1)),
        isSEfree = !elves.has(key(row + 1, col + 1)),
        isSfree = !elves.has(key(row + 1, col)),
        isSWfree = !elves.has(key(row + 1, col - 1)),
        isWfree = !elves.has(key(row, col - 1));

      if (
        isNWfree &&
        isNfree &&
        isNEfree &&
        isEfree &&
        isSEfree &&
        isSfree &&
        isSWfree &&
        isWfree
      )
        continue;

      function addProposal(row: number, col: number) {
        const proposalKey = key(row, col);
        const proposal = proposals.get(proposalKey) || {
          row,
          col,
          proposerElfsKeys: [],
        };
        proposal.proposerElfsKeys.push(elfKey);
        proposals.set(proposalKey, proposal);
      }

      for (const direction of directions) {
        if (direction === "N" && isNWfree && isNfree && isNEfree) {
          addProposal(row - 1, col);
          break;
        }
        if (direction === "S" && isSWfree && isSfree && isSEfree) {
          addProposal(row + 1, col);
          break;
        }
        if (direction === "W" && isNWfree && isWfree && isSWfree) {
          addProposal(row, col - 1);
          break;
        }
        if (direction === "E" && isNEfree && isEfree && isSEfree) {
          addProposal(row, col + 1);
          break;
        }
      }
    }

    let movedElfs = 0;
    for (const proposal of proposals.values()) {
      const { row, col, proposerElfsKeys } = proposal;
      if (proposerElfsKeys.length > 1) continue;
      elves.delete(proposerElfsKeys[0]);
      elves.set(key(row, col), { row, col });
      movedElfs++;
    }

    // Update processing order of directions
    directions.push(directions.shift()!);

    rounds++;

    // print(elves);

    if (movedElfs === 0) break;
    if (rounds === maxRounds) break;
  }

  return { elves, rounds };
}

function getElfsBoundingRect(elves: ElvesMap) {
  let startRow = Infinity,
    startCol = Infinity,
    endRow = -Infinity,
    endCol = -Infinity;
  for (const elf of elves.values()) {
    startCol = Math.min(startCol, elf.col);
    startRow = Math.min(startRow, elf.row);
    endCol = Math.max(endCol, elf.col);
    endRow = Math.max(endRow, elf.row);
  }
  return { startRow, startCol, endRow, endCol };
}

function countEmptyTiles(elves: ElvesMap) {
  const { startRow, startCol, endRow, endCol } = getElfsBoundingRect(elves);

  let count = 0;
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      if (!elves.has(key(row, col))) count++;
    }
  }

  return count;
}

function print(elves: ElvesMap) {
  const { startRow, startCol, endRow, endCol } = getElfsBoundingRect(elves);

  let str = "";
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      str += elves.has(key(row, col)) ? "#" : ".";
    }
    str += "\n";
  }

  console.log(str);
}

function run(
  title: string,
  input: string,
  expectedPart1: number,
  expectedPart2: number
) {
  console.log(`\n~~~ ${title} ~~~\n`);

  const parsedInput = parseInput(input);

  let { elves } = solve(parsedInput, 10);
  const part1 = countEmptyTiles(elves);
  console.log("Part One:", part1);
  if (part1 !== expectedPart1) console.error("ERROR: expected", expectedPart1);
  if (title.startsWith("Sample")) {
    console.log();
    print(elves);
  }

  let rounds;
  ({ elves, rounds } = solve(parsedInput));
  console.log("Part Two:", rounds);
  if (rounds !== expectedPart2) console.log("ERROR: expected", expectedPart2);
  if (title.startsWith("Sample")) {
    console.log();
    print(elves);
  }
}

run("Sample input", Deno.readTextFileSync("input-sample.txt"), 110, 20);
run("Real input", Deno.readTextFileSync("input.txt"), 3970, 923);
console.log();
