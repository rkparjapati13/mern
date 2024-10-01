import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import moment from 'moment';
import '../css/chat.css'; // Import styles for the chat UI

// const socket = io('http://localhost:5000'); // Connect to your server

const Chat = () => {
    const [messages, setMessages] = useState([]); // Store chat messages
    const [message, setMessage] = useState(''); // Store the current typed message
    const [username, setUsername] = useState(''); // Store the username

    useEffect(() => {
        // When a new message is received from the server
        // socket.on('receive_message', (data) => {
        //     setMessages((prevMessages) => [...prevMessages, data]);
        // });

        // // Cleanup event when the component unmounts
        // return () => {
        //     socket.off('receive_message');
        // };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const messageData = {
                username: username || 'Anonymous',
                message,
                time: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            // Emit message to server
            // socket.emit('send_message', messageData);
            // Add message to the local state
            // setMessages((prevMessages) => [...prevMessages, messageData]);
            setMessage(''); // Clear input field
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat Room</h2>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div className="message" key={index}>
                        <p className="message-info">
                            <strong>{msg.username}</strong> <span>{msg.time}</span>
                        </p>
                        <p className="message-text">{msg.message}</p>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <form onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
