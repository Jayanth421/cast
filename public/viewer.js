const socket = io();
let peer = new RTCPeerConnection();

peer.ontrack = e => {
    document.getElementById("remoteVideo").srcObject = e.streams[0];
};

peer.onicecandidate = e => {
    if (e.candidate) socket.emit("candidate", e.candidate);
};

socket.on("offer", async offer => {

    await peer.setRemoteDescription(offer);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer", answer);
});

socket.on("candidate", candidate => {
    peer.addIceCandidate(new RTCIceCandidate(candidate));
});
