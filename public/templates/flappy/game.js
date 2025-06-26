fetch('gameConfig.json')
  .then(res => res.json())
  .then(config => {
    console.log('Game Config Loaded:', config);

    // Example:
    const speed = parseFloat(config.settings.speed) || 200;
    const gravity = parseFloat(config.settings.gravity) || 800;

    // You can inject this into Phaser config!
  });

const urlParams = new URLSearchParams(window.location.search);
const speed = parseFloat(urlParams.get("speed")) || 200;
const gravity = parseFloat(urlParams.get("gravity")) || 800;

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: gravity },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let bird, pipes, scoreText, score = 0;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

function create() {
  this.add.image(200, 300, 'background');

  bird = this.physics.add.sprite(100, 300, 'bird').setScale(0.5);
  bird.setCollideWorldBounds(true);

  pipes = this.physics.add.group();

  this.input.on('pointerdown', () => {
    bird.setVelocityY(-300);
  });

  this.time.addEvent({
    delay: 1500,
    callback: addPipe,
    callbackScope: this,
    loop: true
  });

  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '20px', fill: '#fff'
  });

  this.physics.add.collider(bird, pipes, hitPipe, null, this);
}

function update() {
  if (bird.y > 600) {
    gameOver();
  }
}

function addPipe() {
  const hole = Phaser.Math.Between(100, 400);
  const topPipe = pipes.create(400, hole - 150, 'pipe').setOrigin(0, 1);
  const bottomPipe = pipes.create(400, hole + 150, 'pipe');

  topPipe.body.velocity.x = -speed;
  bottomPipe.body.velocity.x = -speed;

  topPipe.checkWorldBounds = true;
  bottomPipe.checkWorldBounds = true;

  topPipe.outOfBoundsKill = true;
  bottomPipe.outOfBoundsKill = true;

  score += 1;
  scoreText.setText('Score: ' + score);
}

function hitPipe() {
  gameOver();
}

function gameOver() {
  game.scene.pause();
  scoreText.setText('Game Over! Score: ' + score);
}
