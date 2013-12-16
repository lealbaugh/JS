var plate = new Image();
plate.src = 'dish.png';
var cursor = new Image();
cursor.src = 'cursor.png';
var dirt = new Image();
dirt.src = 'dirt.png';
var eraser = new Image();
eraser.src = 'eraser.png';


starlevels = ["gold-star.png", "silver-star.png", "blue-star.png", "no-star.png"]
var star = new Image();
star.src = "no-star.png";

mouseX = -10;
mouseY = -10;

cleanarea=130;

var progress = 200000;

function main() {
  initialize();
  gameLoop();   //yeah, oh hey, that
}


function initialize() {
  frontcanvas = document.getElementById('front-canvas');
  frontctx = frontcanvas.getContext("2d");
  frontcanvas.width = 600;
  frontcanvas.height = 300;

  middlecanvas = document.getElementById('middle-canvas');
  middlectx = middlecanvas.getContext("2d");
  middlecanvas.width = 600;
  middlecanvas.height = 300;

  backcanvas = document.getElementById('back-canvas');
  backctx = backcanvas.getContext("2d");
  backcanvas.width = 600;
  backcanvas.height = 300;

  addEventListener('mousemove', mouseMoved, false);
  addEventListener('click', mouseClicked, false);

  backctx.drawImage(plate, backcanvas.width/2-plate.width/2, backcanvas.height/2-plate.height/2);
  middlectx.drawImage(dirt, middlecanvas.width/2-dirt.width/2, middlecanvas.height/2-dirt.height/2);

//  middlectx.fillRect(middlecanvas.width/2-cleanarea, middlecanvas.height/2-cleanarea, 2*cleanarea, 2*cleanarea);

}


function gameLoop() {
//  processPlayerInput(); //right now we're just doing event handling; later we'll add some plates on a timer
//  update GameLogic();
  draw();
  
  setTimeout(gameLoop, 25);
}


function draw() {
  middlectx.globalCompositeOperation = "destination-out";   //destination-out mode subtracts the source from the destination
  middlectx.drawImage(eraser, mouseX-eraser.width/2, mouseY-eraser.width/2);

  frontctx.clearRect(0, 0, middlecanvas.width, middlecanvas.height);  //clear the screen so cursor is updated
  frontctx.drawImage(cursor, mouseX-cursor.width/2, mouseY-cursor.width/2);

  frontctx.drawImage(star, frontcanvas.width-star.width, 0);
}



function checkForBlankness(context, canvas) {
  var dirtypixels = 0;
  var pixels = middlectx.getImageData(middlecanvas.width/2-cleanarea, middlecanvas.height/2-cleanarea, 2*cleanarea, 2*cleanarea).data;
  var pixellength = pixels.length;
  for (var i =0; i<pixellength; i+=4) {
    if(pixels[i+3] !== 0) { //i+3 should catch the indices of the alpha value
      dirtypixels+=1;
      }
  }
  return dirtypixels;
}

function showpixel() {
  var pixels = middlectx.getImageData(0,0,middlecanvas.width, middlecanvas.height);
  return pixels;
}


function  mouseMoved(e) {     //e is the event handed to us
    mouseX = e.pageX - frontcanvas.offsetLeft;
    mouseY = e.pageY - frontcanvas.offsetTop;
}


function  mouseClicked(e) {
    // console.log("click");
    mouseX = e.pageX - frontcanvas.offsetLeft;
    mouseY = e.pageY - frontcanvas.offsetTop;
    
    console.log("checking...");
    progress = checkForBlankness(middlectx, middlecanvas);
    console.log("There are "+progress+" dirty pixels.");
    if (progress<=10) star.src = "gold-star.png";
    else if (progress<=100) star.src = "silver-star.png";
    else if (progress<=3000) star.src = "blue-star.png";
    else star.src = "no-star.png";


  

}
