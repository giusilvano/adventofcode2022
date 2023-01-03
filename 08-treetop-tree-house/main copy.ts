let input = await Deno.readTextFile("inputTest.txt");
input = await Deno.readTextFile("input.txt");

const forest = input.split("\n").map((row) => row.split("").map(Number));

let visibleTrees = 0;

for (let row = 0; row < forest.length; row++) {
  for (let col = 0; col < forest[row].length; col++) {
    const tree = forest[row][col];
    let visibleFromOutside = true;

    for (let z = row - 1; z >= 0; z--) {
      if (forest[z][col] >= tree) {
        visibleFromOutside = false;
        break;
      }
    }

    if (visibleFromOutside) {
      visibleTrees++;
      continue;
    }

    visibleFromOutside = true;
    for (let z = row + 1; z < forest.length; z++) {
      if (forest[z][col] >= tree) {
        visibleFromOutside = false;
        break;
      }
    }

    if (visibleFromOutside) {
      visibleTrees++;
      continue;
    }

    visibleFromOutside = true;
    for (let z = col - 1; z >= 0; z--) {
      if (forest[row][z] >= tree) {
        visibleFromOutside = false;
        break;
      }
    }

    if (visibleFromOutside) {
      visibleTrees++;
      continue;
    }

    visibleFromOutside = true;
    for (let z = col + 1; z < forest.length; z++) {
      if (forest[row][z] >= tree) {
        visibleFromOutside = false;
        break;
      }
    }

    if (visibleFromOutside) {
      visibleTrees++;
      continue;
    }
  }
}

console.log(visibleTrees); //1823

const scores = [];
for (let i = 0; i < forest.length; i++) {
  for (let j = 0; j < forest[i].length; j++) {
    const tree = forest[i][j];
    let finalScore = 1;

    let score = 0;
    for (let z = i - 1; z >= 0; z--) {
      score++;
      if (forest[z][j] >= tree) {
        break;
      }
    }

    finalScore *= score;
    score = 0;

    for (let z = i + 1; z < forest.length; z++) {
      score++;
      if (forest[z][j] >= tree) {
        break;
      }
    }

    finalScore *= score;
    score = 0;

    for (let z = j - 1; z >= 0; z--) {
      score++;
      if (forest[i][z] >= tree) {
        break;
      }
    }

    finalScore *= score;
    score = 0;

    for (let z = j + 1; z < forest.length; z++) {
      score++;
      if (forest[i][z] >= tree) {
        break;
      }
    }

    finalScore *= score;

    scores.push(finalScore);
  }
}

console.log(Math.max(...scores)); //211680
