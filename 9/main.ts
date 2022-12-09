// https://adventofcode.com/2022/day/9

let input = await Deno.readTextFile("inputTest.txt");
input = await Deno.readTextFile("input.txt");

const moves = input.split("\n").map((row) => row.split(" "));

const uniquePositions = new Set<string>();

const size = 10;
const x = Array(size).fill(0),
  y = Array(size).fill(0);

uniquePositions.add(`${x[size - 1]}|${y[size - 1]}`);

function snap() {
  let str = "";
  // for (let cy = -21; cy <= 0; cy++) {
  //   for (let cx = 0; cx <= 27; cx++) {
  for (let cy = -4; cy <= 0; cy++) {
    for (let cx = 0; cx <= 5; cx++) {
      let char = ".";
      for (let j = size - 1; j >= 0; j--) {
        if (x[j] === cx && y[j] === cy) char = j.toString();
      }
      str += char;
    }
    str += "\n";
  }
  console.log(str);
  console.log(" ");
}

snap();
for (let row = 0; row < moves.length; row++) {
  const direction = moves[row][0];
  const distance = Number(moves[row][1]);

  console.log("== " + direction + " " + distance);

  for (let i = 0; i < distance; i++) {
    switch (direction) {
      case "R":
        x[0]++;
        break;
      case "D":
        y[0]++;
        break;
      case "L":
        x[0]--;
        break;
      case "U":
        y[0]--;
        break;
    }

    for (let j = 1; j < size; j++) {
      const hx = x[j - 1],
        hy = y[j - 1],
        tx = x[j],
        ty = y[j];

      if (tx === hx) {
        if (hy > ty + 1) {
          y[j]++;
          continue;
        }
        if (hy < ty - 1) {
          y[j]--;
          continue;
        }
      }

      if (ty === hy) {
        if (hx > tx + 1) {
          x[j]++;
          continue;
        }
        if (hx < tx - 1) {
          x[j]--;
          continue;
        }
      }

      const dx = hx - tx;
      const dy = hy - ty;

      if (Math.abs(dx) === 2 || Math.abs(dy) === 2) {
        if (dx > 0) x[j]++;
        else if (dx < 0) x[j]--;

        if (dy > 0) y[j]++;
        else if (dy < 0) y[j]--;
      }

      // if (Math.abs(dx) === 2) {
      //   y[j] = hy;
      //   if (dx > 0) x[j]++;
      //   else x[j]--;
      //   continue;
      // }
      // if (Math.abs(dy) === 2) {
      //   x[j] = hx;
      //   if (dy > 0) y[j]++;
      //   else y[j]--;
      //   continue;
      // }
    }

    console.log(" ");
    snap();

    uniquePositions.add(`${x[size - 1]}|${y[size - 1]}`);
  }

  // snap();
}

console.log(uniquePositions.size);
