/**
 * Day 10: Cathode-Ray Tube
 * https://adventofcode.com/2022/day/10
 */

let input = await Deno.readTextFile("inputTest.txt");
input = await Deno.readTextFile("input.txt");

const rows = input.split("\n").map((row) => row.split(" "));

let X = 1;
let cycle = 0;

const checkpoints = [20, 60, 100, 140, 180, 220];
let signalStrengthsSum = 0;

const crtWidth = 40;
let crtRow = "";

function startCycle() {
  cycle++;
}

function duringCycle() {
  if (checkpoints.includes(cycle)) {
    signalStrengthsSum += cycle * X;
  }

  const crtX = (cycle - 1) % crtWidth;
  crtRow += crtX >= X - 1 && crtX <= X + 1 ? "#" : ".";
  if (crtRow.length === crtWidth) {
    console.log(crtRow);
    crtRow = "";
  }
}

for (let i = 0; i < rows.length; i++) {
  const [command, valueString] = rows[i];

  if (command === "noop") {
    startCycle();
    duringCycle();
    continue;
  }

  const value = Number(valueString);
  startCycle();
  duringCycle();
  startCycle();
  duringCycle();
  X += value;
}

console.log(signalStrengthsSum);
