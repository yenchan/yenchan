const fs = require("fs");
const path = require("path");

const readmePath = path.join(__dirname, "..", "README.md");
const gameStatePath = path.join(__dirname, "..", "data", "gameState.json");

const readme = fs.readFileSync(readmePath, "utf8");
const gameState = JSON.parse(fs.readFileSync(gameStatePath, "utf8"));

const imageVersion = gameState.moveHistory.length;

const playerNames = {
  gold: "Espresso",
  red: "Rose"
};

let statusLine = `**Current turn: ${playerNames[gameState.currentPlayer] || gameState.currentPlayer}**`;

if (gameState.winner) {
  statusLine = `**Winner: ${playerNames[gameState.winner] || gameState.winner}**`;
} else if (gameState.isDraw) {
  statusLine = `**Result: Draw**`;
}

const connect4Section = `<!-- CONNECT4:START -->
![Connect 4 board](./assets/connect4-board.svg?v=${imageVersion})

${statusLine}

**Make a move:**  
[1](https://github.com/yenchan/yenchan/issues/new?template=connect4-move.yml&title=connect4-move-1&column=1) ·
[2](https://github.com/yenchan/yenchan/issues/new?template=connect4-move.yml&title=connect4-move-2&column=2) ·
[3](https://github.com/yenchan/yenchan/issues/new?template=connect4-move.yml&title=connect4-move-3&column=3) ·
[4](https://github.com/yenchan/yenchan/issues/new?template=connect4-move.yml&title=connect4-move-4&column=4) ·
[5](https://github.com/yenchan/yenchan/issues/new?template=connect4-move.yml&title=connect4-move-5&column=5) ·
[6](https://github.com/yenchan/yenchan/issues/new?template=connect4-move.yml&title=connect4-move-6&column=6) ·
[7](https://github.com/yenchan/yenchan/issues/new?template=connect4-move.yml&title=connect4-move-7&column=7)
<!-- CONNECT4:END -->`;

const updatedReadme = readme.replace(
  /<!-- CONNECT4:START -->[\s\S]*<!-- CONNECT4:END -->/,
  connect4Section
);

fs.writeFileSync(readmePath, updatedReadme);
