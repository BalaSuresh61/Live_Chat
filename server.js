const express = require('express');
const path = require('path');
const app =express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const socketConnected = new Set();
app.use(express.static(path.join(__dirname, 'public')));

server.listen(5000,function(){
    console.log("Server Listening on PORT 5000 ");
});

io.on('connection',onConnected)

function onConnected(socket){
    console.log("New Client :"+socket.id);
    socketConnected.add(socket.id);

    io.emit('Client-Total',socketConnected.size)

    socket.on("disconnect",()=>{
        socketConnected.delete(socket.id);
        console.log("client Exit :"+socket.id);
        io.emit('Client-Total',socketConnected.size)

    })
    socket.on('message',(data)=>{
        // console.log(data)
        socket.broadcast.emit('chat_message',data)
    })
    socket.on('feedback',(data)=>{
        console.log(data)
        socket.broadcast.emit('feedbackInServer',(data))
    })

}