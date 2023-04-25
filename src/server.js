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
  // Let existing users know that a new person has joined them (the newcomer won't see this message)
  socket.broadcast.emit("message", "A new user has joined!");
  // 7. Listen to the frontend entered message
  socket.on("sendMessage", (msg) => {
    // 8. Make it visible to all users
    io.emit("message", msg);
  });
  // 9. Listen for the user disconnection
  socket.on("disconnect", () => {
    // 10.Let all remaining users know that the person has left
    io.emit("message", "A user has left!")
  })
});

const start = async () => {
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};
start();
