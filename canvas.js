// socket.io setting
var socket = io.connect();


// countdown part
var timeleft = 0;
// var downloadTimer = setInterval(function() {
//   var value = 10 - timeleft;
//   timeleft++;
//   document.getElementById('countdown').innerHTML = value;
//   if (value <= 0) {
//     value = 10;
//     timeleft = 0;
//   }
// }, 1000);


//my snake settings
//position + color
var currX = 0;
var currY = 0;
var r = Math.floor(Math.random()*255);
var g = Math.floor(Math.random()*255);
var b = Math.floor(Math.random()*255);

//grid settings
var pixelSize = 10;
var grid_width = 1000;
var grid_height = 500;

//draw grid and choose color
//TODO: change random color to choice from younho's question page
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


//receive on first load of the page. draws the live board
socket.on('init', function(data) {
  // console.log(data);
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

//will receive every time server receives a new draw message from any client
//updates board with live colors
socket.on('draw', function(data) {
  noStroke();
  fill(data.colR, data.colG, data.colB);
  rect(data.posX, data.posY, pixelSize, pixelSize)
});

//will receive every 10 seconds from server, updating the red and blue counts;
//data.reds and data.blues to get count of each
socket.on('update', function(data) {
  console.log("red count: " + data.reds);
  console.log("blue count: " + data.blues);
});



var r, g, b;
//initialize board with client "snake" 
//emits to server to update this client's snake position
function drawingInit(color) {

  if(color == "red")
  {
    currX = floor(random(width/ 2 / pixelSize)) * pixelSize;
    currY = floor(random(height / pixelSize)) * pixelSize;

    r = 255-Math.floor(Math.random()*20);;
    g = Math.floor(Math.random()*120);
    b = Math.floor(Math.random()*120);

  }
  else //blue
  {
    currX = floor(random(width / 2 / pixelSize) + grid_width/20) * pixelSize;
    currY = floor(random(height / pixelSize)) * pixelSize;

    r = Math.floor(Math.random()*120);
    g = Math.floor(Math.random()*120);
    b = 255-Math.floor(Math.random()*20);
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

//draw the pixel path for current user
//shows black square for local view
//live view will eventually overwrite black square with myColor square
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