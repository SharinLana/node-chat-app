const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

// 1. Make a connection to the client
io.on("connection", (socket) => {
  // 3. Emit the event
  socket.emit("message", "Welcome!");
  // 7. Listen to the frontend entered message
  socket.on("sendMessage", (msg) => {
    // 8. Make it visible to all users
    io.emit("message", msg);
  });
});

const start = async () => {
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};
start();
