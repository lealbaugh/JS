//Game settings, globals

var dishheight = 7;
var dishwidth = 50;
var dishvertspacing = 3;
var dishhorspacing = 10;

var canvas;
var ctx;

var keysDown;
var mouseX = 0;
var mouseY = 0;

var carrying = false;
var carried;


//Object definitions


var StackView = function(stack, ctx) {
   var drawOps = [];
   stack.bind("push", function(x) {
       drawOps.push(function() { 
        ctx.fillStyle= x.color;
        ctx.fillRect(x.x, x.y, dishwidth, dishheight); });
   }); //we're pushing a function onto Stack's bindings array which will push "drawing a rectangle" onto StackView's drawOps array 

    stack.bind("pop", function(x) {
       drawOps.pop();
   }); //does this pop off the last rectangle? 

   this.draw = function() {
       drawOps.forEach(function(x) {  //when we call draw, go through and do everything in drawOps
           x();
       });
   };
};

var Stack = function(xposition, ctx) {
  var array = [];  //unlike my code, in Mary's version, array is not bound to "this," and cannot be directly accessed outside this function
  var bindings = {}; //bindings is an object into which we will put operations and callbacks
  this.x = xposition;

  this.push = function(item) {
     item.x= this.x || 20;
     item.y= canvas.height-((dishheight+dishvertspacing)*(array.length+1));
     array.push(item);
     bindings["push"].forEach(function(x) {
         x(item);
     });
  };
  this.pop = function() {
    // bindings["pop"].forEach(function(x) {
    //     x();
    // });
     return array.pop();
  };
  this.bind = function(operation, callback) {
     bindings[operation] = bindings[operation] || [];
     bindings[operation].push(callback);
  };
  this.length = function(){
      return array.length;
  }

  var stackview = new StackView(this, ctx);
  this.draw = function(){
    stackview.draw();
  }
};

Stack.prototype = {   //we don't actually need to put anything in the prototype in this case; we've put everything in the constructor
};


var Dish = function(number, color, x, y){
  this.x = x;
  this.y = y;
  this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
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


  stacks = {
    firststack: new Stack(dishhorspacing, ctx),
    secondstack: new Stack((2*dishhorspacing)+dishwidth, ctx),
    thirdstack: new Stack((3*dishhorspacing)+(2*dishwidth), ctx),
    fourthstack: new Stack((4*dishhorspacing)+(3*dishwidth), ctx),
    fifthstck: new Stack((5*dishhorspacing)+(4*dishwidth), ctx),
  }

  for (var i = 0; i <5; i++) {
    stacks.firststack.push(new Dish(i, 'blue', 10, 10));
  }

  for (var i = 0; i <5; i++) {
    stacks.secondstack.push(new Dish(i, 'blue', 10, 10));
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

  // ctx.drawImage(playerImg, mouseX, mouseY);

  for (thisstack in stacks){
      stacks[thisstack].draw();
    }
  if (carrying){
    ctx.fillStyle = carried.color;
    ctx.fillRect(mouseX,mouseY, dishwidth,dishwidth);
  }
}



function  mouseMoved(e) {
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
}


function  mouseClicked(e) {
    console.log("click");
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
    for (thisstack in stacks){
      if(mouseX>stacks[thisstack].x && mouseX<(stacks[thisstack].x+dishwidth)){
        console.log(carrying);
        if(carrying){
          stacks[thisstack].push(carried);
          carrying = false;
        }
        else{
          carried = stacks[thisstack].pop();
          console.log(carried.color);
          carrying = true;
        }
      }
    }

}


    // if (mouseX<100){
    //   if (stacks.firststack.length()>0){
    //    stacks.secondstack.push(stacks.firststack.pop());
    //   }
    // }
    // else stacks.firststack.push(new Dish(10, 'blue', 10, 10));

