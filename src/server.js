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

let count = 0;

io.on("connection", (socket) => {
  console.log("Web Socket Connected!");
  socket.emit("countUpdated", count);

  // getting data from the client:
  socket.on("increment", () => {
    count++;
    // emitting updated data back to the client:
    socket.emit("countUpdated", count);
  });
});

const start = async () => {
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};
start();
