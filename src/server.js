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

io.on("connection", (socket) => {
  console.log("Web Socket Connected!");
  socket.emit("countUpdated");
});

const start = async () => {
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};
start();
