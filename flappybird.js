//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 34; // height to width ratio = 408/228 = 17/12
let birdHeight = 24;
// specify 2 parameters for x and y positions
let birdPosX = boardWidth/8;
let birdPosY = boardHeight/2;
let birdImg;

let bird = {
  x: birdPosX,
  y: birdPosY,
  width: birdWidth,
  height: birdHeight,
}

// pipes
let pipeArr = [];
let pipeWidth = 64; // height to width ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics
let velocityX = -2.5; // pipe's moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.1 ;

let gameOver = false;
let score = 0;
let highScore = 0;

window.onload = function () {
  // assign variable board to css element board
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  // used for drawing on the board
  context = board.getContext("2d");

  // load bird image
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function() {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)
  }

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png"

  requestAnimationFrame(update);
  setInterval(placePipes, 1000) // every 1.5 seconds we place a new pipe
  document.addEventListener("keydown", moveBird);
}


// function to update frames of the canvas (main game loop)
function update() {
  requestAnimationFrame(update);
  if(gameOver) {
    return;
  }
  // clear previous frame
  context.clearRect(0,0, board.width, board.height);

  //bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); // apply to current bird.y, limit bird.y to top of canvas
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if(bird.y > board.height) {
    gameOver = true;
  }
  //pipes
  for(let i = 0; i < pipeArr.length; i++) {
    let pipe = pipeArr[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if(!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += (1/2  ); // detects 2 pipe passed so 0.5 is for 1 for 2 pipes
      pipe.passed = true;
    }

    // clear pipes that have
    while(pipeArr.length > 0 && pipeArr[0].x < -pipeWidth) {
      pipeArr.shift(); // removes first element from array
    }

    if(detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }
  // score
  context.fillStyle = "white";
  context.font = "40px sans-serif";

  context.fillText(score, 5, 45);

  if(gameOver) {
    highScore = Math.max(score, highScore);
    context.fillText("GAME OVER", 60, 260)
    context.font = "20px sans-serif"
    context.fillText("High Score:", 120, 300);
    context.fillText(highScore, 230, 300)
    context.fillText("Tap space to restart", 95 , 340 )
  }
}

function placePipes() {
  if(gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
  let openingSpace = board.height/4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  }

  pipeArr.push(topPipe)

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  }

  pipeArr.push(bottomPipe)
}

function moveBird (e) {
  if(e.code === "Space" || e.code === "ArrowUp") {
    // jump
    velocityY = -3;

    // game over
    if(gameOver){
      bird.y = birdPosY ;
      pipeArr = [];
      score = 0;
      gameOver=false;
    }
  }
}

function detectCollision (a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}