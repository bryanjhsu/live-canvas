// socket.io setting
var socket = io.connect();
// countdown part
var timeleft = 0;

var downloadTimer = setInterval(function() {
  var value = 10 - timeleft;
  timeleft++;
  document.getElementById('countdown').innerHTML = value;
  if (value <= 0) {
    value = 10;
    timeleft = 0;
  }
}, 1000);

var currX = 0;
var currY = 0;
var pixelSize = 10;

var r = Math.floor(Math.random()*255);
var g = Math.floor(Math.random()*255);
var b = Math.floor(Math.random()*255);


var grid_width = 1000;
var grid_height = 500;

function setup() {
  background(255);
  var canvas = createCanvas(grid_width, grid_height);

  for (var i = 0; i < width; i += pixelSize) {
    for (var j = 0; j < height; j += pixelSize) {
      noFill();
      stroke(200);
      strokeWeight(0.5);
      rect(i, j, pixelSize, pixelSize);
    }
  }

  var yourColorClass = "";
  if(Math.random() < 0.5)
  {
    yourColorClass = "red";
    console.log("you are on the red team");
  }
  else
  {
    yourColorClass = "blue";
    console.log("you are on the blue team");
  }
  drawingInit(yourColorClass);
}

socket.on('init', function(data) {
  console.log(data);
  for(var i = 0; i < 100; i++)
  {
    for(var j = 0; j < 50; j++)
    {
      var color = data[i][j];
      fill(color.r, color.g, color.b);
      rect(i*pixelSize, j*pixelSize, pixelSize, pixelSize)
    }
  }
});

socket.on('draw', function(data) {
  console.log(data);
  noStroke();
  fill(data.colR, data.colG, data.colB);
  rect(data.posX, data.posY, pixelSize, pixelSize)
});

var r, g, b;

function drawingInit(color) {

  if(color == "red")
  {
    currX = floor(random(width/ 2 / pixelSize)) * pixelSize;
    currY = floor(random(height / pixelSize)) * pixelSize;

    r = 255;
    b = 0;
    g = 0;
    // g = Math.floor(Math.random()*255);
    // b = Math.floor(Math.random()*255);
  }
  else
  {
    currX = floor(random(width / 2 / pixelSize) + grid_width/20) * pixelSize;
    currY = floor(random(height / pixelSize)) * pixelSize;

    r = 0
    g = 0
    b = 255;
  }
  
  var data = {
    posX: currX,
    posY: currY,
    colR: r,
    colG: g,
    colB: b
  };

  fill(data.colR, data.colG, data.colB);
  rect(data.posX, data.posY, pixelSize, pixelSize)
  socket.emit('draw', data);
}

function keyPressed() {
  // console.log(keyCode);
  var isMoved = false;
  if (keyCode == UP_ARROW || keyCode == 87) {
    if(currY > 0)
    {
      currY -= pixelSize;
      isMoved = true;
    }
  } else if (keyCode == DOWN_ARROW || keyCode == 83) {
    if(currY < grid_height-10)
    {
      currY += pixelSize;
      isMoved = true;
    }
  } else if (keyCode == RIGHT_ARROW || keyCode == 68) {
    if(currX < grid_width-10)
    {
      currX += pixelSize;
      isMoved = true;
    }
  } else if (keyCode == LEFT_ARROW || keyCode == 65) {
    if(currX > 0)
    {
      currX -= pixelSize;
      isMoved = true;
    }
  }

  if(isMoved)
  {
    var data = {
      posX: currX,
      posY: currY,
      colR: r,
      colG: g,
      colB: b
    };

    fill(0);
    rect(data.posX, data.posY, pixelSize, pixelSize)

    socket.emit('draw', data);
  };

  return false;
}