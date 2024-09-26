import React, { useState } from 'react';
const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="chat-message clearfix">
      <div className="input-group mb-0">
        <input
          type="text"
          className="form-control"
          placeholder="Enter text here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
      </div>
    </div>
  );
};

export default ChatInput;
