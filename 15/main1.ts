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

const maxPos = 4000000;

for (let xx = 0; xx <= maxPos; xx++) {
  for (let yy = 0; yy <= maxPos; yy++) {
    map[key(xx, yy)] = ".";
  }
}
console.log("done");

function cdist(x: number, y: number, x1: number, y1: number) {
  return Math.abs(x - x1) + Math.abs(y - y1);
}

const rowAug = rows.map((row) => {
  const [x, y, x1, y1] = row!.map(Number);
  const dist = cdist(x, y, x1, y1);
  return [x, y, dist];
});

// for (const row of rows) {
//   const [x, y, x1, y1] = row!.map(Number);
//   if (!map[x]) map[x] = [];
//   if (!map[x1]) map[x1] = [];
//   map[key(x, y)] = "S";
//   map[key(x1, y1)] = "B";
//   const dist = Math.abs(x - x1) + Math.abs(y - y1);
//   // console.log(dist);

//   // const minX = x - dist,
//   //   maxX = x + dist,
//   //   minY = y - dist,
//   //   maxY = y + dist;
//   // for (let xx = minX; xx < maxX; xx++) {
//   //   for (let yy = minY; yy < maxY; yy++) {
//   //     const ddist = Math.abs(x - xx) + Math.abs(y - yy);
//   //     if (ddist <= dist && !map[key(xx, yy)]) {
//   //       map[key(xx, yy)] = "#";
//   //     }
//   //   }
//   // }
//   let minX = x - dist,
//     maxX = x + dist,
//     minY = y - dist,
//     maxY = y + dist;

//   if (minX < 0) minX = 0;
//   if (maxX > 0) maxX = maxPos;
//   if (minY < 0) minY = 0;
//   if (maxY > 0) maxY = maxPos;
//   for (let xx = minX; xx <= maxX; xx++) {
//     for (let yy = minY; yy <= maxY; yy++) {
//       const ddist = Math.abs(x - xx) + Math.abs(y - yy);
//       if (ddist <= dist && map[key(xx, yy)] === ".") {
//         // map[key(xx, yy)] = "#";
//         delete map[key(xx, yy)];
//       }
//     }
//   }
//   // break;
// }
// // snap();

for (let yy = 0; yy <= maxPos; yy++) {}

const [xx, yy] = Object.entries(map)
  .filter(([key, val]) => val === ".")[0][0]
  .split("|")
  .map(Number);

console.log(xx * 4000000 + yy);

// console.log(pos.size);
