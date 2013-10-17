var dishheight = 10;

var canvas;
var ctx;

var keysDown;
var mouseX = 0;
var mouseY = 0;


var playerImg = new Image();
playerImg.src = 'http://placekitten.com/g/50/50';




var StackView = function(stack, ctx) {
   var drawOps = [];
   stack.bind("push", function(x) {
       drawOps.push(function() { 
        ctx.fillStyle= x.color;
        ctx.fillRect(x.x, x.y, 10, 100); });
   }); //we're pushing a function onto Stack's bindings array which will push "drawing a rectangle" onto StackView's drawOps array 

   this.draw = function() {
       drawOps.forEach(function(x) {  //when we call draw, go through and do everything in drawOps
           x();
       });
   };
};

var Stack = function(xposition, ctx) {
   var array = [];  //unlike my code, in Mary's version, array is not bound to "this," and cannot be directly accessed outside this function
   var bindings = {}; //bindings is an object into which we will put operations and callbacks
   var x = xposition;

   this.push = function(item) {
       item.x=this.x || 20;
       item.y=canvas.height-(dishheight*array.length);
       array.push(item);
       bindings["push"].forEach(function(x) {
           x(item);
       });
   };
   this.pop = function() {
       return array.pop();
   };
   
   this.bind = function(operation, callback) {
       bindings[operation] = bindings[operation] || [];
       bindings[operation].push(callback);
   };
};

Stack.prototype = {   //we don't actually need to put anything in the prototype in this case; we've put everything in the constructor
};


var Dish = function(number, color, x, y){
  this.x = x;
  this.y = y;
  this.color = color;
  this.number = number;

}




//------------------------------------------------------------------------


function main(){
  canvas = document.getElementById('visible-canvas');
  ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 300;

  addEventListener('mousemove', mouseMoved, false);
  addEventListener('click', mouseClicked, false);


  mainstack = new Stack(10, ctx);
  mainstackviewer = new StackView(mainstack, ctx);

  for (var i = 0; i <10; i++) {
    mainstack.push(new Dish(i, 'blue', 10, 10));
  }


  gameLoop();
}

function gameLoop(){
//  processPlayerInput();
//  update GameLogic();
  draw();
  setTimeout(gameLoop, 25);

}



function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'red';
  ctx.fillRect(mouseX,mouseY,10,10);
  ctx.drawImage(playerImg, mouseX, mouseY);

  mainstackviewer.draw();

}



function  mouseMoved(e) {
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
}


function  mouseClicked(e) {
    mouseX = e.layerX;
    mouseY = e.layerY;
}


