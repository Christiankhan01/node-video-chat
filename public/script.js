

//Access Media - video and audio

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '9015'
});

//global variable declation for YOUR video stream 
let myVideoStream

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
})
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})
//listen on 'user-connected' for new user
socket.on('user-connected', (userId) => {
    connectToNewUser(userId);
})

const connectToNewUser = (userId) => {
    console.log("user --> "+ userId + " <-- has joined the room");
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video);
}

