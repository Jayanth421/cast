const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

/* Serve public files */
app.use(express.static(path.join(__dirname, "public")));

/* OPEN CAST PAGE BY DEFAULT */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* WebRTC signaling */
io.on("connection", socket => {

    console.log("User connected");

    socket.on("offer", data => {
        socket.broadcast.emit("offer", data);
    });

    socket.on("answer", data => {
        socket.broadcast.emit("answer", data);
    });

    socket.on("candidate", data => {
        socket.broadcast.emit("candidate", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

});

/* Start server */
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
