const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});


const rooms = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
 
  
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(socket.id);

    console.log(`User ${socket.id} joined room ${roomId}`);
    io.to(roomId).emit("user-joined", { userId: socket.id });
  });

 
  socket.on("canvas-data", ({ roomId, data }) => {
    socket.to(roomId).emit("canvas-data", data); 
  });

  
  socket.on("clear-canvas", (data) => {
    if (!data || !data.roomId) {
        console.error("Received invalid data for clear-canvas:", data);
        return;
    }

    const { roomId } = data;
    io.to(roomId).emit("clear-canvas");
});

socket.on("erase-stroke", ({ x, y, roomId }) => {
  socket.to(roomId).emit("erase-stroke", { x, y, roomId });
});


 
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId].includes(socket.id)) {
        rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
        io.to(roomId).emit("user-left", { roomId, userId: socket.id });
        console.log(`User ${socket.id} left room ${roomId}`);
      }
    }
  });
});

server.listen(5005, () => console.log("✅ Server running on port 5005"));
