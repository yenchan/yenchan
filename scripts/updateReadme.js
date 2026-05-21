const fs = require("fs");

const readmePath = "README.md";
const readme = fs.readFileSync(readmePath, "utf8");
const gameState = JSON.parse(fs.readFileSync("data/gameState.json", "utf8"));

let statusText = `Current turn: ${gameState.currentPlayer === "gold" ? "Gold" : "Espresso"}`;

if (gameState.winner) {
  statusText = `Winner: ${gameState.winner === "gold" ? "Gold" : "Espresso"}`;
}

if (gameState.isDraw) {
  statusText = "Game ended in a draw";
}

const newSection = `
![Connect 4 board](./assets/connect4-board.svg)

**${statusText}**

**Make a move:**  
[1](../../issues/new?template=connect4-move.yml&title=connect4-move-1) ·
[2](../../issues/new?template=connect4-move.yml&title=connect4-move-2) ·
[3](../../issues/new?template=connect4-move.yml&title=connect4-move-3) ·
[4](../../issues/new?template=connect4-move.yml&title=connect4-move-4) ·
[5](../../issues/new?template=connect4-move.yml&title=connect4-move-5) ·
[6](../../issues/new?template=connect4-move.yml&title=connect4-move-6) ·
[7](../../issues/new?template=connect4-move.yml&title=connect4-move-7)
`;

const updatedReadme = readme.replace(
  /<!-- CONNECT4:START -->[\s\S]*<!-- CONNECT4:END -->/,
  `<!-- CONNECT4:START -->${newSection}<!-- CONNECT4:END -->`
);

fs.writeFileSync(readmePath, updatedReadme);
