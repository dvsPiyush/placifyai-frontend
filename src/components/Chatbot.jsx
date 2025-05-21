import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = ({ externalMessage }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  // Load username and name from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');

    if (storedUsername) setUsername(storedUsername);
    if (storedName) setName(storedName);
  }, []);

  // Load chat history after username is set
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.post(
          'http://localhost:5000/chat-history',
          { username },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.history) {
          const historyFormatted = res.data.history.flatMap(item => [
            { sender: 'user', text: item.user },
            { sender: 'bot', text: item.bot }
          ]);
          setChat(historyFormatted);
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
      }
    };

    if (username) {
      fetchHistory();
    }
  }, [username]);
useEffect(() => {
  if (externalMessage && externalMessage.text) {
    setChat(prev => [...prev, externalMessage]);
  }
}, [externalMessage]);
  // Send message to backend
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: 'user', text: message };
    setChat(prev => [...prev, userMsg]);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://localhost:5000/chatbot',
        {
          username,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botMsg = { sender: 'bot', text: res.data.response };
      setChat(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };
// ...existing imports and code...

const deleteAllChats = async () => {
  if (!window.confirm("Are you sure you want to delete all your chats?")) return;
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/chat-history/delete',
      { username },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setChat([]);
  } catch (err) {
    console.error('Error deleting chat history:', err);
  }
};

// ...existing code...

return (
  <div className="chatbot-container">
    <h2>Welcome, {name} 💬 | Chat with PlacifyAI</h2>
    <button
      onClick={deleteAllChats}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
      style={{ marginBottom: '10px' }}
    >
      Delete All Chats
    </button>
  <div className="chat-window">
  {chat.map((msg, i) => (
    <div key={i} className={`chat-message ${msg.sender}`}>
      <div className="chat-bubble">
        {msg.sender === 'bot' && (
          <span className="placify-label" style={{
            fontSize: '0.85em',
            color: '#4F46E5',
            fontWeight: 'bold',
            marginBottom: '2px',
            display: 'block'
          }}>
            Placify
          </span>
        )}
<span style={{whiteSpace: 'pre-wrap'}}>{msg.text}</span>
      </div>
    </div>
  ))}
</div>
    <div className="input-section">
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={handleKeyDown}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  </div>
);
};
export default Chatbot;
