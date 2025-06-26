const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const holes = [
  { x: 100, y: 100 }, { x: 250, y: 100 }, { x: 400, y: 100 },
  { x: 100, y: 250 }, { x: 250, y: 250 }, { x: 400, y: 250 }
];

let moleImg = new Image();
let bgImg = new Image();
let score = 0;
let moleIndex = -1;
let gameSpeed = 1000; // default Easy

// Load game config (optional)
fetch('gameConfig.json')
  .then(res => res.json())
  .then(config => {
    const difficulty = config.settings.difficulty || "Easy";
    if (difficulty === "Medium") gameSpeed = 700;
    if (difficulty === "Hard") gameSpeed = 400;
  });

// Load assets
moleImg.src = "assets/mole.png";
bgImg.src = "assets/background.png";

bgImg.onload = () => {
  draw();
  setInterval(spawnMole, gameSpeed);
};

function spawnMole() {
  moleIndex = Math.floor(Math.random() * holes.length);
  draw();
  setTimeout(() => {
    moleIndex = -1;
    draw();
  }, gameSpeed - 200);
}

function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  holes.forEach((hole, index) => {
    if (index === moleIndex) {
      ctx.drawImage(moleImg, hole.x, hole.y, 80, 80);
    }
  });
  ctx.fillStyle = "white";
  ctx.font = "24px sans-serif";
  ctx.fillText("Score: " + score, 20, 30);
}

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (moleIndex >= 0) {
    const mole = holes[moleIndex];
    if (
      x >= mole.x && x <= mole.x + 80 &&
      y >= mole.y && y <= mole.y + 80
    ) {
      score++;
      moleIndex = -1;
      draw();
    }
  }
});
