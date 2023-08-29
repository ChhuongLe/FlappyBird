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
  setInterval(placePipes, 1500) // every 1.5 seconds we place a new pipe
  document.addEventListener("keydown", moveBird);
}


// function to update frames of the canvas (main game loop)
function update() {
  requestAnimationFrame(update);
  // clear previous frame
  context.clearRect(0,0, board.width, board.height);

  //bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); // apply to current bird.y, limit bird.y to top of canvas
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  //pipes
  for(let i = 0; i < pipeArr.length; i++) {
    let pipe = pipeArr[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
  }
}

function placePipes() {

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
  }
}