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
}