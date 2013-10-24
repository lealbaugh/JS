//Game settings, globals------------------------------------------------

var canvas;
var ctx;

var keysDown;
var mouseX = 0;
var mouseY = 0;

var carrying = false;
var carried;

var numberofstacks = 4;
var dishheight = 7;
var dishwidth = 125;
var dishvertspacing = 3;
var dishhorspacing = 10;

var dishside = new Image();
dishside.src = "dishside.png";
var smalldish = new Image();
smalldish.src = "smalldish.png";

var backgroundcolor = "#D2E4FC";
var bubblecolor = "#A1C820";
var textcolor = "#333333";



//Object definitions------------------------------------------------

var StackView = function(stack, ctx) {
   var drawOps = [];
   stack.bind("push", function(x) {
       drawOps.push(function() { //whatever is here will be how a dish is drawn
        ctx.drawImage(dishside, x.x, x.y-dishside.height/2);
        wordBubble(x.number, ctx, x.x+dishside.width, x.y-dishside.height);
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
     bindings["push"].forEach(function(x) {
         x(item);
     });
  };
  this.pop = function() {
      bindings["pop"].forEach(function(x) {
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


function wordBubble(saying, ctx, x, y) {
  ctx.fillStyle = bubblecolor;
  roundRect(ctx, x, y, 22, 12);
  ctx.fill();
  ctx.fillStyle = textcolor;
  ctx.fillText(saying, x+9, y);

}

function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();      
}


var Dish = function(number, color, x, y){
  this.x = x;
  this.y = y;
  this.color = "#ffffff";
  this.number = number;

}




//Game functions------------------------------------------------

function main(){
  initialize();
  gameLoop();   //yeah, oh hey, that
}


function initialize(){
  canvas = document.getElementById('visible-canvas');
  ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 300;

  ctx.font = '400 10px Bitter';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';

  addEventListener('mousemove', mouseMoved, false);
  addEventListener('click', mouseClicked, false);

  dishwidth = (canvas.width-((numberofstacks+1)*dishhorspacing))/numberofstacks;
  stacks = {};
  for (var i = 1; i<=numberofstacks; i++) {
    stacks["stack"+i] = new Stack((i*dishhorspacing)+((i-1)*dishwidth), ctx) //cleverly assign a name using string addition!
  }


  for (var i = 0; i <5; i++) {
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
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle= backgroundcolor;
  ctx.fillRect(0,0,canvas.width, canvas.height);

  for (var thisstack in stacks){    //go through and draw all the stacks
      stacks[thisstack].draw();
    }

  if (carrying){        //if the mouse cursor should be a plate
    ctx.drawImage(smalldish, mouseX-smalldish.width/2, mouseY-smalldish.height/2);
    wordBubble(carried.number, ctx, mouseX+smalldish.width/2, mouseY-smalldish.height/2);
  }
}



function  mouseMoved(e) {     //e is the event handed to us
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
}


function  mouseClicked(e) {
    // console.log("click");
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
