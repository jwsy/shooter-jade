var el = document.getElementsByTagName("canvas")[0];
el.addEventListener("touchstart", handleTouchMouseStartMove, false);
// el.addEventListener("touchend", handleEnd, false);
// el.addEventListener("touchcancel", handleCancel, false);
el.addEventListener("touchmove", handleTouchMouseStartMove, false);
var epochTime = Date.now();

function findPos(obj) {
  var curleft = 0,
    curtop = 0;

  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);

    return { x: curleft - document.body.scrollLeft, y: curtop - document.body.scrollTop };
  }
}

function handleTouchMouseStartMove(evt) {
  evt.preventDefault();
  var el = document.getElementsByTagName("canvas")[0];
  clientRec = el.getBoundingClientRect();
  x = evt.targetTouches[0].pageX;
  y = evt.targetTouches[0].pageY;
  // console.log(clientRec, x, y);
  var curTime = Date.now();
  if (curTime - epochTime > 100) {
    epochTime = curTime
    spawnBullet(player.pos);
  }
  if (x < clientRec.width / 2) {
    movePlayerLeft();
  }
  else if (clientRec.width / 2 < x) {
    movePlayerRight();
  }
  updateTouchPosText(x, y);
}

const BULLET_SPEED = 640;
// const ENEMY_SPEED = 60;
const ENEMY_SPEED = 50;
// const PLAYER_SPEED = 120;
const PLAYER_SPEED = 200;

add([
  sprite("nightsky"),
  scale(width() / 240,
    height() / 240),
]);

add([
  sprite("stars"),
  scale(width() / 240, height() / 240),
  pos(0, 0),
  "stars",
]);

add([
  sprite("stars"),
  scale(width() / 240, height() / 240),
  pos(0, -height()),
  "stars",
]);

action("stars", (r) => {
  r.move(0, 32);
  if (r.pos.y >= height()) {
    r.pos.y -= height() * 2;
  }
});

const player = add([
  sprite("jade_transparent"),
  // sprite("doge"),
  pos(width() / 2, height() - 16),
  origin("center"),
  "player"
]);

function movePlayerLeft() {
  if (player.pos.x > 0) {
    player.move(-PLAYER_SPEED, 0);
  }
};

function movePlayerRight() {
  if (player.pos.x < width()) {
    player.move(PLAYER_SPEED, 0);
  }
};

keyDown("left", () => {
  // player.move(-PLAYER_SPEED, 0);
  movePlayerLeft();
});

keyDown("right", () => {
  // player.move(PLAYER_SPEED, 0);
  movePlayerRight();
});

function spawnBullet(p) {
  add([
    rect(2, 6),
    pos(p),
    origin("center"),
    color(0.5, 0.5, 1),
    // strings here means a tag
    "bullet",
  ]);
}

keyPress(["j", "9"], () => {
  spawnBullet(player.pos.sub(4, 0));
  spawnBullet(player.pos.add(4, 0));
  spawnBullet(player.pos.sub(16, 0));
  spawnBullet(player.pos.add(16, 0));
  spawnBullet(player.pos.sub(52, 0));
  spawnBullet(player.pos.add(52, 0));
  spawnBullet(player.pos.sub(104, 0));
  spawnBullet(player.pos.add(104, 0));
  spawnBullet(player.pos.sub(176, 0));
  spawnBullet(player.pos.add(176, 0));
});

keyPress(["space", "up"], () => {
  spawnBullet(player.pos.sub(4, 0));
  spawnBullet(player.pos.add(4, 0));
});

// run this callback every frame for all objects with tag "bullet"
action("bullet", (b) => {
  b.move(0, -BULLET_SPEED);
  // remove the bullet if it's out of the scene for performance
  if (b.pos.y < 0) {
    destroy(b);
  }
});

function spawnEnemy() {
  enemySpriteArr = ["rainbowpoop", "dumpsterfire", "dumpsterfire", "dumpsterfire", "dumpsterfire", "dumpsterfire", "dumpsterfire", "dumpsterfire"];
  enemySprite = enemySpriteArr[Math.floor(Math.random() * 8)]
  return add([
    sprite(enemySprite),
    pos(rand(0, width()), 0),
    "enemy",
    enemySprite
  ]);
}

const score = add([
  pos(12, 12),
  text(0),
  // all objects defaults origin to center, we want score text to be top left
  // plain objects becomes fields of score
  {
    value: 0,
  },
]);

// if a "bullet" and a "enemy" collides, remove both of them
collides("bullet", "enemy", (b, e) => {
  // console.log(JSON.stringify(e) );
  if (e.is("rainbowpoop")) {
    score.value += 10;
    camShake(12);
  }
  else {
    score.value += 1;
    camShake(2);
  }
  destroy(b);
  destroy(e);
  score.text = score.value;
});

// if the player or enemy collide, remove the enemy
collides("player", "enemy", (b, e) => {
  camShake(1);
  destroy(e);
});

action("enemy", (e) => {
  e.move(0, ENEMY_SPEED);
  if (e.pos.y > height()) {
    destroy(e);
  }
});

// display fps
const fpsText = add([pos(width() * 0.6, 12), text("fps"), { value: 0, },]);
function updateFps() {
  fpsText.value = parseFloat(fps()).toFixed(3);
  fpsText.text = "fps: " + fpsText.value;
};
loop(0.1, updateFps);

// display mpos
const mousePosText = add([pos(width() * 0.6, 12 * 2), text("mpos: no mouse detected"), { value: 0 },]);
function updateMousePosText() {
  mp = mousePos();
  // console.log("updateMousePosText.mp: ", JSON.stringify(mp));
  mousePosText.text = "mpos: " + JSON.stringify(mp);
  var curTime = Date.now();
  if (curTime - epochTime > 100) {
    epochTime = curTime
    spawnBullet(player.pos);
  }
  if (mp.x < player.pos.x) {
    movePlayerLeft();
  }
  else if (player.pos.x < mp.x) {
    movePlayerRight();
  }
};

// display tpos
const touchPosText = add([pos(width() * 0.6, 12 * 3), text("tpos: no touch detected"), { value: 0 },]);
function updateTouchPosText(x, y) {
  touchPosText.text = "tpos: " + JSON.stringify({ "x": Math.ceil(x), "y": Math.ceil(y), });
  // console.log("touchPosText.text", touchPosText.text);
};


mouseDown(updateMousePosText);
player.clicks(() => {
  console.log("aloha");
});

// spawn an enemy every period
loop(0.4, spawnEnemy);