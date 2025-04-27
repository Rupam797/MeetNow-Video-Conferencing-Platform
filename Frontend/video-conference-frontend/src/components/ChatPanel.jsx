import React from "react";

const ChatPanel = ({
  messages,
  messageInput,
  setMessageInput,
  sendMessage,
}) => {
  return (
    <div className="w-80 bg-gray-200 dark:bg-gray-800 p-4 border-l border-gray-300 dark:border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold mb-2">Chat</h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="bg-gray-300 dark:bg-gray-700 p-2 rounded break-words"
          >
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 text-black rounded-l focus:outline-none"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-4 rounded-r text-white transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
