const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

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
  socket.on("sendMessage", (msg, callback) => {
    // Checking for the profanity using bad-words package:
    const filter = new Filter();
    if (filter.isProfane(msg)) {
      // Return a warning and stop the following code from execution
      return callback("Profanity is not allowed!")
    }
    // 8. Make it visible to all users
    io.emit("message", msg);
    callback(); //if no profanity, send an empty callback to the client 
  });
  // 9. Listen for the user disconnection
  socket.on("disconnect", () => {
    // 10.Let all remaining users know that the person has left
    io.emit("message", "A user has left!");
  });
  // 11. Listen for the "sendLocation" event
  socket.on("sendLocation", ({ lat, long }, callback) => {
    io.emit("message", `https://google.com/maps?q=${lat},${long}`);
    callback();
  });
});

const start = async () => {
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};
start();
