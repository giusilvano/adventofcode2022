const input = await Deno.readTextFile("input.txt");
const rows = input.split("\n");

const stacks9000: string[][] = [];

let rowIndex = 0;
while (true) {
  const curRow = rows[rowIndex];
  if (curRow.charAt(1) === "1") break;
  for (let index = 0, col = 1; col < curRow.length; index++, col += 4) {
    const char = curRow.charAt(col);
    if (char === " ") continue;

    if (!stacks9000[index]) stacks9000[index] = [];
    stacks9000[index].push(char);
  }

  rowIndex++;
}

const stacks9001 = stacks9000.map((stack) => [...stack]);

rowIndex++;
rowIndex++;

for (; rowIndex < rows.length; rowIndex++) {
  const curRow = rows[rowIndex];
  const matches = /move (\d+) from (\d+) to (\d+)/.exec(curRow);
  if (!matches) throw new Error();
  const amount = Number(matches[1]);
  const from = Number(matches[2]) - 1;
  const to = Number(matches[3]) - 1;

  for (let count = 0; count < amount; count++) {
    const elem = stacks9000[from].shift();
    stacks9000[to].unshift(elem!);
  }

  const crates: string[] = [];
  for (let count = 0; count < amount; count++) {
    crates.push(stacks9001[from].shift()!);
  }
  stacks9001[to].unshift(...crates);
}

const answer1 = stacks9000.reduce((prev, stack) => prev + stack[0], ""); // TWSGQHNHL
const answer2 = stacks9001.reduce((prev, stack) => prev + stack[0], ""); // JNRSCDWPP

console.log(answer1, answer2);
