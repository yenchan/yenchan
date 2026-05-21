const fs = require("fs");
const path = require("path");

const issueTitle = process.env.ISSUE_TITLE || "";
const issueBody = process.env.ISSUE_BODY || "";

let column = null;

const titleMatch = issueTitle.match(/connect4-move-(\d+)/i);
if (titleMatch) {
  column = Number(titleMatch[1]);
}

if (!column) {
  const bodyMatch = issueBody.match(/\b([1-7])\b/);
  if (bodyMatch) {
    column = Number(bodyMatch[1]);
  }
}

if (!column || column < 1 || column > 7) {
  throw new Error(`Could not determine a valid column from issue. Title: ${issueTitle} Body: ${issueBody}`);
}

const gameStatePath = path.join(__dirname, "..", "data", "gameState.json");
const gameState = JSON.parse(fs.readFileSync(gameStatePath, "utf8"));

if (gameState.winner || gameState.isDraw) {
  throw new Error("Game is already finished.");
}

const columnIndex = column - 1;
let placedRow = -1;

for (let row = gameState.rows - 1; row >= 0; row--) {
  if (!gameState.board[row][columnIndex]) {
    gameState.board[row][columnIndex] = gameState.currentPlayer;
    placedRow = row;
    break;
  }
}

if (placedRow === -1) {
  throw new Error(`Column ${column} is full.`);
}

function checkDirection(board, row, col, rowStep, colStep, player) {
  let count = 0;
  let r = row;
  let c = col;

  while (
    r >= 0 &&
    r < board.length &&
    c >= 0 &&
    c < board[0].length &&
    board[r][c] === player
  ) {
    count++;
    r += rowStep;
    c += colStep;
  }

  return count;
}

function hasWinner(board, row, col, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  return directions.some(([rowStep, colStep]) => {
    const forward = checkDirection(board, row, col, rowStep, colStep, player);
    const backward = checkDirection(board, row, col, -rowStep, -colStep, player);
    return forward + backward - 1 >= 4;
  });
}

const player = gameState.currentPlayer;

gameState.moveHistory.push({
  player,
  column,
  row: placedRow + 1
});

if (hasWinner(gameState.board, placedRow, columnIndex, player)) {
  gameState.winner = player;
} else {
  const boardFull = gameState.board.every((row) => row.every((cell) => cell));
  gameState.isDraw = boardFull;
  if (!boardFull) {
    gameState.currentPlayer = player === "gold" ? "red" : "gold";
  }
}

fs.writeFileSync(gameStatePath, JSON.stringify(gameState, null, 2) + "\n");
