// https://adventofcode.com/2022/day/13

// First part
let input = await Deno.readTextFile("inputTest.txt");
// input = await Deno.readTextFile("input.txt");

let graph: any = {};
const flows: any = {};
let valvesToOpen = 0;
let sumValvesToOpen = 0;

input.split("\n").forEach((row) => {
  const matches =
    /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ([\w, ]+)$/.exec(
      row
    );
  if (!matches) throw new Error();
  const key = matches[1];
  const flow = Number(matches[2]);
  if (flow) {
    flows[key] = flow;
    valvesToOpen++;
    sumValvesToOpen += flow;
  }
  graph[key] = Object.fromEntries(
    matches[3].split(", ").map((valve) => [valve, 1])
  );
});
console.log(graph);

function floydWarshall(graph: any) {
  graph = structuredClone(graph);
  const keys = Object.keys(graph);
  for (const i of keys) {
    for (const j of keys) {
      if (i === j) graph[i][j] = 0;
      else if (graph[i][j] === undefined) graph[i][j] = Infinity;
    }
  }
  for (const k of keys) {
    for (const i of keys) {
      for (const j of keys) {
        if (graph[i][j] > graph[i][k] + graph[k][j])
          graph[i][j] = graph[i][k] + graph[k][j];
      }
    }
  }
  return graph;
}

graph = floydWarshall(graph);
// console.log(graph);

function walk(
  valve: string,
  remainingTime: number,
  flows: { [key: string]: number }
): number {
  const vals = [];
  for (const [key, val] of Object.entries(flows)) {
    const distance = graph[valve][key];

    if (distance >= remainingTime) continue;

    const newFlows = structuredClone(flows);
    delete newFlows[key];

    let flow = val * (remainingTime - distance - 1);

    if (Object.keys(newFlows).length)
      flow += walk(key, remainingTime - distance - 1, newFlows);

    vals.push(flow);
  }

  return Math.max(0, ...vals);
}
console.log(walk("AA", 30, flows));
