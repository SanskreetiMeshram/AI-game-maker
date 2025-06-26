const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gravity = 1;
let gameSpeed = 6;
let score = 0;

// Load config from gameConfig.json
fetch("gameConfig.json").then(res => res.json()).then(config => {
  if (config.settings) {
    const { difficulty, speed, gravity: g } = config.settings;
    if (speed) gameSpeed = parseFloat(speed);
    if (g) gravity = parseFloat(g);
  }
});

const player = {
  x: 80,
  y: 0,
  width: 50,
  height: 50,
  dy: 0,
  jumping: false
};

const obstacles = [];

const playerImg = new Image();
playerImg.src = "assets/player.png";

const bgImg = new Image();
bgImg.src = "assets/background.png";

const groundImg = new Image();
groundImg.src = "assets/ground.png";

const obsImg = new Image();
obsImg.src = "assets/obstacle.png";

function spawnObstacle() {
  obstacles.push({ x: canvas.width, y: 300, width: 50, height: 50 });
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping) {
    player.dy = -15;
    player.jumping = true;
  }
});

setInterval(spawnObstacle, 1500);

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(groundImg, 0, 350, canvas.width, 50);

  // Draw player
  player.y += player.dy;
  player.dy += gravity;
  if (player.y > 300) {
    player.y = 300;
    player.dy = 0;
    player.jumping = false;
  }
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Draw and move obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    obs.x -= gameSpeed;
    ctx.drawImage(obsImg, obs.x, obs.y, obs.width, obs.height);

    // Collision
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      alert("Game Over! Score: " + score);
      location.reload();
    }

    if (obs.x + obs.width < 0) {
      obstacles.splice(i, 1);
      score++;
    }
  }

  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(update);
}

update();
