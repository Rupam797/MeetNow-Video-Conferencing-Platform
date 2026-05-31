import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getWebSocketUrl = (roomId) => {
  let backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1.0';
  
  // Clean up trailing slash
  if (backendUrl.endsWith('/')) {
    backendUrl = backendUrl.slice(0, -1);
  }
  
  // Do NOT strip the context path (e.g. /api/v1.0) because Spring Boot's
  // server.servlet.context-path applies to all WebSocket endpoints.
  let wsUrl = backendUrl;
  if (wsUrl.startsWith('https://')) {
    wsUrl = wsUrl.replace('https://', 'wss://');
  } else if (wsUrl.startsWith('http://')) {
    wsUrl = wsUrl.replace('http://', 'ws://');
  } else {
    // Fallback to absolute URLs relative to browser window
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    wsUrl = `${protocol}//${host}${backendUrl}`;
  }
  
  return `${wsUrl}/ws/chat/${roomId}`;
};

const ChatPanel = ({ roomId, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'Vidor Bot',
      content: 'Welcome to the meeting room chat! Messages are ephemeral and will disappear when you leave.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: false,
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [connected, setConnected] = useState(false);
  
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    let ws;
    const connect = () => {
      const wsUrl = getWebSocketUrl(roomId);
      console.log('Connecting to chat WebSocket:', wsUrl);
      ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('Chat WebSocket connected successfully');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const receivedMsg = {
            ...data,
            isOwn: false,
          };
          setMessages((prev) => [...prev, receivedMsg]);
        } catch (err) {
          console.error('Failed to parse incoming WebSocket message:', err);
        }
      };

      ws.onclose = (event) => {
        console.log('Chat WebSocket disconnected. Code:', event.code);
        setConnected(false);
        // Reconnect if connection was closed abnormally
        if (event.code !== 1000) {
          console.log('Attempting to reconnect in 3 seconds...');
          reconnectTimeoutRef.current = setTimeout(connect, 3000);
        }
      };

      ws.onerror = (err) => {
        console.error('Chat WebSocket error:', err);
        setConnected(false);
      };
    };

    connect();

    return () => {
      if (ws) {
        ws.close(1000, 'Component unmounted');
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [roomId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: user?.name || 'Guest',
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(newMessage));
      setMessages((prev) => [...prev, { ...newMessage, isOwn: true }]);
      setInputValue('');
    } else {
      console.warn('Cannot send message: WebSocket is disconnected.');
    }
  };

  return (
    <div className="fixed md:static top-14 bottom-0 right-0 z-30 w-full md:w-80 bg-tertiary/95 backdrop-blur-xl border-l border-border-primary/60 flex flex-col shrink-0 animate-[fade-in_0.25s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary/60">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white font-[Outfit] tracking-wide">
            Meeting Chat
          </h3>
          {/* Connection Status indicator */}
          <div 
            className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} 
            title={connected ? 'Connected' : 'Disconnected, reconnecting...'}
          />
        </div>
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
          disabled={!connected}
          placeholder={connected ? "Send a message..." : "Connecting to chat..."}
          className="flex-1 px-3 py-2 bg-input border border-border-primary/60 rounded-full text-sm text-white font-[Outfit] placeholder:text-offwhite/40 outline-none focus:border-brand/50 transition-colors duration-150 disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={!connected || !inputValue.trim()}
          className="w-9 h-9 rounded-full bg-brand text-secondary flex items-center justify-center hover:bg-brand-hover transition-all duration-150 active:scale-95 cursor-pointer shadow-md shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
