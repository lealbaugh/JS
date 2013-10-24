//Images
var dishside = new Image();
dishside.src = "dishside.png";
var smalldish = new Image();
smalldish.src = "smalldish.png";
var plate = new Image();
plate.src = 'dish.png';
var cursor = new Image();
cursor.src = 'cursor.png';
var dirt = new Image();
dirt.src = 'dirt.png';
var eraser = new Image();
eraser.src = 'eraser.png';
var tabletop = new Image();
tabletop.src = 'tabletop.png';
var sink = new Image();
sink.src = 'sink.png';

starlevels = ["gold-star.png", "silver-star.png", "blue-star.png", "no-star.png"]
var star = new Image();
star.src = "no-star.png";


//Settings
var numberofstacks = 4;
var dishheight = 7;
var dishwidth = 125;
var dishvertspacing = 3;
var dishhorspacing = 10;

var backgroundcolor = "#D2E4FC";
var bubblecolor = "#A1C820";
var textcolor = "#333333";


mouseX = -10;
mouseY = -10;
var carrying = false;
var carried;

cleanarea=130;

var dishessofar = 0;
var startingdishes = 6;

var progress = 200000;



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






//Game loops------------------------------------
function main() {
  initialize();
  gameLoop();   //yeah, oh hey, that
}


function initialize() {
  canvas = document.getElementById('visible-canvas');
  ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 300;

  ctx.font = '400 10px Bitter';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';

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
  addEventListener('keypress', addDish, false);

  // backctx.fillStyle= backgroundcolor;
  // backctx.fillRect(0,0,canvas.width, canvas.height);
  backctx.drawImage(sink, 0, 0);




  //initialize stacks and dishes
  dishwidth = (canvas.width-((numberofstacks+1)*dishhorspacing))/numberofstacks;
  stacks = {};
  for (var i = 1; i<=numberofstacks; i++) {
    stacks["stack"+i] = new Stack((i*dishhorspacing)+((i-1)*dishwidth), ctx) //cleverly assign a name using string addition!
  }

  for (var i = 0; i <startingdishes; i++) {
    stacks.stack1.push(new Dish(dishessofar, 'blue', 10, 10));    //let's do this with "for...in" in the next iteration
    dishessofar += 1;
  }

}


function gameLoop() {
//  processPlayerInput(); //right now we're just doing event handling; later we'll add some plates on a timer
//  update GameLogic();
  draw();
  setTimeout(gameLoop, 25);
}


function draw() {
  ctx.fillStyle= backgroundcolor;
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.drawImage(tabletop, 0, canvas.height-tabletop.height);

  frontctx.clearRect(0, 0, middlecanvas.width, middlecanvas.height);  //clear the screen so cursor is updated

  for (var thisstack in stacks){    //go through and draw all the stacks
      stacks[thisstack].draw();
    }

  var secondcanvasmouseY = mouseY-canvas.height;
  
  if (carrying){        //if the mouse cursor should be a plate
      ctx.drawImage(smalldish, mouseX-smalldish.width/2, mouseY-smalldish.height/2);
      wordBubble(carried.number, ctx, mouseX+smalldish.width/2, mouseY-smalldish.height/2);

      frontctx.drawImage(smalldish, mouseX-smalldish.width/2, secondcanvasmouseY-smalldish.height/2);
      wordBubble(carried.number, frontctx, mouseX+smalldish.width/2, secondcanvasmouseY-smalldish.height/2);
    }

  else {
    middlectx.globalCompositeOperation = "destination-out";   //destination-out mode subtracts the source from the destination
    middlectx.drawImage(eraser, mouseX-eraser.width/2, secondcanvasmouseY-eraser.width/2);

    frontctx.drawImage(cursor, mouseX-cursor.width/2, secondcanvasmouseY-cursor.width/2);
    
  }

  frontctx.drawImage(star, frontcanvas.width-star.width, 0);
}








//Update-related functions---------------------------------------------

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
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
}


function  mouseClicked(e) {
  // console.log("click");
  mouseX = e.pageX - canvas.offsetLeft;
  mouseY = e.pageY - canvas.offsetTop;
  
  if(carrying) dropDish();

  else if(mouseY>canvas.height) {
    awardStar();
  }

  else {
    takeDish();
  }

}

function takeDish() {
  for (var thisstack in stacks){
    if(mouseX>stacks[thisstack].x && mouseX<(stacks[thisstack].x+dishwidth)){   //if we're in the horizontal zone of a stack
        carried = stacks[thisstack].pop();
        carrying = true;
    }
  }  
}

function dropDish() {
  if(mouseY>canvas.height) {
    // backctx.drawImage(tabletop, 0, 0);
    backctx.drawImage(plate, backcanvas.width/2-plate.width/2, backcanvas.height/2-plate.height/2);
    middlectx.globalCompositeOperation = "source-over";
    middlectx.drawImage(dirt, middlecanvas.width/2-dirt.width/2, middlecanvas.height/2-dirt.height/2);
    carrying = false;
  }
  else {
    for (var thisstack in stacks){
      if(mouseX>stacks[thisstack].x && mouseX<(stacks[thisstack].x+dishwidth)){   //if we're in the horizontal zone of a stack
        stacks[thisstack].push(carried);
        carrying = false;
      }
    }
  }
}

function awardStar() {
  console.log("checking...");
  progress = checkForBlankness(middlectx, middlecanvas);
  console.log("There are "+progress+" dirty pixels.");
  if (progress<=10) star.src = "gold-star.png";
  else if (progress<=100) star.src = "silver-star.png";
  else if (progress<=3000) star.src = "blue-star.png";
  else star.src = "no-star.png"; 
}


function addDish(e) {
  stacks.stack1.push(new Dish(dishessofar, 'blue', 10, 10));
  dishessofar += 1;
}