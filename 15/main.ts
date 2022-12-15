// https://adventofcode.com/2022/day/13

// First part
let input = await Deno.readTextFile("inputTest.txt");
input = await Deno.readTextFile("input.txt");

const rows = input
  .split("\n")
  .map((row) =>
    /x=([-\d]+), y=([-\d]+)\D+x=([-\d]+), y=([-\d]+)/.exec(row)?.splice(1)
  );
// console.log(rows);

const map: any = {};

function key(x: number, y: number) {
  return `${x}|${y}`;
}
function snap() {
  let out = "";
  const width = 27;
  const height = 24;

  const stX = -2;
  let x = -2,
    y = -2;
  const maxX = 25,
    maxY = 22;
  while (y <= maxY) {
    let line = y + " ";
    while (x <= maxX) {
      line += map[key(x, y)] || ".";
      x++;
    }
    out += line + "\n";
    x = stX;
    y++;
  }
  console.log(out);
}

const pos = new Set<string>();

for (const row of rows) {
  const [x, y, x1, y1] = row!.map(Number);
  if (!map[x]) map[x] = [];
  if (!map[x1]) map[x1] = [];
  map[key(x, y)] = "S";
  map[key(x1, y1)] = "B";
  const dist = Math.abs(x - x1) + Math.abs(y - y1);
  // console.log(dist);

  // const minX = x - dist,
  //   maxX = x + dist,
  //   minY = y - dist,
  //   maxY = y + dist;
  // for (let xx = minX; xx < maxX; xx++) {
  //   for (let yy = minY; yy < maxY; yy++) {
  //     const ddist = Math.abs(x - xx) + Math.abs(y - yy);
  //     if (ddist <= dist && !map[key(xx, yy)]) {
  //       map[key(xx, yy)] = "#";
  //     }
  //   }
  // }
  const minX = x - dist,
    maxX = x + dist,
    yy = 2000000;
  for (let xx = minX; xx < maxX; xx++) {
    const ddist = Math.abs(x - xx) + Math.abs(y - yy);
    if (ddist <= dist && !map[key(xx, yy)]) {
      pos.add(key(xx, yy));
    }
  }
  // break;
}
snap();

// console.log(
//   Object.entries(map).filter(
//     ([key, val]) => key.endsWith("|2000000") && val === "#"
//   ).length
// );

console.log(pos.size);
