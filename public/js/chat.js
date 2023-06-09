// Elements
const form = document.querySelector("#form");
const btn = document.querySelector("#btn");
const geoBtn = document.querySelector("#geo-btn");
const messageInput = document.querySelector("#msg");
const messages = document.querySelector("#messages");
const sidebar = document.querySelector("#sidebar");
const warning = document.querySelector("#warning");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
// Use qs library to parse the query string in the location.search
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
}); // ignoreQueryPrefix: true = removed "?" mark from the string

// Automatically scroll down to the bottom of the page,
// so that the user can see the latest messages.
// BUT. Stop automatically scrolling when the user manually scrolls up
// (to find one of the previous messages from the history)
const autoscroll = () => {
  // New message element
  const newMessage = messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle(newMessage);
  // console.log(newMessageStyles)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = messages.offsetHeight;

  // Height of the messages container
  const containerHeight = messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = messages.scrollTop + visibleHeight;

  // Scroll to the bottom
  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

const socket = io();

socket.on("message", ({ username, text, createdAt }) => {
  // Rendering messages in HTML
  const html = Mustache.render(messageTemplate, {
    userName: username,
    message: text,
    createdAt: moment(createdAt).format("h:mm a"), // by using the moment library
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", ({ username, url, createdAt }) => {
  const html = Mustache.render(locationTemplate, {
    userName: username, // from template: from server
    url,
    createdAt: moment(createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

  sidebar.innerHTML = html;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  btn.setAttribute("disabled", "disabled"); // attr name - attr value

  const inputMessage = e.target.elements.msg.value;

  socket.emit("sendMessage", inputMessage, (swearWordsDetected) => {
    btn.removeAttribute("disabled");

    messageInput.value = "";
    messageInput.focus();

    if (swearWordsDetected) {
      warning.style.display = "block";
      warning.innerHTML = swearWordsDetected;
    } else {
      console.log("Message delivered to the server!");
    }
  });
});

// Hiding the profanity warning message 
messageInput.addEventListener("input", () => {
  warning.style.display = "none";
})

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

socket.emit("joinRoom", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
