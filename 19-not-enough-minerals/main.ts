/**
 * Day 19: Not Enough Minerals
 * https://adventofcode.com/2022/day/19
 */

// Soluzione part1: 1719
// Soluzione part2: 19530

let input = Deno.readTextFileSync("inputTest.txt");
input = Deno.readTextFileSync("input.txt");

// Parse input

const blueprints = input.split("\n").map((row) => {
  const re =
    /Blueprint \d+: Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./;
  const matches = re.exec(row);
  if (!matches) throw new Error("Bad input");
  const blueprint = {
    oreRobot: {
      ore: Number(matches[1]),
    },
    clayRobot: {
      ore: Number(matches[2]),
    },
    obsidianRobot: {
      ore: Number(matches[3]),
      clay: Number(matches[4]),
    },
    geodeRobot: {
      ore: Number(matches[5]),
      obsidian: Number(matches[6]),
    },
    maxOre: 0,
    maxClay: 0,
    maxObsidian: 0,
  };
  blueprint.maxOre = Math.max(
    blueprint.clayRobot.ore,
    blueprint.obsidianRobot.ore,
    blueprint.geodeRobot.ore
  );
  blueprint.maxClay = blueprint.obsidianRobot.clay;
  blueprint.maxObsidian = blueprint.geodeRobot.obsidian;
  return blueprint;
});

const timeLimit = 32;

const startState = {
  time: 1,
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
  rOre: 1,
  rClay: 0,
  rObsidian: 0,
  rGeode: 0,
};

let bestScore = 0;
let bestPath = "";
function solve(
  b: typeof blueprints[0],
  curState = startState,
  minScore = 0,
  ops = ""
): number {
  if (curState.time > timeLimit) {
    // console.log(s.geode, ops);
    if (curState.geode > bestScore) {
      bestScore = curState.geode;
      bestPath = ops;
    }

    return curState.geode;
  }

  const remainingTime = timeLimit - curState.time + 1;
  // if (
  //   s.geode +
  //     s.rGeode * remainingTime +
  //     (remainingTime * (remainingTime - 1)) / 2 ===
  //   7
  // ) {
  //   console.log(ops);
  //   return 0;
  // }
  if (
    curState.geode +
      curState.rGeode * remainingTime +
      (remainingTime * (remainingTime - 1)) / 2 <
    // minScore
    bestScore
  ) {
    // console.log(ops);
    return -1;
  }
  if (curState.geode > bestScore) {
    bestScore = curState.geode;
    bestPath = ops;
  }

  const nextState = { ...curState };

  // Collection phase
  nextState.ore += curState.rOre;
  nextState.clay += curState.rClay;
  nextState.obsidian += curState.rObsidian;
  nextState.geode += curState.rGeode;

  // Prepare to move to next minute
  nextState.time++;

  if (
    curState.time < timeLimit &&
    curState.ore >= b.geodeRobot.ore &&
    curState.obsidian >= b.geodeRobot.obsidian
  ) {
    nextState.ore -= b.geodeRobot.ore;
    nextState.obsidian -= b.geodeRobot.obsidian;
    nextState.rGeode++;
    return solve(b, nextState, minScore, ops + "Ge|");
  } else {
    let maxScore = minScore;
    if (
      curState.time < timeLimit - 2 &&
      curState.rObsidian < b.maxObsidian &&
      curState.ore >= b.obsidianRobot.ore &&
      curState.clay >= b.obsidianRobot.clay //&& s.obsidian + remainingTime > b.geodeRobot.obsidian
    ) {
      const t = { ...nextState };
      t.ore -= b.obsidianRobot.ore;
      t.clay -= b.obsidianRobot.clay;
      t.rObsidian++;
      maxScore = Math.max(maxScore, solve(b, t, maxScore, ops + "Ob|"));
      // outcomes.push(solve(b, t));
    }
    if (
      curState.time < timeLimit - 4 &&
      curState.rClay < b.maxClay &&
      curState.ore >= b.clayRobot.ore //&& s.clay + remainingTime > b.obsidianRobot.clay
    ) {
      const t = { ...nextState };
      t.ore -= b.clayRobot.ore;
      t.rClay++;
      maxScore = Math.max(maxScore, solve(b, t, maxScore, ops + "Cl|"));
      // outcomes.push(solve(b, t, ops + "Cl|"));
    }
    if (
      curState.time < timeLimit - 2 &&
      curState.rOre < b.maxOre &&
      curState.ore >= b.oreRobot.ore //&& s.ore + remainingTime > b.geodeRobot.ore
    ) {
      const t = { ...nextState };
      t.ore -= b.oreRobot.ore;
      t.rOre++;
      maxScore = Math.max(maxScore, solve(b, t, maxScore, ops + "Or|"));
      // outcomes.push(solve(b, t, ops + "Or|"));
    }
    maxScore = Math.max(maxScore, solve(b, nextState, maxScore, ops + "--|"));
    return maxScore;
    // outcomes.push(solve(b, n, ops + "--|"));
    // return Math.max(...outcomes);
  }
}

function hey() {
  let qualityLevelsSum = 0;
  for (let i = 0; i < blueprints.length; i++) {
    bestScore = 0;
    bestPath = "";
    const score = solve(blueprints[i]);
    // console.log("Blueprint", i + 1, score);
    console.log(i + 1, score, bestPath);
    qualityLevelsSum += (i + 1) * score;
    // break;
  }
  return qualityLevelsSum;
}

function hey2() {
  let product = 1;
  for (let i = 0; i < 3; i++) {
    bestScore = 0;
    bestPath = "";
    const score = solve(blueprints[i]);
    // console.log("Blueprint", i + 1, score);
    console.log(i + 1, score, bestPath);
    product *= score;
    // break;
  }
  return product;
}

console.log("Part One:", hey());
console.log("Part Two:", hey2());
