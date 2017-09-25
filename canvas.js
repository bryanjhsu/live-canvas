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

    var row = 10;
    var col = 10;

    function setup() {
      background(255);
      var canvas = createCanvas(500, 500);

      for (var i = 0; i < width; i += col) {
        for (var j = 0; j < height; j += row) {

          if(i == 250)
          {
            fill(0);
          }
          fill(255);
          stroke(200);
          strokeWeight(0.5);
          rect(i, j, row, col);
        }
      }
      drawingInit();
    }

    socket.on('init', function(data) {
      console.log(data);
      for(var i = 0; i < 50; i++)
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
      currX = data.posX;
      fill(data.colR, data.colG, data.colB);
      rect(data.posX, data.posY, pixelSize, pixelSize)
    });

    function drawingInit() {
      currX = floor(random(width / col)) * col;
      currY = floor(random(height / row)) * row;
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
        if(currY < 490)
        {
          currY += pixelSize;
          isMoved = true;
        }
      } else if (keyCode == RIGHT_ARROW || keyCode == 68) {
        if(currX < 490)
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

        fill(data.colR, data.colG, data.colB);
        rect(data.posX, data.posY, pixelSize, pixelSize)

        socket.emit('draw', data);
      };

      return false;
    }