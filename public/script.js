

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
    
    peer.on('call', call => {
        call.answer(stream)
        const video=document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    //listen on 'user-connected' for new user
    socket.on('user-connected', (userId) => {
        /**
        **passing the stream of the original user to the socket {look in promise}
        **to be passed to all other users in room
        */
        connectToNewUser(userId, stream);
    })
})
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream) //call new user
    const video = document.createElement('video') //create new video stream
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream) 
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video);
}

