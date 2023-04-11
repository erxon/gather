import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function Chat() {
  const [username, setUsername] = useState("username");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  let allMessages = []; 

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.PUSHER_KEY, {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("chat");
    channel.bind("message", function (data) {
      allMessages.push(data)
      setMessages(allMessages)
    });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username,
            message
        })
    });
    setMessage('');

  };
  return (
    <div>
      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <h1>Messages</h1>
      {messages.map((message) => {
        return (
          <div>
            <strong>{message.username}</strong>
            <p>{message.message}</p>
          </div>
        );
      })}
      <form onSubmit={handleSubmit}>
        <label>Message</label>
        <input
          type="text"
          name="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
