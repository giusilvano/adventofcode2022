/**
 * Day 25: Full of Hot Air
 * https://adventofcode.com/2022/day/25
 */

const snafuDigitToNumber = { "2": 2, "1": 1, "0": 0, "-": -1, "=": -2 };
const numberToSnafuDigit = Object.fromEntries(
  Object.entries(snafuDigitToNumber).map(([k, v]) => [v, k])
);

function snafuToDecimal(snafuNumber: string) {
  let decimalNumber = 0;
  for (let i = 0; i < snafuNumber.length; i++) {
    const char = snafuNumber[i];
    if (!(char in snafuDigitToNumber)) throw new Error("Invalid digit");
    decimalNumber +=
      snafuDigitToNumber[char as keyof typeof snafuDigitToNumber] *
      Math.pow(5, snafuNumber.length - 1 - i);
  }
  return decimalNumber;
}

function decimalToSnafu(decimalNumber: number) {
  // Start with the normal algorithm to convert a number to a different base:
  // divide the number by the base and the remainder will be the rightmost
  // digit, then in the same way divide the quotient by the base and the
  // remainder will be a new digit, and keep doing this until the quotient is 0.
  // In Snafu, to represent digits higher than 2 we need to increase the next
  // digit by 1 and turn the current digit to the complementary negative value.
  // So for example to do a 3 we increase the next digit by 1 (meaning +5 in
  // decimal) and turn the current one to -2.

  let quotient = decimalNumber,
    remainder;
  // Store digits as they are produced by the algorithm, so the rightmost will
  // be the first, and the leftmost will be the last
  const digits: number[] = [];
  let i = 0;
  while (quotient !== 0) {
    remainder = quotient % 5;
    quotient = Math.floor(quotient / 5);
    // A previous digit conversion may have already set to 1 this digit, ensure
    // to carry over that value in the computation
    digits[i] = remainder + (digits[i] || 0);
    if (digits[i] > 2) {
      digits[i + 1] = 1;
      digits[i] = -5 + digits[i];
    }
    i++;
  }

  let snafuNumber = "";
  for (let j = digits.length - 1; j >= 0; j--) {
    snafuNumber += numberToSnafuDigit[digits[j]];
  }
  return snafuNumber;
}

function solve(snafuNumbers: string[]) {
  let decimalSum = 0;
  for (const snafuNumber of snafuNumbers) {
    decimalSum += snafuToDecimal(snafuNumber);
  }

  const snafuSum = decimalToSnafu(decimalSum);
  return snafuSum;
}

let input = Deno.readTextFileSync("inputTest.txt");
input = Deno.readTextFileSync("input.txt");

const snafuNumbers = input.trim().split("\n");

console.log("Part One:", solve(snafuNumbers));
