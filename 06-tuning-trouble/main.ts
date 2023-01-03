/**
 * Day 6: Tuning Trouble
 * https://adventofcode.com/2022/day/6
 */

let input = await Deno.readTextFile("inputTest.txt");
input = await Deno.readTextFile("input.txt");

const rows = input.split("\n");

for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  let list: string[] = [];
  for (let j = 0; j < row.length; j++) {
    if (j >= 4) list.shift();
    list.push(row.charAt(j));
    if (j < 4) continue;
    let bad = false;
    for (let z = 0; z < 4; z++) {
      const matches = list.filter((item) => item === list[z]);
      if (matches.length > 1) bad = true;
    }
    if (!bad) {
      // console.log(j + 1, list);
      break;
    }
  }

  list = [];
  for (let j = 0; j < row.length; j++) {
    if (j >= 14) list.shift();
    list.push(row.charAt(j));
    if (j < 14) continue;
    let bad = false;
    for (let z = 0; z < 14; z++) {
      const matches = list.filter((item) => item === list[z]);
      if (matches.length > 1) bad = true;
    }
    if (!bad) {
      console.log(j + 1, list);
      break;
    }
  }
}
