var dishheight = 10;

var canvas;
var ctx;

var keysDown;
var mouseX = 0;
var mouseY = 0;





var StackView = function(stack, ctx) {
   var drawOps = [];
   stack.bind("push", function(x) {
       drawOps.push(function() { ctx.fillRect(x.x, x.y, 10, 100); });
   }); //we're pushing a function onto Stack's bindings array which will push "drawing a rectangle" onto StackView's drawOps array 

   this.draw = function() {
       drawOps.forEach(function(x) {  //when we call draw, go through and do everything in drawOps
           x();
       });
   };
};

var Stack = function(xposition) {
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

Stack.prototype = {
};

var mainstack = new Stack();


var Dish = function(number, color, x, y){


}