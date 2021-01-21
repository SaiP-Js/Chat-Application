var PORT = process.env.PORT || 3000;
var express =require("express");
var app = express();
var http = require ("http").Server(app);

//moment js
var moment =require("moment");
var clientInfo ={};
//socket io module

var io = require("socket.io")(http);

//expose the folfer via express thought
app.use(express.static(__dirname + '/Users/saichandgoudpujari/Downloads/Chat-App/src/com/sai/pujari/CSS/Style.css'));

//send current users to provide socket
function sendCurrentUsers(socket) { //loading current User
var info = clientInfo[socket.id];
var users =[];
if (typeof info === 'undefined'){
return;
}
//filter name based on rooms
Object.keys(clientInfo).forEach(function(socketId){
var userInfo =clientInfo[socketId];
//check id user room and selected room same or not
//as user should see names in only his chat room
if (info.room == userInfo.room){
users.push(userInfo.name);
}
});
//emit messages when all users list

socket.emit("messages" , {
name: "System",
text: "Current Users : " + users.join(','),
timestamp: moment().valueOf()
});
}
//io.on listens for events
io.on("connection", function(socket){
var userdata =clientInfo[socket.id];
if(typeof(userdata ! == undefined)) {
socket.leave(userdata.room); //leave the room
//broadcast leave room to only members of same room.
socket.broadcast.to(userdata.room).emit("message", {
text:userdata.name + "has left",
name: "System",
timestamp: moment().valueOf()
});

//delete user data
delete clientInfo[socket.id];
}
});

//for private chat
socket.on('joinRoom', function(req){
clientInfo[socket.id] =req;
socket.join(req.room);
//broadcast new user joined the room
socket.broadcast.to(req.room).emit("message",{
name: "System",
text: req.name + 'has joined',
timestamp: moment().valueOf()
});
});
//to show who is typing message

socket.on('typing', function(message) {
//broadcast this message to all users in that room
socket.broadcast.to(clientInfo[socket.id].room.emit("typing" , message);
});
//to check if user has seen the message or not
socket.on("UserSeen", function(msg){
socket.broadcast.to(clientInfo[socket.id].room).emit("userSeen", msg);
});


socket.emit("message" , {
text: "Welcome tooo chat application..........!",
timestamp:moment().valueOf(),
name: "System"
});


//listen for client messages
socket.on("message" , function(message){
console.log("Message Received : " + message.text);
//to show all current users
if (message.text === "@currentUsers"){
sendCurrentUsers(socket);
}
else{
//broadcast to all users except for sender
message.timestamp = moment().valueOf();
//socket.broadcast.emit("message", message);
//now message should be only sent to users who are in same room
socket.broadcast.to(clientInfo[socket.id].room).emit("message" , message);
socket.emit.to(clientInfo[socket.id].room).emit("message" , message);
}
});
});
http.listen(PORT,function () {
console.log("server Started");
});












































}})
