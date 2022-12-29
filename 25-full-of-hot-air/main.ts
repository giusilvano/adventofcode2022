/**
 * Day 25: Full of Hot Air
 * https://adventofcode.com/2022/day/25
 */

function solve(snafuNumbers: string[]) {
  const map: any = { "2": 2, "1": 1, "0": 0, "-": -1, "=": -2 };
  const map2: any = { 2: "2", 1: "1", 0: "0", [-1]: "-", [-2]: "=" };
  let decimalSum = 0;
  for (const snafu of snafuNumbers) {
    let decimalNumber = 0;
    for (let i = 0; i < snafu.length; i++) {
      const char = snafu[i];
      decimalNumber += map[char] * Math.pow(5, snafu.length - 1 - i);
    }
    console.log(decimalNumber);
    decimalSum += decimalNumber;
  }

  let quotient = decimalSum,
    rest;
  let i = 0;
  const arr: number[] = [];
  while (quotient !== 0) {
    rest = quotient % 5;
    quotient = Math.floor(quotient / 5);
    arr[i] = (arr[i] || 0) + rest;
    if (arr[i] === 3) {
      arr[i] = -2;
      arr[i + 1] = 1;
    } else if (arr[i] === 4) {
      arr[i] = -1;
      arr[i + 1] = 1;
    } else if (arr[i] === 5) {
      arr[i] = 0;
      arr[i + 1] = 1;
    } else if (arr[i] === 6) {
      arr[i] = 1;
      arr[i + 1] = 1;
    } else if (arr[i] === 7) {
      arr[i] = 1;
      arr[i + 1] = 2;
    }
    i++;
  }

  let out = "";
  for (let j = arr.length - 1; j >= 0; j--) out += map2[arr[j]];
  return out;
}

let input = Deno.readTextFileSync("inputTest.txt");
input = Deno.readTextFileSync("input.txt");

console.log("Part One:", solve(input.trim().split("\n")));
// console.log("Part Two:", solve(monkeys, true));
