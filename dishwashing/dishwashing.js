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
     item.y= stackscanvas.height-((dishheight+dishvertspacing)*(array.length+1));
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
  var width = 22;
  var height = 12;
  roundRect(ctx, x, y, width, height);
  ctx.fill();
  ctx.fillStyle = textcolor;
  ctx.fillText(saying, x+(width/2), y);

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
  stackscanvas = document.getElementById('stacks-canvas');
  stacksctx = stackscanvas.getContext("2d");
  stackscanvas.width = 600;
  stackscanvas.height = 300;

  stacksctx.font = '400 10px Bitter';
  stacksctx.textBaseline = 'top';
  stacksctx.textAlign = 'center';

  cursorcanvas = document.getElementById('cursor-canvas');
  cursorctx = cursorcanvas.getContext("2d");
  cursorcanvas.width = 600;
  cursorcanvas.height = 600;

  cursorctx.font = '400 10px Bitter';
  cursorctx.textBaseline = 'top';
  cursorctx.textAlign = 'center';

  dirtcanvas = document.getElementById('dirt-canvas');
  dirtctx = dirtcanvas.getContext("2d");
  dirtcanvas.width = 600;
  dirtcanvas.height = 300;

  sinkcanvas = document.getElementById('sink-canvas');
  sinkctx = sinkcanvas.getContext("2d");
  sinkcanvas.width = 600;
  sinkcanvas.height = 300;

  addEventListener('mousemove', mouseMoved, false);
  addEventListener('click', mouseClicked, false);
  addEventListener('keypress', addDish, false);

  // sinkctx.fillStyle= backgroundcolor;
  // sinkctx.fillRect(0,0,canvas.width, canvas.height);
  sinkctx.drawImage(sink, 0, 0);




  //initialize stacks and dishes
  dishwidth = (stackscanvas.width-((numberofstacks+1)*dishhorspacing))/numberofstacks;
  stacks = {};
  for (var i = 1; i<=numberofstacks; i++) {
    stacks["stack"+i] = new Stack((i*dishhorspacing)+((i-1)*dishwidth), stacksctx) //cleverly assign a name using string addition!
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
  stacksctx.fillStyle= backgroundcolor;
  stacksctx.fillRect(0,0,stackscanvas.width, stackscanvas.height);
  stacksctx.drawImage(tabletop, 0, stackscanvas.height-tabletop.height);

  cursorctx.clearRect(0, 0, cursorcanvas.width, cursorcanvas.height);  //clear the screen so cursor is updated

  for (var thisstack in stacks){    //go through and draw all the stacks
      stacks[thisstack].draw();
    }

  var secondcanvasmouseY = mouseY-stackscanvas.height;
  
  if (carrying){        //if the mouse cursor should be a plate
      cursorctx.drawImage(smalldish, mouseX-smalldish.width/2, mouseY-smalldish.height/2);
      wordBubble(carried.number, cursorctx, mouseX+smalldish.width/2, mouseY-smalldish.height/2);

      // cursorctx.drawImage(smalldish, mouseX-smalldish.width/2, secondcanvasmouseY-smalldish.height/2);
      // wordBubble(carried.number, cursorctx, mouseX+smalldish.width/2, secondcanvasmouseY-smalldish.height/2);
    }

  else {
    dirtctx.globalCompositeOperation = "destination-out";   //destination-out mode subtracts the source from the destination
    dirtctx.drawImage(eraser, mouseX-eraser.width/2, secondcanvasmouseY-eraser.width/2);

    cursorctx.drawImage(cursor, mouseX-cursor.width/2, mouseY-cursor.width/2);
    
  }

  cursorctx.drawImage(star, cursorcanvas.width-star.width, 0);
}








//Update-related functions---------------------------------------------

function checkForBlankness(context, canvas) {
  var dirtypixels = 0;
  var pixels = dirtctx.getImageData(dirtcanvas.width/2-cleanarea, dirtcanvas.height/2-cleanarea, 2*cleanarea, 2*cleanarea).data;
  var pixellength = pixels.length;
  for (var i =0; i<pixellength; i+=4) {
    if(pixels[i+3] !== 0) { //i+3 should catch the indices of the alpha value
      dirtypixels+=1;
      }
  }
  return dirtypixels;
}

function showpixel() {
  var pixels = dirtctx.getImageData(0,0,dirtcanvas.width, dirtcanvas.height);
  return pixels;
}


function  mouseMoved(e) {     //e is the event handed to us
    mouseX = e.pageX - cursorcanvas.offsetLeft;
    mouseY = e.pageY - cursorcanvas.offsetTop;
}


function  mouseClicked(e) {
  // console.log("click");
  mouseX = e.pageX - cursorcanvas.offsetLeft;
  mouseY = e.pageY - cursorcanvas.offsetTop;
  
  if(carrying) dropDish();

  else if(mouseY>stackscanvas.height) {
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
        if (carried) carrying = true;   //check to see if we actually popped anything
    }
  }  
}

function dropDish() {
  if(mouseY>stackscanvas.height) {
    // sinkctx.drawImage(tabletop, 0, 0);
    sinkctx.drawImage(plate, sinkcanvas.width/2-plate.width/2, sinkcanvas.height/2-plate.height/2);
    dirtctx.globalCompositeOperation = "source-over";
    dirtctx.drawImage(dirt, dirtcanvas.width/2-dirt.width/2, dirtcanvas.height/2-dirt.height/2);
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
  progress = checkForBlankness(dirtctx, dirtcanvas);
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