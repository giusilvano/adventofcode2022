const input = await Deno.readTextFile("input.txt");

const rows = input.split("\n");

let part1 = 0;
let part2 = 0;

let elfs: number[] = [0];
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  if (row === "") {
    elfs.unshift(0);
    continue;
  } else {
    elfs[0] += Number(row);
  }
}

console.log(Math.max(...elfs));
elfs = elfs.sort((a, b) => b - a);
console.log(elfs[0] + elfs[1] + elfs[2]);
