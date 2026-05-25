import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChatPanel = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'MeetNow Bot',
      content: 'Welcome to the meeting! Share the link or Room ID with others so they can join you.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: false,
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: user?.name || 'You',
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Simulate an interactive bot response after 1.5 seconds to make the UI feel alive!
    setTimeout(() => {
      const responses = [
        "Awesome! Hope you're enjoying the premium design.",
        "Your audio and video signals are looking strong!",
        "Tip: You can toggle your camera and microphone using the control bar below.",
        "Need to invite others? Just copy the Room ID from the top left and send it over!",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'MeetNow Bot',
          content: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: false,
        }
      ]);
    }, 1500);
  };

  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <h3>Meeting Chat</h3>
        <button onClick={onClose} className="side-panel-close">
          <X size={16} />
        </button>
      </div>

      <div className="side-panel-body">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.isOwn ? 'own' : ''}`}>
            <div className="chat-message-sender">{msg.sender}</div>
            <div className="chat-message-bubble">{msg.content}</div>
            <div className="chat-message-time">{msg.time}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Send a message..."
        />
        <button type="submit" className="chat-send-btn">
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
