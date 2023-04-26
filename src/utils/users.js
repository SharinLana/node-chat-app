const users = [];

const addUser = ({ id, username, room }) => {
  // Clean the values
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the values
  if (!username || !room) {
    return { error: "Username and room are required" };
  }

  // Check for existing user
  const existingUser = users.find((user) => user.id === id);
  if (existingUser) {
    return { error: "This name has been taken!" };
  }

  // Add the user to the users array
  users.push({ id, username, room });

  return { user: { id, username, room } };
};

const removeUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    return users.splice(userIndex, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room)

// addUser({ id: 1, username: "Michael", room: "chat" });
// addUser({ id: 2, username: "Sophia", room: "chat" });
// console.log(users);

// console.log(removeUser(1));
// console.log(users);
addUser({ id: 1, username: "Michael", room: "chat" });
addUser({ id: 2, username: "Sophia", room: "chat" });
console.log(getUser(1));
console.log(getUsersInRoom("chat"));