

var KEYCODE_UP = 38;                
var KEYCODE_DOWN = 40;                
var KEYCODE_LEFT = 37;  
var KEYCODE_RIGHT = 39;        

var scale = 4;

document.onkeydown = handleKeyDown;

var wd;
var ht;
var loader;
var turtle;

function init() {
  stage = new createjs.Stage("pixbot");

  wd = stage.canvas.width;
  ht = stage.canvas.height;

  var context = stage.canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;

  manifest = [
    {src:"assets/arrow.png", id:"arrow"},
    {src:"assets/turtle.png", id:"turtle"},
    {src:"assets/go.png", id:"go"}
  ];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleComplete);
  loader.loadManifest(manifest);
}

var grid;
var program;
var palette;

var command_list = [];

var arrow;
var go_button;

var turtle;
var tile_wd = 80;
var tile_ht = tile_wd;
var grid_x = 4;
var grid_y = 4;

var grid_x_min = 1;
var grid_y_min = 0;
var grid_x_max = 12;
var grid_y_max = 8;

var prog_x_min = 1;
var prog_y_min = 8;
var prog_x_max = 12;
var prog_y_max = 9;

var pad = 4;

// TODO this and CommandMove I think will merge
function Item(name, x, y) {
  this.im = new createjs.Bitmap(loader.getResult(name));
  var bounds = this.im.getBounds();
  this.im.scaleX = tile_wd/bounds.width;
  this.im.scaleY = tile_wd/bounds.height;
  this.im.x = x * tile_wd;
  this.im.y = y * tile_wd;
  console.log("new " + name + " at " + x + " " + y);
  
}

function CommandMove() {
  var arr = new Item("arrow", prog_x_min * command_list.length, prog_y_min);
  program.addChild(arr.im);
} // CommandMove

function drawGrid() {
  
  for (var i = grid_x_min; i < grid_x_max; i++) {
    for (var j = grid_y_min; j < grid_y_max; j++) {
      var cell = new createjs.Shape();
      cell.x = i * tile_wd;
      cell.y = j * tile_wd;
      cell.graphics.beginFill("#cccccc").drawRect(pad, pad, tile_wd - pad, tile_ht - pad);
      grid.addChild(cell);
    }
  }
}


function drawProgram() {
  
  for (var i = prog_x_min; i < prog_x_max; i++) {
    for (var j = prog_y_min; j < prog_y_max; j++) {
      var cell = new createjs.Shape();
      cell.x = i * tile_wd;
      cell.y = j * tile_wd;
      cell.graphics.beginFill("#bbffbb").drawRect(pad, pad, tile_wd - pad, tile_ht - pad);
      program.addChild(cell);
    }
  }
}

function handleComplete() {
  
  grid = new createjs.Container();
  stage.addChild(grid);
  drawGrid();
 
  program = new createjs.Container();
  stage.addChild(program);
  drawProgram();

  arrow = new Item("arrow", 0, 1);
  //arrow.im.addEventListener("click", function(event) {
  //  command_list.push(new CommandMove());
  // }); 
  stage.addChild(arrow.im);

  go_button = new Item("go", 0, grid_y_max - 1);
  stage.addChild(go_button.im);

  {
  turtle = new createjs.Bitmap(loader.getResult("turtle"));
  var bounds = turtle.getBounds();
  turtle.scaleX = tile_wd/bounds.width;
  turtle.scaleY = tile_wd/bounds.height;
  turtle.x = tile_wd * grid_x;
  turtle.y = tile_wd * grid_y;
  stage.addChild(turtle);
  }

  stage.update();

  createjs.Ticker.on("tick", tick);
  createjs.Ticker.setFPS(5);
}

var update = false;

function tick(event) {
  
  if (update) {
  turtle.x = tile_wd * grid_x;
  turtle.y = tile_wd * grid_y;
  update = false;
  }
  stage.update(event);
}

function handleKeyDown(e) {
  // cross browse issue?
  if (!e) { var e = window.event; }

  var step = scale;
  if (update === false) {
  switch (e.keyCode) {
    case KEYCODE_LEFT:
      grid_x -= 1;
      if (grid_x < grid_x_min) {
        grid_x = grid_x_min;
      }
      update = true;
      return false;
    case KEYCODE_RIGHT:
      grid_x += 1;
      if (grid_x >= grid_x_max) {
        grid_x = grid_x_max - 1;
      }
      update = true;
      return false;
   case KEYCODE_UP:
      grid_y -= 1;
      if (grid_y < grid_y_min) {
        grid_y = grid_y_min;
      }
      update = true;

      command_list.push(new CommandMove());
      return false;
   case KEYCODE_DOWN:
      grid_y += 1;
      if (grid_y >= grid_y_max) {
        grid_y = grid_y_max - 1;
      }
      update = true;
      return false;
  }
  }
}

