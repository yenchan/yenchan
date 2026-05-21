const fs = require("fs");

const gameState = JSON.parse(fs.readFileSync("data/gameState.json", "utf8"));

const colors = {
  background: "#F7F3EC",
  grid: "#D8CFC1",
  gold: "#B8924A",
  espresso: "#3B312B",
  text: "#2A2521"
};

const cellWidth = 80;
const cellHeight = 90;
const boardLeft = 100;
const boardTop = 40;
const rows = gameState.rows;
const columns = gameState.columns;

let svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="700" height="640" viewBox="0 0 700 640">
  <rect width="700" height="640" fill="${colors.background}"/>
`;

for (let column = 0; column < columns; column++) {
  const x = boardLeft + column * cellWidth + cellWidth / 2;

  svg += `
    <text
      x="${x}"
      y="25"
      text-anchor="middle"
      font-size="28"
      font-weight="bold"
      fill="${colors.gold}"
      font-family="Arial, sans-serif"
    >
      ${column + 1}
    </text>
  `;
}

for (let row = 0; row < rows; row++) {
  for (let column = 0; column < columns; column++) {
    const x = boardLeft + column * cellWidth;
    const y = boardTop + row * cellHeight;

    svg += `
      <rect
        x="${x}"
        y="${y}"
        width="${cellWidth}"
        height="${cellHeight}"
        fill="none"
        stroke="${colors.grid}"
        stroke-width="2"
      />
    `;

    const value = gameState.board[row][column];

    if (value === "gold" || value === "espresso") {
      const circleX = x + cellWidth / 2;
      const circleY = y + cellHeight / 2;
      const fillColor = value === "gold" ? colors.gold : colors.espresso;

      svg += `
        <circle
          cx="${circleX}"
          cy="${circleY}"
          r="22"
          fill="${fillColor}"
        />
      `;
    }
  }
}

svg += `</svg>`;

fs.writeFileSync("assets/connect4-board.svg", svg);
