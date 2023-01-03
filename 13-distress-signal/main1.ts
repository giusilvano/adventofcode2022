// https://adventofcode.com/2022/day/13

// First part
let input = await Deno.readTextFile("inputTest.txt");
input = await Deno.readTextFile("input.txt");

const rows = input
  .split("\n")
  .filter((r) => r !== "")
  .map((r) => JSON.parse(r));

rows.push([[2]], [[6]]);
// console.log(rows);

const correct = [];

function cmp(left: any[], right: any[]) {
  if (typeof left !== typeof right) {
    if (typeof left === "number") left = [left];
    if (typeof right === "number") right = [right];
  }

  if (typeof left === "number" && typeof right === "number") {
    if (left < right) return 1;
    if (left > right) return -1;
    return 0;
  }

  if (typeof left === "object" && typeof right === "object") {
    let i = 0;
    while (true) {
      if (i === left.length && i === right.length) {
        return 0;
      }
      if (i === left.length) {
        return 1;
      }
      if (i === right.length) {
        return -1;
      }

      const res = cmp(left[i], right[i]);
      if (res === 1) return 1;
      if (res === -1) return -1;
      i++;
    }
  }
}

const placed: any = [rows[0]];

let swapped = false;
do {
  swapped = false;
  for (let i = 0; i < rows.length - 1; i++) {
    const left = rows[i];
    const right = rows[i + 1];
    const res = cmp(left, right);
    if (res !== 1) {
      rows[i] = right;
      rows[i + 1] = left;
      swapped = true;
    }
  }
} while (swapped);

const i1 = rows.findIndex((v) => JSON.stringify(v) === "[[2]]") + 1;
const i2 = rows.findIndex((v) => JSON.stringify(v) === "[[6]]") + 1;

console.log(i1 * i2); // 140, 25800;
// console.log(correct.reduce((prev, cur) => prev + cur)); // 13
