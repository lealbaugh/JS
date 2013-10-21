var plateImg = new Image();
plateImg.src = 'dish.png';
var cursor = new Image();
cursor.src = 'cursor.png';
var dirtImg = new Image();
dirtImg.src = 'dirt.png';
var eraser = new Image();
eraser.src = 'eraser.png';

mouseX = -10;
mouseY = -10;

function main(){
  initialize();
  gameLoop();   //yeah, oh hey, that
}


function initialize(){
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

backctx.drawImage(plateImg, backcanvas.width/2-plateImg.width/2, backcanvas.height/2-plateImg.height/2);
middlectx.drawImage(dirtImg, middlecanvas.width/2-dirtImg.width/2, middlecanvas.height/2-dirtImg.height/2);

 // middlectx.fillRect(backcanvas.width/2-plateImg.width/2, backcanvas.height/2-plateImg.height/2, plateImg.width, plateImg.height);


  
}


function gameLoop(){
//  processPlayerInput(); //right now we're just doing event handling; later we'll add some plates on a timer
//  update GameLogic();
  draw();
  setTimeout(gameLoop, 25);
}


function draw(){
  middlectx.globalCompositeOperation = "destination-out";
  middlectx.drawImage(eraser, mouseX-eraser.width/2, mouseY-eraser.width/2);

  frontctx.clearRect(0, 0, middlecanvas.width, middlecanvas.height);
  frontctx.drawImage(cursor, mouseX-cursor.width/2, mouseY-cursor.width/2);

//  frontctx.clearRect(mouseX, mouseY, 10, 10)

  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.drawImage(plateImg, canvas.width/2-plateImg.width/2, canvas.height/2-plateImg.height/2)

}


function  mouseMoved(e) {     //e is the event handed to us
    mouseX = e.pageX - frontcanvas.offsetLeft;
    mouseY = e.pageY - frontcanvas.offsetTop;
}


function  mouseClicked(e) {
    // console.log("click");
    mouseX = e.pageX - frontcanvas.offsetLeft;
    mouseY = e.pageY - frontcanvas.offsetTop;

}
