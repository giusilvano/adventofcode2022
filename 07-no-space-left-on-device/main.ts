/**
 * Day 7: No Space Left On Device
 * https://adventofcode.com/2022/day/7
 */

let input = await Deno.readTextFile("inputTest.txt");
input = await Deno.readTextFile("input.txt");

const rows = input.split("\n");

interface Item {
  type: "dir" | "file";
  name: string;
  size: number;
  parent: Item | null;
  children: Item[] | null;
}

const root: Item = {
  type: "dir",
  name: "/",
  size: 0,
  parent: null,
  children: [],
};

let curDir = root;
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];

  if (!curDir.children) throw new Error();

  if (row === "$ cd /") {
    curDir = root;
    continue;
  }

  if (row === "$ ls") continue;

  if (row.startsWith("$ cd ")) {
    const name = row.substring(5);
    if (name === "..") {
      if (!curDir.parent) throw new Error();
      curDir = curDir.parent;
    } else {
      curDir = curDir.children.find(
        (item) => item.type === "dir" && item.name === name
      )!;
    }
    continue;
  }

  if (row.startsWith("dir ")) {
    const name = row.substring(4);
    curDir.children.push({
      type: "dir",
      name,
      size: 0,
      parent: curDir,
      children: [],
    });
    continue;
  }

  // Otherwise it's a file
  const [sizeString, name] = row.split(" ");
  const size = Number(sizeString);
  curDir.children.push({
    type: "file",
    name,
    size,
    parent: curDir,
    children: null,
  });
  curDir.size += size;
  let parentDir: Item | null = curDir.parent;
  while (parentDir !== null) {
    parentDir.size += size;
    parentDir = parentDir.parent;
  }
}

function sumSizableDirs(item: Item) {
  let sum = 0;
  if (item.children) {
    for (const child of item.children) {
      if (child.type !== "dir") continue;
      sum += sumSizableDirs(child);
    }
  }
  if (item.size <= 100000) sum += item.size;
  return sum;
}

console.log(sumSizableDirs(root));

const freeSpace = 70000000 - root.size;
const bytesToDelete = 30000000 - freeSpace;

function findDeleteCandidates(item: Item): Item[] {
  const dirs = [];
  if (item.children) {
    for (const child of item.children) {
      if (child.type !== "dir") continue;
      dirs.push(...findDeleteCandidates(child));
    }
  }
  if (item.size >= bytesToDelete) dirs.push(item);
  return dirs;
}

const possibleDirs = findDeleteCandidates(root);
const sizes = possibleDirs.map((dir) => dir.size);

console.log(Math.min(...sizes));
