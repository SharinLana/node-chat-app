const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit(
      "message",
      generateMessage("Admin", `Welcome, ${user.username}!`)
    );
    // Let existing users know that a new person has joined them (the newcomer won't see this message)
    // Send event to everyone except the new client
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", `${user.username} has joined!`)
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback(); //if no profanity, send an empty callback to the client
  });

  socket.on("sendMessage", (msg, callback) => {
    const user = getUser(socket.id);

    if (user) {
      const filter = new Filter();
      if (filter.isProfane(msg)) {
        return callback("Profanity is not allowed!");
      }

      io.to(user.room).emit("message", generateMessage(user.username, msg));
      callback();
    }
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      // 10.Let all remaining users know that the person has left
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left!`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on("sendLocation", ({ lat, long }, callback) => {
    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "locationMessage",
        generateLocationMessage(
          user.username,
          `https://google.com/maps?q=${lat},${long}`
        )
      );
      callback();
    }
  });
});

const start = async () => {
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};
start();

/*
Emitting events:

socket.emit("message", message); => Emit a message to the particular client
io.emit("message", message); => Emit a message to all the clients
socket.broadcast.emit("message", message); => Emit a message to all the clients except for the particular client
io.to("room1").emit("message", message); => Emit a message to all the users in a particular room
socket.broadcast.to("room1").emit("message", message); => Emit a message to all clients in a specific room
*/
