const socketIo = require("socket.io");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./Users");
const Document = require("./Model/Document");
const artist = require("consoleartist");

const roomEditorState = {};
const activeUsers = {};

const connectSocket = (server, cors) => {
  const io = socketIo(server, {
    cors: { origin: process.env.ENDPOINT, credentials: true },
  });

  io.on("connection", (socket) => {
    console.log(artist.rgb(`User connected: ${socket.id}`, 0, 64, 255));
    let currentRoom = null;

    socket.on("join-room", async ({ name, room }) => {
      const user = addUser({ id: socket.id, name, room });
      if (!user) return;

      socket.join(room);
      currentRoom = room;
      activeUsers[room] = (activeUsers[room] || 0) + 1;

      socket.emit("message", {
        user: user.name,
        message: `Welcome to room ${room}`,
      });

      socket.broadcast.to(room).emit("message", {
        user: "admin",
        message: `${user.name} has joined!`,
      });

      io.to(room).emit("user-joined", {
        user: user.name,
        message: `${user.name} has joined the room!`,
      });

      // Send current editor state or empty
      try {
        const existing = await Document.findOne({ docId: room });
        if (existing) {
          roomEditorState[room] = existing.content;
          socket.emit("editor-state", existing.content);
        } else {
          socket.emit("editor-state", "");
        }
      } catch (e) {
        console.error(
          artist.rgb(`Error loading document: ${e.message}`, 255, 0, 0)
        );
        socket.emit("editor-state", "");
      }

      // Broadcast updated users list in room
      io.to(room).emit("room-data", {
        room,
        users: getUsersInRoom(room),
      });

      console.log(artist.rgb(`${user.name} joined room ${room}`, 77, 255, 136));
    });

    // Editor content updates
    socket.on("editing", async ({ room, data }) => {
      roomEditorState[room] = data;
      io.to(room).emit("editing", data);

      try {
        await Document.findOneAndUpdate(
          { docId: room },
          { content: data, updatedAt: new Date() },
          { upsert: true }
        );
      } catch (e) {
        console.error(artist.rgb(`DB save error: ${e.message}`, 255, 0, 0));
      }
    });

    // Cursor position updates from client (no typing info here)
    socket.on("cursor-position", ({ room, cursor }) => {
      socket.to(room).emit("cursor-update", {
        id: socket.id,
        cursor,
        name: cursor.name,
        color: cursor.color,
      });
      console.log(
        artist.rgb(
          `Cursor update from ${cursor.name} in room ${room}`,
          255,
          128,
          0
        )
      );
    });

    // Typing indicator from client (only send who is currently typing)
    socket.on("typing", ({ room, user }) => {
      // Broadcast to others in room who is typing
      socket.to(room).emit("user-typing", { id: socket.id, user });
      console.log(
        artist.rgb(`User typing: ${user.name} in room ${room}`, 0, 255, 128)
      );
    });

    // Stop typing indicator
    socket.on("stop-typing", ({ room, user }) => {
      socket.to(room).emit("user-stop-typing", { id: socket.id });
      console.log(
        artist.rgb(
          `User stopped typing: ${user.name} in room ${room}`,
          255,
          0,
          128
        )
      );
    });

    socket.on("leave-room", async ({ name, room }) => {
      socket.leave(room);
      io.to(room).emit("user-left", { user: name });

      activeUsers[room] = (activeUsers[room] || 1) - 1;
      if (activeUsers[room] <= 0) {
        try {
          await Document.findOneAndDelete({ docId: room });
          console.log(
            artist.rgb(`Deleted document for room ${room}`, 255, 255, 26)
          );
        } catch (e) {
          console.error(artist.rgb(`DB delete error: ${e.message}`, 255, 0, 0));
        }
        delete roomEditorState[room];
        delete activeUsers[room];
      }
    });

    socket.on("disconnect", async () => {
      const user = removeUser(socket.id);
      if (user) {
        io.to(user.room).emit("user-left", { user: user.name });
        io.to(user.room).emit("user-stop-typing", { id: socket.id }); // Remove typing indicator on disconnect

        console.log(
          artist.rgb(
            `Disconnected: ${user.name} from room ${user.room}`,
            255,
            77,
            77
          )
        );

        activeUsers[user.room] = (activeUsers[user.room] || 1) - 1;
        if (activeUsers[user.room] <= 0) {
          try {
            await Document.findOneAndDelete({ docId: user.room });
            console.log(
              artist.rgb(`Deleted document for room ${user.room}`, 255, 255, 26)
            );
          } catch (e) {
            console.error(
              artist.rgb(`DB delete error: ${e.message}`, 255, 0, 0)
            );
          }
          delete roomEditorState[user.room];
          delete activeUsers[user.room];
        }
      } else {
        console.log(
          artist.rgb(`Disconnected unknown socket: ${socket.id}`, 128, 128, 128)
        );
      }
    });
  });
};

module.exports = connectSocket;
