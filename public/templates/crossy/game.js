const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 64;
const rows = 10;
const cols = 10;

let player = { x: 5, y: 9 };
let cars = [];
let logs = [];
let score = 0;

let carSpeed = 2;
let logSpeed = 1.5;

const images = {
  player: new Image(),
  car: new Image(),
  log: new Image(),
  water: new Image(),
  bg: new Image()
};

images.player.src = "assets/player.png";
images.car.src = "assets/car.png";
images.log.src = "assets/log.png";
images.water.src = "assets/water.png";
images.bg.src = "assets/background.png";

// Optional: Load difficulty from config
fetch("gameConfig.json")
  .then(res => res.json())
  .then(cfg => {
    const diff = cfg.settings?.difficulty || "Easy";
    if (diff === "Medium") {
      carSpeed = 3; logSpeed = 2.5;
    } else if (diff === "Hard") {
      carSpeed = 4; logSpeed = 3.5;
    }
  });

// Random generation
function spawnTraffic() {
  cars.push({ x: Math.random() > 0.5 ? -tileSize : canvas.width, y: 7, dir: Math.random() > 0.5 ? 1 : -1 });
}
function spawnLogs() {
  logs.push({ x: Math.random() > 0.5 ? -tileSize : canvas.width, y: 3, dir: Math.random() > 0.5 ? 1 : -1 });
}

setInterval(spawnTraffic, 1500);
setInterval(spawnLogs, 2000);

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp") player.y--;
  else if (e.code === "ArrowDown") player.y++;
  else if (e.code === "ArrowLeft") player.x--;
  else if (e.code === "ArrowRight") player.x++;

  if (player.x < 0) player.x = 0;
  if (player.x >= cols) player.x = cols - 1;
  if (player.y < 0) {
    alert("🎉 You Win!");
    location.reload();
  }
  if (player.y >= rows) player.y = rows - 1;
});

function drawTile(img, x, y) {
  ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.drawImage(images.bg, 0, 0, canvas.width, canvas.height);

  // Roads and water
  for (let r = 0; r < rows; r++) {
    if (r === 3) {
      for (let c = 0; c < cols; c++) drawTile(images.water, c, r);
    } else if (r === 7) {
      ctx.fillStyle = "#444";
      ctx.fillRect(0, r * tileSize, canvas.width, tileSize);
    }
  }

  // Move & draw logs
  logs.forEach((log) => {
    log.x += log.dir * logSpeed;
    ctx.drawImage(images.log, log.x, log.y * tileSize, tileSize, tileSize);
  });

  // Move & draw cars
  cars.forEach((car) => {
    car.x += car.dir * carSpeed;
    ctx.drawImage(images.car, car.x, car.y * tileSize, tileSize, tileSize);
  });

  // Player
  drawTile(images.player, player.x, player.y);

  // Collision: Car
  cars.forEach((car) => {
    if (
      Math.floor(car.x / tileSize) === player.x &&
      car.y === player.y
    ) {
      alert("💥 You got hit! Score: " + score);
      location.reload();
    }
  });

  // Water death
  if (player.y === 3) {
    const onLog = logs.some((log) => Math.floor(log.x / tileSize) === player.x);
    if (!onLog) {
      alert("💧 You drowned!");
      location.reload();
    }
  }

  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  requestAnimationFrame(draw);
}

draw();
