// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(9999);

function requestHandler(req, res) {

  var parsedUrl = url.parse(req.url);
  console.log("The Request is: " + parsedUrl.pathname);

  fs.readFile(__dirname + parsedUrl.pathname,
    // Callback function for reading
    function(err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + parsedUrl.pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200);
      res.end(data);
    }
  );

}

//set up board
var pixelSize = 10;
var board_width = 1000;
var board_height = 500;
var board = [];
var r, g, b;
for(var i = 0; i < board_width/pixelSize; i++)
{
  board[i] = [];
  for(var j = 0; j < board_height/pixelSize; j++)
  {
    if(i != 49)
    {
      var colorData = {
          r: 255,
          b: 255,
          g: 255,
        };
      board[i][j] = colorData;
    }
    else
    {
      var colorData = 
      {
        r: 210,
        b: 210,
        g: 210,
      }
        board[i][j] = colorData;
    }
  }
}

// WebSocket Portion
var io = require('socket.io').listen(httpServer);

io.sockets.on('connection',
  // We are given a websocket object in our function
  function(socket) {
    console.log("We have a new client: " + socket.id);
    //emit on first connect
    socket.emit("init", board);

    //emit every 5 seconds to update clients with color count
    setInterval(function() {
      var redCount = 0;
      var blueCount = 0;
        for(var x = 0; x < 100; x++)
        {
          for(var y = 0; y < 50; y++)
          {
            var squareColorData  = board[x][y];
            
            if(squareColorData.r > 220 && squareColorData.b < 150)
            {
              redCount++;
            }
            else if(squareColorData.b > 220 && squareColorData.r < 150)
            {
              blueCount++;
            }
          }
        }
        var countData = {
          reds: redCount,
          blues: blueCount
        };
      io.sockets.emit("update", countData);
    }, 5000);

    //receive snake data from client and emit same data to all clients
    socket.on('draw', function(data) {
      var color = {
          r: data.colR,
          b: data.colB,
          g: data.colG,
        };
      board[data.posX/10][data.posY/10] = color;
      io.sockets.emit('draw', data);
    });
  }
);

