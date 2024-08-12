import { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";

import "./App.css";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [socketId, setSocketID] = useState();
  const [message, setMessage] = useState("");
  const [pastMessages, setPastMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
    });

    socket.on("recieveByAll", (message) => {
      setPastMessages((prev) => [...prev, message]);
    });

    socket.on("recieveMessage", (message) => {
      setPastMessages((prev) => [...prev, message]);
    });
  }, []);

  const handleSendMessage = () => {
    socket.emit("message", { message, roomId });
    setMessage("");
    setRoomId("");
  };

  const sendToAll = () => {
    socket.emit("sendToAll", message);
    setMessage("");
  };

  const handleJoinRoom = () => {
    socket.emit("joinRoom", roomName);
    setRoomName("");
  };

  return (
    <div>
      <h6>Socket ID : {socketId} </h6>
      <form className="form">
        <input
          type="Text"
          placeholder="Room Name"
          onChange={(e) => setRoomName(e.target.value)}
          value={roomName}
        />
        <button type="button" onClick={handleJoinRoom}>
          Join room
        </button>
      </form>
      <form className="form form-vertical">
        <input
          type="Text"
          placeholder="Type your message here"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <input type="Text" placeholder="Sender socket ID" />
        <input
          type="Text"
          placeholder="Room name"
          onChange={(e) => setRoomId(e.target.value)}
          value={roomId}
        />
        <button type="button" onClick={handleSendMessage}>
          Send
        </button>
        <button type="button" onClick={sendToAll}>
          Send to all except me
        </button>
      </form>
      <h4>Messages</h4>
      {pastMessages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
}

export default App;
