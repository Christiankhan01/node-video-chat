//Access Media - video and audio
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

//global variable declation for YOUR video stream 
let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    //new user calls us
    peer.on('call', call => {
        call.answer(stream) //answer call
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream) //add new user to YOUR video stream
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

    let text = $('input')
    $('html').keydown((e) => { //if a key is pressed
        if (e.which == 13 && text.val().length !== 0) { //and that key is ENTER and the value of the message !== 0
            console.log(text.val());
            socket.emit('message', text.val()); //emit the message
            text.val('')//then reset/clear input 
        }
    });
    //send message to server
    socket.on('createMessage', message => {
        $('ul').append(`<li class="message"><b>user1</b><br/>${message}</li>`)
    })
})
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream) //call new user
    const video = document.createElement('video') //create new video stream
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream) //send new user Your stream
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video);
}

//scroll to bottom of chat window to read new msgs 
const scrollToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();

    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html =
        `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html =
        `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

const setStopVideo = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}



