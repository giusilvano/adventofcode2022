// https://adventofcode.com/2022/day/13

// First part
let input = await Deno.readTextFile("inputTest.txt");
// input = await Deno.readTextFile("input.txt");

const map: any = {};
let valvesToOpen = 0;
let sumValvesToOpen = 0;

input.split("\n").forEach((row) => {
  const matches =
    /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ([\w, ]+)$/.exec(
      row
    );
  if (!matches) throw new Error();
  const flow = Number(matches[2]);
  if (flow) {
    valvesToOpen++;
    sumValvesToOpen += flow;
  }
  map[matches[1]] = {
    flow,
    valves: matches[3].split(", "),
  };
});
console.log(map);

let maxFlow = 0;

async function walk(
  prevValve: string | null,
  valve: string,
  remainingTime: number,
  curFlow: number,
  opened: any,
  path: string
) {
  // await new Promise((r) => setTimeout(r, 1000));
  // console.log(valve, remainingTime);
  if (remainingTime <= 1) return;
  path += valve + "|";
  for (const nextValve of map[valve].valves) {
    if (nextValve === prevValve) continue;
    await walk(valve, nextValve, remainingTime - 1, curFlow, opened, path);
  }
  if (opened[valve] || map[valve].flow === 0) return;
  remainingTime--;
  curFlow += map[valve].flow * remainingTime;
  path += "++|";
  if (curFlow > maxFlow) {
    maxFlow = curFlow;
    console.log(maxFlow, path);
    if (path === "AA|DD|++|CC|BB|++|AA|II|JJ|++|") {
      console.log("gotcha");
    }
  }
  opened = {
    ...opened,
    [valve]: 1,
    valvesToOpen: opened.valvesToOpen - 1,
  };
  if (opened.valvesToOpen === 0) return;
  if (remainingTime <= 1) return;
  for (const nextValve of map[valve].valves) {
    // if (nextValve === prevValve) continue;
    await walk(null, nextValve, remainingTime - 1, curFlow, opened, path);
  }
}
await walk(null, "AA", 30, 0, { valvesToOpen, sumValvesToOpen }, "");

console.log(">>>", maxFlow);

const c = {
  AA: { flow: 0, valves: ["DD", "II", "BB"] },
  BB: { flow: 13, valves: ["CC", "AA"] },
  CC: { flow: 2, valves: ["DD", "BB"] },
  DD: { flow: 20, valves: ["CC", "AA", "EE"] },
  EE: { flow: 3, valves: ["FF", "DD"] },
  FF: { flow: 0, valves: ["EE", "GG"] },
  GG: { flow: 0, valves: ["FF", "HH"] },
  HH: { flow: 22, valves: ["GG"] },
  II: { flow: 0, valves: ["AA", "JJ"] },
  JJ: { flow: 21, valves: ["II"] },
};
