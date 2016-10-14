var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const util = require('util')

var userList = [];

app.get('/', function(req, res){
  res.send('<h1> Real Time Server</h1>');
});

var port = process.env.PORT || 3000

http.listen(port, function(){
  console.log('Listening on *: ' + port);
});

io.on('connection', function(clientSocket){
  console.log('a user connected');


  console.log("socket id: " + clientSocket.id);

  clientSocket.on("connectUser", function(userID) {
      var message = "User " + userID + " was connected.";
      console.log(message);

      var userInfo = {};
      var foundUser = false;

      //Check if user already exist
      for (var i=0; i<userList.length; i++) {
        if (userList[i]["parse_id"] == userID) {
          userList[i]["isConnected"] = true
          userList[i]["socket_id"] = clientSocket.id;
          userInfo = userList[i];
          foundUser = true;
          break;
        }
      }

      //create new user if non-existent
      if (!foundUser) {
        userInfo["socket_id"] = clientSocket.id;
        userInfo["parse_id"] = userID;
        userInfo["isConnected"] = true
        userList.push(userInfo);
      }

      //Emit userList to show who is online or not
      io.emit("userConnectUpdate", userInfo)
  });

  clientSocket.on('disconnect', function(){
    console.log('user disconnected');
    
  });
  
  clientSocket.on("driverChangedLocation", function(data){
    var userID = data.userID
    delete data.userID;
    console.log(util.inspect("Emitting driver location update to user "+ userID, false, null))
    io.emit("driverLocationUpdateFor:" + userID, data);
  });

   clientSocket.on("tripStatus", function(data){
    var userID = data.userID;
    var status = data.status;
    delete data.userID;
    console.log(util.inspect("Sending trip status " + status + " to user channel "+ userID, false, null))
    io.emit("userChannel:" + userID, data);
  });

});
