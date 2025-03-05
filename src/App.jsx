import { useState } from "react";
import React from "react";
import "./App.css";
import botIcon from "./assets/chatbot.jpg"; // 確保有機器人圖示

const functionUrl = "http://localhost:5000/chat"; // Express 後端 API

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false); // 控制聊天視窗開關
  const [newInputValue, setNewInputValue] = useState(""); // 用戶輸入框的狀態
  const [messages, setMessages] = useState([]); // 訊息狀態

  // 發送請求並處理 AI 回應
  const newMessage = async (e) => {
    e.preventDefault();
    if (!newInputValue.trim()) return;

    // 更新 UI，顯示用戶訊息
    setMessages([...messages, { text: newInputValue, sender: "user" }]);
    setNewInputValue(""); 

    try {
      const eventSource = new EventSource(`${functionUrl}?message=${encodeURIComponent(newInputValue)}`);
      
      setMessages(prevMessages => [...prevMessages, { sender: "ai", text: "" }]);
      let accumulatedResponse = "";
      
      eventSource.onmessage = (event) => {
        if (event.data === "[END]") {
          eventSource.close();
          return;
        }
        
        accumulatedResponse += event.data;
        
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = { sender: "ai", text: accumulatedResponse };
          return updatedMessages;
        });
      };

      eventSource.onerror = () => {
        console.error("SSE 連線錯誤");
        eventSource.close();
      };
    } catch (error) {
      console.error("發送訊息時發生錯誤:", error);
    }
  };

  return (
    <div>
      {/* 聊天機器人按鈕 */}
      <div className="chatbot-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
        <img src={botIcon} alt="Chatbot" />
      </div>

      {/* 聊天視窗 */}
      {isChatOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <span>Practice Chat Bot</span>
            <button className="close-button" onClick={() => setIsChatOpen(false)}>×</button>
          </div>
          <div className="chat-box">
            {messages.map((message, index) => (
              <p key={index} className={"message " + message.sender}>{message.text}</p>
            ))}
          </div>
          <form className="input-form" onSubmit={newMessage}>
            <input
              type="text"
              placeholder="輸入訊息..."
              value={newInputValue}
              onChange={(e) => setNewInputValue(e.target.value)}
            />
            <button className="send-button" type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
