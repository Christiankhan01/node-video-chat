//Access Media - video and audio

const videoGrid = document.getElementById('video-grid'); 
const myVideo = document.createElement('video'); 
myVideo.muted = true; 

//global variable declation
let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true, 
    audio: false 
}).then(stream => {
    myVideoStream = stream; 
    addVideoStream(myVideo, stream)
} )

const addVideoStream = (video, stream) => {
    video.srcObject = stream; 
    video.addEventListener('loadedmetadata', () => {
        video.play() 
    })
    videoGrid.append(video); 
}

