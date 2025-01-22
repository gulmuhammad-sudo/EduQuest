import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import HeaderComponent from "../home/HeaderComponent";
import { getChats, sendMessage, deleteMessage } from "../../database/Chat";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from '../notification/NotificationContext';

function ChatScreen() {
    const [chats, setChats] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFirstFetch, setIsFirstFetch] = useState(true); // New state to track the first fetch
    const { currentUser } = useAuth();
    const notify = useNotification();

    const isAdmin = currentUser.role === "admin";

    const fetchChats = () => {
        getChats().then(res => {
            const newChats = res.data;

            if (!isFirstFetch) {
                // Identify new messages that are not in the existing chat state
                const newMessages = newChats.filter(
                    chat => !chats.some(existingChat => existingChat._id === chat._id)
                );
                if (newMessages.length > 0) {
                    notify('You have new messages!');
                }
            }

            setChats(newChats);
            if (isFirstFetch) setIsFirstFetch(false); // Mark as not the first fetch
        });
    };

    useEffect(() => {
        fetchChats();
        const interval = setInterval(fetchChats, 5000); // Poll every 5 seconds for new chats
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim() === "" && !selectedFile) return;

        const formData = new FormData();
        formData.append('message', newMessage);
        if (selectedFile) {
            formData.append('attachment', selectedFile, selectedFile.name);
            console.log('FormData before sending:', formData); // Debug FormData
        }

        sendMessage(formData)
            .then(response => {
                console.log('Message sent successfully:', response.data);
                fetchChats(); // Refresh chats
                notify('Message sent successfully!');
            })
            .catch(error => {
                console.error('Error sending message:', error);
                notify('Failed to send message');
            });

        setNewMessage("");
        setSelectedFile(null);
    };

    const handleDeleteMessage = (messageId) => {
        deleteMessage(messageId).then(() => {
            fetchChats();
        });
        notify('Message deleted successfully!');
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="rounded p-4" style={{ width: '80%', minHeight: '60vh', borderRadius: '15px' }}>
                <Card.Body className="d-flex flex-column">
                    <HeaderComponent />
                    <div className="chat-container flex-grow-1 my-3" style={{ overflowY: 'auto', maxHeight: '50vh' }}>
                        {chats.map((chat, index) => (
                            <Row key={index} className={`my-2 ${chat.user.email === currentUser.email ? 'justify-content-end' : 'justify-content-start'}`}>
                                <Col xs="auto">
                                    <Card className={`p-3 ${chat.user.email === currentUser.email ? 'bg-primary text-white' : 'bg-secondary text-white'}`} style={{ borderRadius: '15px', maxWidth: '100%' }}>
                                        <Card.Body className="p-0">
                                            <Card.Title className="mb-1" style={{ fontSize: '1rem', textAlign: "right" }}>
                                                {chat.user.name}
                                                {isAdmin && (
                                                    <FaTrash style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => handleDeleteMessage(chat._id)} />
                                                )}
                                            </Card.Title>
                                            <Card.Text className="mb-0" style={{ fontSize: '1rem' }}>
                                                {chat.message}
                                            </Card.Text>
                                            {chat.attachmentUrl && (
                                                <a href={`http://localhost:4000${chat.attachmentUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
                                                    View Attachment
                                                </a>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        ))}
                    </div>
                    <InputGroup className="mt-3">
                        <Form.Control
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <div>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                            <label htmlFor="fileInput" className="btn btn-secondary">
                                {selectedFile ? `📂 ${selectedFile.name}` : '📁 Choose a file'}
                            </label>
                        </div>
                        <Button variant="primary" onClick={handleSendMessage}>
                            Send
                        </Button>
                    </InputGroup>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ChatScreen;
