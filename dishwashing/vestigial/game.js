var canvas;
var ctx;

var keysDown;
var mouseX = 0;
var mouseY = 0;

var playerImg = new Image();
playerImg.src = 'http://placekitten.com/g/50/50';


var somefunction = function(location){
	var array = [];
	console.log("hi");
}

var thissomefunction = new somefunction(30);

//Stack constructor makes an array and provides push and pop on it
var Stack = function(location){
	this.array = [];
	this.xposition = location; //x position is where on the screen the stack is drawn
	this.push("hi")

	//push, pop, and length are necessary because otherwise external functions can't access array
	this.push = function(item){
		array.push(item);
	}
	this.pop = function(){
		return array.pop();
	}
	this.length = function(){
		return array.length;
	}
}

//Stack prototype modification adds a draw function
//We add this here instead of in the constructor so that it only runs once
Stack.prototype = {
	draw: function(){
		var i;
		for (i = 0; i<this.length(); i+=1) {
					var currentdish = this[i];
			ctx.fillRect(this.xposition,canvas.height-(i*12),50,5);
		}
	},
}

var leftstack = new Stack(50);
leftstack.xposition = 30;
leftstack.array[]


function main(){
	canvas = document.getElementById('visible-canvas');
	ctx = canvas.getContext("2d");
	canvas.width = 600;
	canvas.height = 300;

    addEventListener('mousemove', mouseMoved, false);
    addEventListener('click', mouseClicked, false);



	gameLoop();
}

function gameLoop(){
//	processPlayerInput();
//	update GameLogic();
	draw();
	setTimeout(gameLoop, 25);

}



function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'blue';
	ctx.fillRect(mouseX,mouseY,10,10);
	ctx.drawImage(playerImg, mouseX, mouseY);

	stack.draw();

}



function processPlayerInput(){



}

function  mouseMoved(e) {
    mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
}


function  mouseClicked(e) {
    mouseX = e.layerX;
    mouseY = e.layerY;
}



/*
	keysDown = {};
	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);
*/

/*
//stack wants to have array as its prototype, and just add a draw function
var stack = new Array();
stack.xposition = 10;
stack.draw = function(){
	var i;
	for (i = 0; i<this.length; i+=1) {
				var currentdish = this[i];
		ctx.fillRect(this.xposition,canvas.height-(i*12),50,5);
	}
};

var mainstack = new stack();
mainstack.xposition = 10;
*/
