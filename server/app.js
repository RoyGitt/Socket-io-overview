import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    socket.to(data.roomId).emit("recieveMessage", data.message);
  });

  socket.on("sendToAll", (message) => {
    socket.broadcast.emit("recieveByAll", message);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
