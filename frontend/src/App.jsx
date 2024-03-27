import React, { Component, useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

function App() {
  const [filled, setFilled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [msg, setMsg] = useState("");

  try {
    const host = new W3CWebSocket(
      "ws://127.0.0.1:8000/ws/" + (room ? room : "default") + "/"
    );
  } catch (e) {
    console.log("Error", e);
  }

  const sendMessage = (e) => {
    e.preventDefault();
    host.send(
      JSON.stringify({
        type: "message",
        text: msg,
        sender: name,
      })
    );
    setMsg("");
  };

  useEffect(() => {
    host.onopen = () => {
      console.log("Connected to the server");
    };

    host.onmessage = (received) => {
      const dataFromServer = JSON.parse(received.data);
      if (dataFromServer) {
        setMessages((prev) => [
          ...prev,
          { msg: dataFromServer.content, name: dataFromServer.user },
        ]);
      }
    };
    return () => {
      host.close();
    };
  });
  return (
    <div>
      {filled ? (
        <div>
          {messages.map((index, msg) => (
            <li key={index}>
              {msg.name} - {msg.msg}
            </li>
          ))}
          <form onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="enter your message..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <div>
          <form onSubmit={() => setFilled(true)}>
            room name:
            <input value={room} onChange={(e) => setRoom(e.target.value)} />
            user name:
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <button type="submit">enter</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
