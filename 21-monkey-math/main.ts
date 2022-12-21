/**
 * Day 21: Monkey Math
 * https://adventofcode.com/2022/day/21
 */

interface MathMonkey {
  leftName: string;
  rightName: string;
  operation: "+" | "-" | "*" | "/";
}

const ROOT = "root";
const ME = "humn";

function parseInput(input: string) {
  const monkeys = new Map<string, number | MathMonkey>();
  const regExp = /(\w+): ((\d+)|(\w+) (.) (\w+))/;
  for (const row of input.split("\n")) {
    const matches = regExp.exec(row);
    if (!matches) throw new Error("Bad input");
    const name = matches[1];
    let value: number | MathMonkey;
    if (matches[3]) value = Number(matches[3]);
    else {
      const operation = matches[5];
      if (
        operation !== "+" &&
        operation !== "-" &&
        operation !== "*" &&
        operation !== "/"
      ) {
        throw new Error("Bad input");
      }
      value = {
        leftName: matches[4],
        rightName: matches[6],
        operation,
      };
    }
    monkeys.set(name, value);
  }
  return monkeys;
}

function solve(
  monkeys: Map<string, number | MathMonkey>,
  part2 = false,
  monkeyName = ROOT
): number | ((x: number) => number)[] {
  if (part2 && monkeyName === ME) return [];

  const monkey = monkeys.get(monkeyName);
  if (!monkey) throw new Error();
  if (typeof monkey === "number") return monkey;

  const left = solve(monkeys, part2, monkey.leftName);
  const right = solve(monkeys, part2, monkey.rightName);

  const isLeftUnknown = typeof left === "object" && typeof right === "number";
  const isRightUnknown = typeof left === "number" && typeof right === "object";
  const areBothNumbers = typeof left === "number" && typeof right === "number";

  if (part2 && monkeyName === ROOT) {
    let x, operations;
    if (isLeftUnknown) [x, operations] = [right, left];
    else if (isRightUnknown) [x, operations] = [left, right];
    else throw new Error();

    while (operations.length) {
      const operation = operations.shift()!;
      x = operation(x);
    }

    return x;
  }

  switch (monkey.operation) {
    case "+":
      if (isLeftUnknown) return [(x) => x - right, ...left];
      if (isRightUnknown) return [(x) => x - left, ...right];
      if (!areBothNumbers) throw new Error();
      return left + right;
    case "-":
      if (isLeftUnknown) return [(x) => x + right, ...left];
      if (isRightUnknown) return [(x) => left - x, ...right];
      if (!areBothNumbers) throw new Error();
      return left - right;
    case "*":
      if (isLeftUnknown) return [(x) => x / right, ...left];
      if (isRightUnknown) return [(x) => x / left, ...right];
      if (!areBothNumbers) throw new Error();
      return left * right;
    case "/":
      if (isLeftUnknown) return [(x) => x * right, ...left];
      if (isRightUnknown) return [(x) => left / x, ...right];
      if (!areBothNumbers) throw new Error();
      return left / right;
  }
}

let input = Deno.readTextFileSync("inputTest.txt");
input = Deno.readTextFileSync("input.txt");

const monkeys = parseInput(input);

console.log("Part One:", solve(monkeys));
console.log("Part Two:", solve(monkeys, true));
