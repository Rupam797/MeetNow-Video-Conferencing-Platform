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
    <div className="fixed md:static top-14 bottom-0 right-0 z-30 w-full md:w-80 bg-tertiary/95 backdrop-blur-xl border-l border-border-primary/60 flex flex-col shrink-0 animate-[fade-in_0.25s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary/60">
        <h3 className="text-sm font-semibold text-white font-[Outfit] tracking-wide">
          Meeting Chat
        </h3>
        <button 
          onClick={onClose} 
          className="w-7 h-7 rounded-full flex items-center justify-center text-offwhite/60 hover:text-white hover:bg-surface-hover transition-all duration-150 cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`${msg.isOwn ? 'text-right' : 'text-left'}`}>
            <div className="text-[10px] text-offwhite/50 mb-0.5 font-medium font-[Outfit]">
              {msg.sender}
            </div>
            <div className={`inline-block px-3 py-1.5 rounded-xl text-sm leading-relaxed max-w-[85%] break-words font-[Outfit]
              ${msg.isOwn 
                ? 'bg-brand text-secondary rounded-br-sm' 
                : 'bg-surface text-offwhite rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
            <div className="text-[10px] text-offwhite/40 mt-0.5">
              {msg.time}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-3 py-2.5 border-t border-border-primary/60 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Send a message..."
          className="flex-1 px-3 py-2 bg-input border border-border-primary/60 rounded-full text-sm text-white font-[Outfit] placeholder:text-offwhite/40 outline-none focus:border-brand/50 transition-colors duration-150"
        />
        <button 
          type="submit" 
          className="w-9 h-9 rounded-full bg-brand text-secondary flex items-center justify-center hover:bg-brand-hover transition-all duration-150 active:scale-95 cursor-pointer shadow-md shadow-brand/20"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
