const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    //RoomID
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {
        roomId: req.params.room
    })
})

io.on('connection', socket => {
    socket.on('disconnecting', () => {
        console.log(socket.rooms);
    });
    socket.on('disconnect', () => {
        console.log("user disconnected...Goodbye");
    })
    //user joins room here - emit accepted - 'userId' has connected
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        //broadcast to room that user has connected 
        socket.to(roomId).broadcast.emit('user-connected', userId);
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message);
            

            
        })
    })
})

server.listen(9015); 