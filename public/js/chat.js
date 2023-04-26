// Elements
const form = document.querySelector("#form");
const btn = document.querySelector("#btn");
const geoBtn = document.querySelector("#geo-btn");
const messageInput = document.querySelector("#msg");
const messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

// 2. Establish a connection to the backend
const socket = io();
// 4. Receive a first message from the backend
socket.on("message", ({ text, createdAt }) => {
  // Rendering messages in HTML
  const html = Mustache.render(messageTemplate, {
    message: text,
    createdAt: moment(createdAt).format("h:mm a"), // by using the moment library
  });
  messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", ({ url, createdAt }) => {
  const html = Mustache.render(locationTemplate, {
    url: url, //from template: from server
    createdAt: moment(createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
});

// 5. Create a form in index.html
form.addEventListener("submit", (e) => {
  e.preventDefault();

  btn.setAttribute("disabled", "disbled"); // attr name - attr value

  const inputMessage = e.target.elements.msg.value;
  // 6. Emit the new event, sending the input value to the backend
  socket.emit("sendMessage", inputMessage, (swearWordsDetected) => {
    btn.removeAttribute("disabled");

    messageInput.value = "";
    messageInput.focus();

    if (swearWordsDetected) {
      console.log(swearWordsDetected);
    } else {
      console.log("Message delivered to the server!");
    }
  });
});

// Sharing the user's location
geoBtn.addEventListener("click", () => {
  geoBtn.setAttribute("disabled", "disabled");

  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      },
      () => {
        console.log("Location shared!");
        geoBtn.removeAttribute("disabled");
      }
    );
  });
});
