var express = require('express'),
path = require("path"),
soc = require('socket.io');
var app = express();
var router = express.Router();
app.use(express.static(path.join(__dirname,"views")));
var port = process.env.port || 8080;
var server = app.listen(port,function(){
    console.log("Server started")
});
var io = soc.listen(server);
var users = [];
var connections = [];
app.get("/",function(req,res){
    res.sendFile(__dirname+"/login.html");
  // res.write("Welcome");
   //res.end();
});

io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log("Length  :"+connections.length);

    socket.on('disconnect',function(data){
        console.log("User name :"+socket.username)
        if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1)
        connections.splice(connections.indexOf(socket),1);
        console.log("Length :"+connections.length);
    });

    socket.on('send message',function(data){
        console.log("Data "+data)
        io.sockets.emit('new message',{msg:data,user:socket.username})
    })

    socket.on('new user',function(data,callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    })

    function updateUsernames(){
        io.sockets.emit('get users',users)
    }
});