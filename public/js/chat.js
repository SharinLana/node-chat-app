const form = document.querySelector("#form");
const btn = document.querySelector("#btn");
const geoBtn = document.querySelector("#geo-btn");

// 2. Establish a connection to the backend
const socket = io();
// 4. Receive a first message from the backend
socket.on("message", (message) => {
  console.log(message);
});
// 5. Create a form in index.html
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputMessage = e.target.elements.msg.value;
  // 6. Emit the new event, sending the input value to the backend
  socket.emit("sendMessage", inputMessage, (swearWordsDetected) => {
    if (swearWordsDetected) {
      console.log(swearWordsDetected);
    } else {
      console.log("Message delivered to the server!");
    }
  });
});

// Sharing the user's location
geoBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    }, () => {
        console.log("Location shared!")
    });
  });
});
