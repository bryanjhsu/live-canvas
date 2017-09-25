// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8082);

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

var pixelSize = 10;
var r, g, b;
var board_width = 1000;
var board_height = 500;
var board = [];

for(var i = 0; i < board_width/pixelSize; i++)
{
  board[i] = [];
  for(var j = 0; j < board_height/pixelSize; j++)
  {
    console.log("setting color to: " + i);
    if(i >45 && i<55)
    {
      var colorData = 
      {
        r: 100,
        b: 100,
        g: 100,
      }
      board[i][j] = colorData;
    }
    else
    {
      var colorData = {
          r: 255,
          b: 255,
          g: 255,
        };

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
    socket.emit("init", board);

    socket.on('draw', function(data) {
      // Data comes in as whatever was sent, including objects
      console.log(data.posX, data.posY, data.colR, data.colG, data.colB);
      // Send it to all of the clients
      var color = {
          r: data.colR,
          b: data.colB,
          g: data.colG,
        };
      console.log(board.length);
      board[data.posX/10][data.posY/10] = color;
      io.sockets.emit('draw', data);
    });
  }
);
