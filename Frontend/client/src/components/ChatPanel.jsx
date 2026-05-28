import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChatPanel = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'MeetNow',
      content: 'Welcome! Share the meeting link with others so they can join.',
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

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

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

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Great message! The meeting is going smoothly.",
        "Tip: Use the control bar to toggle your mic and camera.",
        "You can share your screen using the Share button below.",
        "Need to invite someone? Copy the room link from the top bar!",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'MeetNow',
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
        <button onClick={onClose} className="side-panel-close" aria-label="Close chat">
          <X size={18} />
        </button>
      </div>

      <div className="side-panel-body">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.isOwn ? 'own' : ''}`}>
            <div className="chat-message-sender">
              {msg.isOwn ? 'You' : msg.sender}
            </div>
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
          placeholder="Type a message..."
        />
        <button type="submit" className="chat-send-btn" aria-label="Send message">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
