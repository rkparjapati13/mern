import React, { useState, useEffect, useRef } from 'react';
import PeopleList from './PeopleList';
import ChatHeader from './ChatHeader';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import '../../css/ChatApp.css';
import api from '../../services/api';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const chatEndRef = useRef(null); // Reference for the chat container

    useEffect(() => {
        // Listen for incoming messages
        socket.on('message', (message) => {

            if (selectedUser && message.from === selectedUser._id) {
                console.log('message aaya', message);
                const modifiedMessage = {
                    ...message,
                    senderRole: 'other',
                };
                setMessages((prevMessages) => [...prevMessages, modifiedMessage]);
            }
        });

        // Cleanup listener on component unmount
        return () => {
            socket.off('message');
        };
    }, [selectedUser]);
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    useEffect(() => {
        // Scroll to the bottom of the chat when messages change
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]); // Trigger scrolling whenever messages change

    const handleSendMessage = async (newMessage) => {
        if (!selectedUser) return; // Don't send message if no user is selected
        const messageData = {
            text: newMessage.trim(),
            receiver: selectedUser._id // Send message to the selected user
        };
        if (!newMessage.trim()) return;

        try {
            // Optionally, save the message to the database
            const response = await api.post('/messages', messageData);
            if (response.status === 201) {
                socket.emit('message', response.data);
                // You can update state with the message here if needed
                setMessages((prevMessages) => [...prevMessages, response.data]);
            }
        } catch (error) {
            console.error('Error creating message:', error);
        }
    };

    const handleSelectUser = async (user) => {
        setSelectedUser(user); // Update selected user
        try {
            const response = await api.get(`/messages/${user._id}`); // Fetch messages for the selected user
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    return (
        <div className="row clearfix">
            <div className="col-lg-12">
                <div className="card chat-app">
                    <PeopleList onSelectUser={handleSelectUser} selectedUserId={selectedUser ? selectedUser._id : null} />

                    <div className="chat">
                        {selectedUser ? (
                            <>
                                <ChatHeader user={selectedUser} />
                                <ChatHistory messages={messages} chatEndRef={chatEndRef} />
                                {/* Reference div for scrolling */}
                                {/* <div ref={chatEndRef} /> */}
                                <ChatInput onSendMessage={handleSendMessage} />
                            </>
                        ) : (
                            <div className="no-user-selected">Select a user to start chatting</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
