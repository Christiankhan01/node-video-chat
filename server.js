const express = require('express');
const app = express(); 
const server = require('http').Server(app); 
const io = require('socket.io')(server); 
const {v4: uuidv4} = require('uuid'); 

app.set('view engine', 'ejs'); 
app.use(express.static('public')); 




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
    //user joins room here - emit accepted
    socket.on('join-room', () => {
        console.log("Joined Room"); 
    })
})

server.listen(9015); 