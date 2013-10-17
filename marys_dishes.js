//Game settings, globals

var canvas;
var ctx;

var keysDown;
var mouseX = 0;
var mouseY = 0;

var carrying = false;
var carried;

var numberofstacks = 3;
var dishheight = 7;
var dishwidth = 50;
var dishvertspacing = 3;
var dishhorspacing = 10;



//Object definitions

var StackView = function(stack, ctx) {
   var drawOps = [];
   stack.bind("push", function(x) {
       drawOps.push(function() { 
        ctx.fillStyle= x.color;
        ctx.fillRect(x.x, x.y, dishwidth, dishheight); 
      });
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

        for (var stack in stacks){
          for (var i=0; i<stacks[stack].length(); i++){
            console.log(stacks[stack].all()[i].color);
          }     
        }

     bindings["push"].forEach(function(x) {
         x(item);
     });
  };
  this.pop = function() {
      bindings["pop"].forEach(function(x) { //apparently this is not really necessary? unclear
         x();
     });
     return array.pop();
  };
  this.bind = function(operation, callback) {
     bindings[operation] = bindings[operation] || [];
     bindings[operation].push(callback);
  };
  this.length = function(){
      return array.length;
  }
  this.all = function(){
    return array;
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
  this.color = (Math.random().toString(16) + '000000').slice(2, 8);
  //['red','blue','green','cyan','orange','black','purple','yellow'][Math.floor(Math.random()*8)]
  this.number = number;

}




//Game functions

function main(){
  initialize();
  gameLoop();   //yeah, oh hey, that
}


function initialize(){
  canvas = document.getElementById('visible-canvas');
  ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 300;

  addEventListener('mousemove', mouseMoved, false);
  addEventListener('click', mouseClicked, false);

  dishwidth = (canvas.width-(numberofstacks*dishhorspacing))/numberofstacks;
  stacks = {};
  for (var i = 1; i<=numberofstacks; i++) {
    console.log((i*dishhorspacing)+((i-1)*dishwidth))
    stacks["stack"+i] = new Stack((i*dishhorspacing)+((i-1)*dishwidth), ctx) //cleverly assign a name using string addition!
  }


  for (var i = 0; i <2; i++) {
    stacks.stack1.push(new Dish(i, 'blue', 10, 10));    //let's do this with "for...in" in the next iteration
  }

  for (var i = 0; i <2; i++) {
    stacks.stack2.push(new Dish(i, 'blue', 10, 10));
  }
}


function gameLoop(){
//  processPlayerInput(); //right now we're just doing event handling; later we'll add some plates on a timer
//  update GameLogic();
  draw();
  setTimeout(gameLoop, 25);
}


function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var thisstack in stacks){    //go through and draw all the stacks
      stacks[thisstack].draw();
    }

  if (carrying){        //if the mouse cursor should be a plate
    ctx.fillStyle = carried.color;
    ctx.fillRect(mouseX,mouseY, dishwidth,dishwidth);
  }
}


function  mouseMoved(e) {     //e is the event handed to us
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
}


function  mouseClicked(e) {
    console.log("click");
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
    for (var thisstack in stacks){
      if(mouseX>stacks[thisstack].x && mouseX<(stacks[thisstack].x+dishwidth)){   //if we're in the horizontal zone of a stack
        if(carrying){
          stacks[thisstack].push(carried);
          carrying = false;
        }
        else{
          carried = stacks[thisstack].pop();
          carrying = true;
        }
      }
    }
}
