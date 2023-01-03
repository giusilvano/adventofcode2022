/**
 * Day 13: Distress Signal
 * https://adventofcode.com/2022/day/13
 */

// First part
let input = await Deno.readTextFile("inputTest.txt");
// input = await Deno.readTextFile("input.txt");

const rows = input.split("\n");
const pairs: any = [];

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

for (let i = 0; i < rows.length; i++) {
  const pair: any = [];
  pair[0] = JSON.parse(rows[i]);
  i++;
  pair[1] = JSON.parse(rows[i]);
  i++;
  pairs.push(pair);

  let left = pair[0];
  let right = pair[1];

  const index = pairs.length;

  const res = cmp(left, right);
  if (res === 1) {
    correct.push(index);
  }
}

console.log(correct);
console.log(correct.reduce((prev, cur) => prev + cur)); // 13
