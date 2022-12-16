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
  elephant: boolean,
  prevValve: string | null,
  valve: string,
  remainingTime: number,
  curFlow: number,
  opened: any,
  path: string
) {
  if (curFlow > maxFlow) {
    maxFlow = curFlow;
    console.log(maxFlow, path);
  }

  if (
    opened.valvesToOpen === 0 ||
    remainingTime === 0 ||
    curFlow + opened.sumValvesToOpen * (remainingTime - 1) < maxFlow
  ) {
    if (!elephant) {
      await walk(true, null, "AA", 26, curFlow, opened, path + " <> ");
    }
    return;
  }

  for (const nextValve of map[valve].valves) {
    if (nextValve === prevValve) continue;
    await walk(
      elephant,
      valve,
      nextValve,
      remainingTime - 1,
      curFlow,
      opened,
      path + `${nextValve}|`
    );
  }

  // Open and move
  if (!opened[valve] && map[valve].flow > 0) {
    for (const nextValve of map[valve].valves) {
      await walk(
        elephant,
        null,
        nextValve,
        remainingTime - 2,
        curFlow + map[valve].flow * (remainingTime - 1),
        {
          ...opened,
          [valve]: 1,
          valvesToOpen: opened.valvesToOpen - 1,
          sumValvesToOpen: opened.sumValvesToOpen - map[valve].flow,
        },
        path + `++|${nextValve}|`
      );
    }
  }
}

await walk(false, null, "AA", 26, 0, { valvesToOpen, sumValvesToOpen }, "");

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
