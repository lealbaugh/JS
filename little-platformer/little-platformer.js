friction = 0.95;
gravity = 1.0;

var Player = function(){
	var xposition = canvas.width/2;
	var yposition = canvas.height/2;
	var xvelocity = 0.0;
	var yvelocity = 0.0;
	var xacceleration = 0.0;
	var yacceleration = 0.0;
	var width = 10;
	var height = 20;

	this.draw = function(){
		ctx.fillStyle = "yellow";
		ctx.fillRect(xposition-width/2, yposition-height, width, height);
	}
	this.update = function(){
		yacceleration +=gravity;
		if (Math.abs(xacceleration)-Math.abs(friction) > 0){
			xacceleration +=friction;
		}
		
		// xvelocity += xacceleration;
		yvelocity += yacceleration;
		xposition += xvelocity;
		yposition += yvelocity;

		if (yposition > canvas.height) {
			yvelocity = 0;
			yposition = canvas.height;
			}

	}
	this.moveRight = function() {
		console.log("right!");
		xvelocity = 2;
	}
	this.moveUp = function() {
		console.log("up!");
		if (yvelocity >= 0) yacceleration = -5;
	}
	this.moveDown = function() {
		// console.log("down!");
		// yposition = yposition + 10;	
	}
	this.moveLeft = function() {
		console.log("left!");
		xvelocity = -2;	
	}
	this.moveStop = function() {
		console.log("stop!");
		xvelocity = 0;	
	}
}

function main() {
	init();
	gameLoop();
}

function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext("2d");
	canvas.height = window.innerHeight-100;
	canvas.width = window.innerWidth-100;
	ctx.fillStyle = "333399";
	ctx.fillRect(0,0,canvas.width, canvas.height);

	addEventListener('keydown', keydown, false); //boolean is for "capturing vs bubbling"
	addEventListener('keyup', keyup, false);
	player = new Player();


}

function gameLoop() {
	gameLogic();
	draw();
	setTimeout(gameLoop, 25);
}

function gameLogic() {
	player.update();


}

function draw() {
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.fillStyle = "333399";
	ctx.fillRect(0,0,canvas.width, canvas.height);

	player.draw();
}

function  mouseMoved(e) {     //e is the event handed to us
    mouseX = e.pageX - cursorcanvas.offsetLeft;
    mouseY = e.pageY - cursorcanvas.offsetTop;
}

function keydown(e){
	switch (e.which) {
		case 37:  //left arrow
		case 65:
			player.moveLeft();
			break;
		case 38:
		case 32:
		case 87:
			player.moveUp();
			break;
		case 39:
		case 68:
			player.moveRight();
			break;
		case 40:
			player.moveDown();
			break;
		default:
			break;
	}
}

function keyup(e){
	switch (e.which) {
		case 37:  //left arrow
		case 65:
			player.moveStop();
			break;
		case 39:
		case 68:
			player.moveStop();
			break;
		default:
			break;
	}
}









		// if (xvelocity>0){
		// 	friction = -2.0;

		// }
		// else if (xvelocity<0){
		// 	friction = 2.0;
		// }
		// else friction =0;
		// console.log(friction);

		// friction = -xvelocity/;
		// // if (xacceleration - friction
		// 	xacceleration +=friction;
