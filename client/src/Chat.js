import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date().getHours() + ":" + new Date().getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Data received", data);
      setMessageList((list) => [...list, data]);
    });
    return () => socket.removeListener("receive_message"); // To remove double-rendering
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>Live Chat</h2>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((v, i, arr) => (
            <div
              className="message"
              id={username === v.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{v.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{v.time}</p>
                  <p id="author">{v.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Enter your Message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
