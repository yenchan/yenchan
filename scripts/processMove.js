const fs = require('fs');
const path = require('path');

const issueTitle = process.env.ISSUE_TITLE || '';
const issueBody = process.env.ISSUE_BODY || '';

let column = null;
const titleMatch = issueTitle.match(/connect4-move-(\d+)/i);
if (titleMatch) column = Number(titleMatch[1]);
if (!column) {
  const bodyMatch = issueBody.match(/\b([1-7])\b/);
  if (bodyMatch) column = Number(bodyMatch[1]);
}
if (!column || column < 1 || column > 7) throw new Error(`Could not determine a valid column from issue. Title: ${issueTitle} Body: ${issueBody}`);

const gameStatePath = path.join(__dirname, '..', 'data', 'gameState.json');
const gameState = JSON.parse(fs.readFileSync(gameStatePath, 'utf8'));
if (gameState.winner || gameState.isDraw) throw new Error('Game is already finished.');

const col = column - 1;
let rowPlaced = -1;
for (let row = gameState.rows - 1; row >= 0; row--) {
  if (!gameState.board[row][col]) {
    gameState.board[row][col] = gameState.currentPlayer;
    rowPlaced = row;
    break;
  }
}
if (rowPlaced === -1) throw new Error(`Column ${column} is full.`);

gameState.moveHistory.push({ player: gameState.currentPlayer, column, row: rowPlaced + 1 });

function count(board, r, c, dr, dc, player) {
  let n = 0;
  while (r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === player) {
    n += 1;
    r += dr;
    c += dc;
  }
  return n;
}

function hasWinner(board, r, c, player) {
  return [[0,1],[1,0],[1,1],[1,-1]].some(([dr, dc]) => count(board, r, c, dr, dc, player) + count(board, r, c, -dr, -dc, player) - 1 >= 4);
}

const player = gameState.currentPlayer;
if (hasWinner(gameState.board, rowPlaced, col, player)) {
  gameState.winner = player;
} else if (gameState.board.every(row => row.every(cell => cell))) {
  gameState.isDraw = true;
} else {
  gameState.currentPlayer = player === 'gold' ? 'red' : 'gold';
}

fs.writeFileSync(gameStatePath, JSON.stringify(gameState, null, 2) + '\n');
