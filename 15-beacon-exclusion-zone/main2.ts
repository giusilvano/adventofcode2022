class InputParser {
  private lines: string[];
  private linesRead: number = 0;

  constructor(filename: string, private outputname?: string) {
    console.log(`Loading file ${filename} as input`);
    const file = Deno.readTextFileSync(filename);
    console.log(`File loaded!`);
    this.lines = file.split("\n").filter((line) => line);

    if (outputname) {
      console.log(`Output file: ${outputname}`);
      // Clear the file
      // fs.writeFileSync(outputname, "", { flag: "w" });
    }
  }

  public appendOutput(output: string) {
    if (this.outputname) {
      // fs.appendFileSync(this.outputname, output + "\n");
    }
  }

  public next(moveSelector = true): string | null {
    if (this.linesRead >= this.lines.length) {
      return null;
    }
    const line = this.lines[this.linesRead];

    if (moveSelector) this.linesRead++;

    return line.replace("\r", "");
  }

  public nextUntilEmptyLine(): string[] | null {
    const lines: string[] = [];
    let line = this.next();
    while (line !== null && line !== "") {
      lines.push(line);
      line = this.next();
    }
    return lines;
  }

  public nextNumber(): number | null {
    const line = this.next();
    if (line === null) {
      return null;
    }
    return parseInt(line);
  }

  public nextNumberArray(): number[] | null {
    const line = this.next();
    if (line === null) {
      return null;
    }
    return line.split(" ").map(Number);
  }

  public hasNext(): boolean {
    return this.linesRead < this.lines.length;
  }

  public getFullInput(): string {
    return this.lines.join("\n");
  }
}

let filename = "input.txt";
const inputParser = new InputParser(filename);

interface Sensor {
  x: number;
  y: number;
  range: number;
  closestBeacon: {
    x: number;
    y: number;
  };
}

let minX = Infinity;
let maxX = -Infinity;

const sensors: Sensor[] = [];

while (inputParser.hasNext()) {
  const [x, y, xb, yb] =
    inputParser
      .next()
      ?.match(/(-)*\d+/g)
      ?.map(Number) ?? [];

  minX = Math.min(minX, x, xb);
  maxX = Math.max(maxX, x, xb);

  sensors.push({
    x,
    y,
    range: Math.abs(x - xb) + Math.abs(y - yb),
    closestBeacon: {
      x: xb,
      y: yb,
    },
  });
}

let px = 0;
let py = 0;

let n = filename === "test.txt" ? 20 : 4000000;

for (let row = 0; row <= n; row++) {
  let xskips: [number, number][] = [];

  for (const sensor of sensors) {
    let distFromRow = Math.abs(sensor.y - row);
    let deltaX = sensor.range - distFromRow;

    if (deltaX <= 0) continue;

    const sensorSkip: [number, number] = [
      Math.max(sensor.x - deltaX, 0),
      Math.min(sensor.x + deltaX, n),
    ];

    xskips.push(sensorSkip);
  }

  let start = 0;
  let endsAt = 0;
  let alreadyDone = [];

  while (1) {
    const c = xskips.find((x, i) => {
      let arrStart = x[0];
      let arrEnd = x[1];

      if (arrStart - 1 <= start && start < arrEnd) {
        start = arrEnd;
        endsAt = arrEnd;
        return true;
      }

      return false;
    });

    if (!c) break;
  }

  if (start !== n) {
    px = start + 1;
    py = row;
    break;
  }
}

console.log("only frequency available:", px * 4000000 + py);
