/**
 * Day 11: Monkey in the Middle
 * https://adventofcode.com/2022/day/11
 */

let input = await Deno.readTextFile("inputTest.txt");
input = await Deno.readTextFile("input.txt");

const rows = input.split("\n");

const monkeys: any[] = [];

let curMonkey = 0;
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];

  if (row.startsWith("Monkey ")) {
    curMonkey = Number(row.slice(7, -1));
    monkeys[curMonkey] = { inspections: 0 };
    continue;
  }

  if (row.startsWith("  Starting items: ")) {
    monkeys[curMonkey].items = row.slice(18).split(", ").map(Number);
    continue;
  }

  if (row.startsWith("  Operation: ")) {
    monkeys[curMonkey].operation = row.slice(22);
    continue;
  }

  if (row.startsWith("  Test: ")) {
    monkeys[curMonkey].testDivisibleBy = Number(row.slice(21));
    continue;
  }

  if (row.trim().startsWith("If true:")) {
    monkeys[curMonkey].ifTrueThrowAt = Number(row.slice(29));
    continue;
  }

  if (row.trim().startsWith("If false:")) {
    monkeys[curMonkey].ifFalseThrowAt = Number(row.slice(30));
    continue;
  }
}
console.log(monkeys);
for (let round = 0; round < 10000; round++) {
  for (let i = 0; i < monkeys.length; i++) {
    if (i === 2) {
      // debugger;
    }
    const monkey = monkeys[i];
    while (monkey.items.length) {
      const old = monkey.items.shift();
      monkey.inspections++;
      let newWorry = 0;
      eval(`newWorry = old ${monkey.operation}`);
      // newWorry = Math.floor(newWorry / 3);
      // Find LCM
      // newWorry = newWorry % 96577;
      newWorry = newWorry % 9699690;
      const monkeyThrown =
        newWorry % monkey.testDivisibleBy === 0
          ? monkey.ifTrueThrowAt
          : monkey.ifFalseThrowAt;
      monkeys[monkeyThrown].items.push(newWorry);
    }
  }

  if (
    [
      1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
    ].includes(round + 1)
  )
    console.log(
      round + 1,
      monkeys.map((m) => m.inspections)
    );
}

const inspections = monkeys
  .map((monkey) => monkey.inspections)
  .sort((a, b) => b - a);
console.log(inspections);
console.log(inspections[0] * inspections[1]);
