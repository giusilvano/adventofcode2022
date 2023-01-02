/**
 * Day 23: Unstable Diffusion
 * https://adventofcode.com/2022/day/23
 */

interface Elf {
  row: number;
  col: number;
}

type ElfsMap = Map<string, Elf>;

function key(row: number, col: number) {
  return `${row} ${col}`;
}

function parseInput(input: string) {
  const map = input
    .split("\n")
    .map((row) => row.split("").map((char) => (char === "#" ? 1 : 0)));

  // For faster and easier access elfs are stored in a map where the key is a
  // string representing its coordinates and the value is an object containing
  // the raw numberic coords
  const elfs = new Map<string, Elf>();

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col]) elfs.set(key(row, col), { row, col });
    }
  }
  return elfs;
}

function solve(elfs: ElfsMap, maxRounds?: number) {
  elfs = new Map(elfs);

  const directions = ["N", "S", "W", "E"];

  let rounds = 0;
  while (true) {
    const proposals = new Map<string, Elf & { proposerElfsKeys: string[] }>();
    for (const elf of elfs.values()) {
      const { row, col } = elf;
      const elfKey = key(row, col);

      // Store the state of surrounding cells in variables so they can be reused
      // below without doing another lookup in the elfs map, resulting in a
      // faster execution
      const isNWfree = !elfs.has(key(row - 1, col - 1)),
        isNfree = !elfs.has(key(row - 1, col)),
        isNEfree = !elfs.has(key(row - 1, col + 1)),
        isEfree = !elfs.has(key(row, col + 1)),
        isSEfree = !elfs.has(key(row + 1, col + 1)),
        isSfree = !elfs.has(key(row + 1, col)),
        isSWfree = !elfs.has(key(row + 1, col - 1)),
        isWfree = !elfs.has(key(row, col - 1));

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
      elfs.delete(proposerElfsKeys[0]);
      elfs.set(key(row, col), { row, col });
      movedElfs++;
    }

    // Update processing order of directions
    directions.push(directions.shift()!);

    rounds++;

    // print(elfs);

    if (movedElfs === 0) break;
    if (rounds === maxRounds) break;
  }

  return { elfs, rounds };
}

function getElfsBoundingRect(elfs: ElfsMap) {
  let startRow = Infinity,
    startCol = Infinity,
    endRow = -Infinity,
    endCol = -Infinity;
  for (const elf of elfs.values()) {
    startCol = Math.min(startCol, elf.col);
    startRow = Math.min(startRow, elf.row);
    endCol = Math.max(endCol, elf.col);
    endRow = Math.max(endRow, elf.row);
  }
  return { startRow, startCol, endRow, endCol };
}

function countEmptyTiles(elfs: ElfsMap) {
  const { startRow, startCol, endRow, endCol } = getElfsBoundingRect(elfs);

  let count = 0;
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      if (!elfs.has(key(row, col))) count++;
    }
  }

  return count;
}

function print(elfs: ElfsMap) {
  const { startRow, startCol, endRow, endCol } = getElfsBoundingRect(elfs);

  let str = "";
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      str += elfs.has(key(row, col)) ? "#" : ".";
    }
    str += "\n";
  }

  console.log(str);
}

let inputString = Deno.readTextFileSync("inputTest.txt");
inputString = Deno.readTextFileSync("input.txt");
const input = parseInput(inputString);

// 3970 part1
// 923  part2

const { elfs } = solve(input, 10);
console.log("Part One:", countEmptyTiles(elfs));

const { rounds } = solve(input);
console.log("Part Two:", rounds);
