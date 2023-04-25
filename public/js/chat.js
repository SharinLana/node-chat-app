const incrementBtn = document.querySelector("#increment");
const socket = io();

socket.on("countUpdated", (count) => {
    console.log("The count has been updated: " + count)
});

incrementBtn.addEventListener("click", () => {
    console.log("Clicked!");
    socket.emit("increment")
})