var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
  res.send('<h1> Real Time Server</h1>');
});

var port = process.env.PORT || 3000

http.listen(port, function(){
  console.log('Listening on *: ' + port);
});

io.on('connection', function(clientSocket){
  console.log('a user connected');

  io.emit("test", "my name is obrien");

  clientSocket.on('disconnect', function(){
    console.log('user disconnected');
    
  });
  
  clientSocket.on("driverChangedLocation", function(location){
    console.log("Driver changed to " + location + " ");
    io.emit("driverLocationUpdate", location);
  });

});
