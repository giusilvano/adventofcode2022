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

const actions = [
  ["move", "move"],
  ["move", "open"],
  ["open", "move"],
  ["open", "open"],
];

async function walk(
  prevValve1: string | null,
  valve1: string,
  prevValve2: string | null,
  valve2: string,
  remainingTime: number,
  curFlow: number,
  opened: any,
  path: string
) {
  if (curFlow > maxFlow) {
    maxFlow = curFlow;
    console.log(maxFlow, path);
  }

  if (opened.valvesToOpen === 0) return;
  if (remainingTime === 0) return;
  if (curFlow + opened.sumValvesToOpen * (remainingTime - 1) < maxFlow) return;

  for (const nextValve1 of map[valve1].valves) {
    if (nextValve1 === prevValve1) continue;
    for (const nextValve2 of map[valve2].valves) {
      if (nextValve2 === prevValve2) continue;
      await walk(
        valve1,
        nextValve1,
        valve2,
        nextValve2,
        remainingTime - 1,
        curFlow,
        opened,
        path + `${nextValve1},${nextValve2}|`
      );
    }
  }

  // Open and move
  if (
    valve1 !== valve2 &&
    !opened[valve1] &&
    map[valve1].flow > 0 &&
    !opened[valve2] &&
    map[valve2].flow > 0
  ) {
    const newFlow =
      curFlow +
      map[valve1].flow * (remainingTime - 1) +
      map[valve2].flow * (remainingTime - 1);
    const newOpened = {
      ...opened,
      [valve1]: 1,
      [valve2]: 1,
      valvesToOpen: opened.valvesToOpen - 2,
      sumValvesToOpen:
        opened.sumValvesToOpen - map[valve1].flow - map[valve2].flow,
    };

    await walk(
      null,
      valve1,
      null,
      valve2,
      remainingTime - 1,
      newFlow,
      newOpened,
      path + "++,++|"
    );
  }

  // Open and move
  if (!opened[valve1] && map[valve1].flow > 0) {
    const newFlow = curFlow + map[valve1].flow * (remainingTime - 1);
    const newOpened = {
      ...opened,
      [valve1]: 1,
      valvesToOpen: opened.valvesToOpen - 1,
      sumValvesToOpen: opened.sumValvesToOpen - map[valve1].flow,
    };
    for (const nextValve2 of map[valve2].valves) {
      await walk(
        null,
        valve1,
        valve2,
        nextValve2,
        remainingTime - 1,
        newFlow,
        newOpened,
        path + `++,${nextValve2}|`
      );
    }
  }

  // Open and move
  if (!opened[valve2] && map[valve2].flow > 0) {
    const newFlow = curFlow + map[valve2].flow * (remainingTime - 1);
    const newOpened = {
      ...opened,
      [valve2]: 1,
      valvesToOpen: opened.valvesToOpen - 1,
      sumValvesToOpen: opened.sumValvesToOpen - map[valve2].flow,
    };
    for (const nextValve1 of map[valve1].valves) {
      await walk(
        valve1,
        nextValve1,
        null,
        valve2,
        remainingTime - 1,
        newFlow,
        newOpened,
        path + `${nextValve1},++|`
      );
    }
  }
}

await walk(
  null,
  "AA",
  null,
  "AA",
  26,
  0,
  { valvesToOpen, sumValvesToOpen },
  ""
);

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
