/**
 * Day 20: Grove Positioning System
 * https://adventofcode.com/2022/day/20
 */

let input = Deno.readTextFileSync("inputTest.txt");
input = Deno.readTextFileSync("input.txt");

interface Node {
  value: number;
  prev: Node;
  next: Node;
}

function parseInput(decryptionKey = 1) {
  // decryptionKey is an input of part 2 to be multiplied to the original value,
  // set at 1 nullifies its effect and works for part 1
  let nodeZero: Node | undefined;
  const initialOrder: Node[] = [];

  for (const value of input.split("\n").map(Number)) {
    const node = { value: value * decryptionKey } as Node;

    if (initialOrder.length > 0) {
      node.prev = initialOrder[initialOrder.length - 1];
      initialOrder[initialOrder.length - 1].next = node;
    }
    initialOrder.push(node);

    if (value === 0) nodeZero = node;
  }
  initialOrder[0].prev = initialOrder[initialOrder.length - 1];
  initialOrder[initialOrder.length - 1].next = initialOrder[0];

  if (!nodeZero) throw new Error("Bad input");

  return { nodeZero, initialOrder };
}

function mix(initialOrder: Node[], times = 1) {
  // part 2 requires to mix several consecutive times, for part 1 instead we
  // mix only once
  for (let time = 0; time < times; time++) {
    for (const node of initialOrder) {
      // Detach node from the list
      node.prev.next = node.next;
      node.next.prev = node.prev;

      // Find new positions
      let nodePrev = node.prev,
        nodeNext = node.next;
      for (
        let i = 0;
        i < Math.abs(node.value) % (initialOrder.length - 1);
        i++
      ) {
        if (node.value > 0) {
          nodePrev = nodePrev.next;
          nodeNext = nodeNext.next;
        } else {
          nodePrev = nodePrev.prev;
          nodeNext = nodeNext.prev;
        }
      }

      // Update list links
      nodePrev.next = node;
      node.prev = nodePrev;
      nodeNext.prev = node;
      node.next = nodeNext;
    }
  }
}

function getCoordsSum(nodeZero: Node) {
  // Get the sum of 1000th, 2000th and 3000th value
  let sum = 0;
  let node = nodeZero;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 1000; j++) node = node.next;
    sum += node.value;
  }
  return sum;
}

function part1() {
  const { initialOrder, nodeZero } = parseInput();
  mix(initialOrder);
  return getCoordsSum(nodeZero);
}

function part2() {
  const { initialOrder, nodeZero } = parseInput(811589153);
  mix(initialOrder, 10);
  return getCoordsSum(nodeZero);
}

console.log("Part One:", part1());
console.log("Part Two:", part2());
