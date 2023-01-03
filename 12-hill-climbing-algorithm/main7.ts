/**
 * Day 12: Hill Climbing Algorithm
 * https://adventofcode.com/2022/day/12
 */

let input = await Deno.readTextFile("inputTest.txt");
input = await Deno.readTextFile("input.txt");

let curX = 0,
  curY = 0;
let endX = 0,
  endY = 0;

const map = input.split("\n").map((row, i) =>
  row.split("").map((c, j) => {
    if (c === "S") {
      curX = j;
      curY = i;
    }
    if (c === "E") {
      endX = j;
      endY = i;
    }
    return c;
  })
);

const lowestCostNode = (costs: any, processed: any) => {
  return Object.keys(costs).reduce((lowest: any, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!processed.includes(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
};

// function that returns the minimum cost and path to reach Finish
const dijkstra = (graph: { [key: string]: { [key: string]: number } }) => {
  // track lowest cost to reach each node
  const costs = Object.assign({ finish: Infinity }, graph.start);

  // track paths
  const parents: { [key: string]: string | null } = { finish: null };
  for (let child in graph.start) {
    parents[child] = "start";
  }

  // track nodes that have already been processed
  const processed: any = [];

  let node = lowestCostNode(costs, processed);

  while (node) {
    // console.log(node);
    let cost = costs[node];
    let children = graph[node];
    for (let n in children) {
      let newCost = cost + children[n];
      if (!costs[n]) {
        costs[n] = newCost;
        parents[n] = node;
      }
      if (costs[n] > newCost) {
        costs[n] = newCost;
        parents[n] = node;
      }
    }
    processed.push(node);
    node = lowestCostNode(costs, processed);
  }

  // let optimalPath = ["finish"];
  // let parent = parents.finish;
  // while (parent) {
  //   optimalPath.push(parent);
  //   parent = parents[parent];
  // }
  // optimalPath.reverse();

  const results = {
    distance: costs.finish,
    // path: optimalPath,
  };

  return results;
};

function height(char: String) {
  if (char === "S") return 0;
  if (char === "E") return 25;
  return char.charCodeAt(0) - 97;
}

const conn: any = { start: {} };

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    let newX = x,
      newY = y;
    // console.log(x, y);
    const curHeight = height(map[y][x]);

    if (curHeight === 0) {
      conn["start"][label(x, y)] = 0.1;
    }

    const connections: any = {};

    function label(x: number, y: number) {
      // if (x === curX && y === curY) return "start";
      if (x === endX && y === endY) return "finish";
      return `${x}|${y}`;
    }

    function checkAndAdd() {
      if (
        newX >= 0 &&
        newY >= 0 &&
        newX < map[0].length &&
        newY < map.length &&
        height(map[newY][newX]) <= curHeight + 1
      ) {
        connections[label(newX, newY)] = 1;
      }
    }

    newX = x - 1;
    checkAndAdd();

    newX = x + 1;
    checkAndAdd();

    newX = x;
    newY = y - 1;
    checkAndAdd();

    newY = y + 1;
    checkAndAdd();

    conn[label(x, y)] = connections;
  }
}

// console.log(conn);

console.log(Math.floor(dijkstra(conn).distance)); // second star: 29, 399
