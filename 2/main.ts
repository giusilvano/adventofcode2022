const textInput = await Deno.readTextFile("input.txt");

const rows = textInput.split("\n");

let part1 = 0;
let part2 = 0;

for (let i = 0; i < rows.length; i++) {
  let score: number;
  switch (rows[i]) {
    case "A X":
      score = 1 + 3;
      break;
    case "B X":
      score = 1 + 0;
      break;
    case "C X":
      score = 1 + 6;
      break;
    case "A Y":
      score = 2 + 6;
      break;
    case "B Y":
      score = 2 + 3;
      break;
    case "C Y":
      score = 2 + 0;
      break;
    case "A Z":
      score = 3 + 0;
      break;
    case "B Z":
      score = 3 + 6;
      break;
    case "C Z":
      score = 3 + 3;
      break;
    default:
      throw new Error();
  }

  const rightScores: any = {
    "A X": 3 + 0,
    "B X": 1 + 0,
    "C X": 2 + 0,
    "A Y": 1 + 3,
    "B Y": 2 + 3,
    "C Y": 3 + 3,
    "A Z": 2 + 6,
    "B Z": 3 + 6,
    "C Z": 1 + 6,
  };

  if (!(rows[i] in rightScores)) throw new Error();

  part1 += score;
  part2 += rightScores[rows[i]];
}
console.log(part1, part2);
// not 13058
