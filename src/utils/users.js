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


