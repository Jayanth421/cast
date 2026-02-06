const socket = io();
let peer = new RTCPeerConnection();

peer.onicecandidate = e => {
    if (e.candidate) socket.emit("candidate", e.candidate);
};

async function startCast() {

    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
    });

    document.getElementById("localVideo").srcObject = stream;

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("offer", offer);
}

socket.on("answer", async answer => {
    await peer.setRemoteDescription(answer);
});

socket.on("candidate", candidate => {
    peer.addIceCandidate(new RTCIceCandidate(candidate));
});
