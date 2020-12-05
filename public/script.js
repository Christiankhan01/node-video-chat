//Access Media - video and audio
const socket = io('/'); 
const videoGrid = document.getElementById('video-grid'); 
const myVideo = document.createElement('video'); 
myVideo.muted = true; 

//global variable declation for YOUR video stream 
let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true, 
    audio: true 
}).then(stream => {
    myVideoStream = stream; 
    addVideoStream(myVideo, stream)
})

socket.emit('join-room'); 

const addVideoStream = (video, stream) => {
    video.srcObject = stream; 
    video.addEventListener('loadedmetadata', () => {
        video.play() 
    })
    videoGrid.append(video); 
}

