const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 80;
const rows = 5;
const cols = 5;
const tileTypes = 3;

let grid = [];
let selected = null;
let tileImgs = [];

function loadAssets(callback) {
  const paths = ["assets/tile1.png", "assets/tile2.png", "assets/tile3.png"];
  let loaded = 0;
  for (let i = 0; i < paths.length; i++) {
    const img = new Image();
    img.src = paths[i];
    img.onload = () => {
      tileImgs[i] = img;
      loaded++;
      if (loaded === paths.length) callback();
    };
  }
}

function generateGrid() {
  grid = [];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(Math.floor(Math.random() * tileTypes));
    }
    grid.push(row);
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = grid[r][c];
      ctx.drawImage(tileImgs[tile], c * tileSize, r * tileSize, tileSize, tileSize);
      if (selected && selected.row === r && selected.col === c) {
        ctx.strokeStyle = "#ff0";
        ctx.lineWidth = 4;
        ctx.strokeRect(c * tileSize, r * tileSize, tileSize, tileSize);
      }
    }
  }
}

function swapTiles(r1, c1, r2, c2) {
  const temp = grid[r1][c1];
  grid[r1][c1] = grid[r2][c2];
  grid[r2][c2] = temp;
}

function handleClick(x, y) {
  const row = Math.floor(y / tileSize);
  const col = Math.floor(x / tileSize);
  if (!selected) {
    selected = { row, col };
  } else {
    const dx = Math.abs(selected.col - col);
    const dy = Math.abs(selected.row - row);
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      swapTiles(selected.row, selected.col, row, col);
    }
    selected = null;
  }
  drawGrid();
}

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  handleClick(x, y);
});

loadAssets(() => {
  generateGrid();
  drawGrid();
});
