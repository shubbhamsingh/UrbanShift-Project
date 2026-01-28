import React, { useState, useEffect, useRef, useContext } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaComments, FaArrowLeft, FaCircle } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

const Chat = () => {
    const { userId } = useParams(); // URL param (e.g. /chat/5)
    const navigate = useNavigate();
    const { mode } = useContext(ThemeContext);
    const isDark = mode === 'dark';

    const [message, setMessage] = useState('');
    const [messageHistory, setMessageHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [inboxList, setInboxList] = useState([]); // List of people I talked to
    const messagesEndRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // URL Setup
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const API_URL = isLocal ? "http://127.0.0.1:8000" : "https://urbanshift-project.onrender.com";
    const WS_URL = isLocal ? "ws://127.0.0.1:8000" : "wss://urbanshift-project.onrender.com";

    // Detect Mobile Screen Resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 1. Get Current User Info & Inbox List
    useEffect(() => {
        const fetchInitialData = async () => {
            const token = localStorage.getItem('token');
            if(!token) return;

            try {
                // Fetch Me
                const userRes = await axios.get(`${API_URL}/api/users/me/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCurrentUser(userRes.data);

                // Fetch Inbox (Who I talked to)
                const inboxRes = await axios.get(`${API_URL}/api/chat/inbox/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInboxList(inboxRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchInitialData();
    }, [API_URL]);

    // 2. Generate Room Name
    const getRoomName = () => {
        if (!currentUser || !userId || userId === 'inbox') return null;
        const myId = currentUser.id;
        const otherId = parseInt(userId);
        return myId < otherId ? `${myId}_${otherId}` : `${otherId}_${myId}`;
    };
    const roomName = getRoomName();

    // 3. WebSocket Connection
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        roomName ? `${WS_URL}/ws/chat/${roomName}/` : null,
        { shouldReconnect: () => true }
    );

    // 4. Load Messages
    useEffect(() => {
        if (!roomName) return;
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`${API_URL}/api/chat/history/${roomName}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessageHistory(res.data);
            } catch (err) { console.error(err); }
        };
        fetchHistory();
    }, [roomName, API_URL]);

    // 5. Append New Messages
    useEffect(() => {
        if (lastJsonMessage !== null) {
            setMessageHistory((prev) => [...prev, {
                sender_name: lastJsonMessage.username,
                content: lastJsonMessage.message,
                timestamp: new Date().toISOString()
            }]);
        }
    }, [lastJsonMessage]);

    // 6. Scroll
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messageHistory]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && currentUser) {
            sendJsonMessage({ message: message, username: currentUser.username });
            setMessage('');
        }
    };

    // --- COLORS ---
    const colors = {
        bg: isDark ? '#121212' : '#f4f7f6',
        sidebarBg: isDark ? '#1e1e1e' : '#ffffff',
        text: isDark ? '#ffffff' : '#333333',
        border: isDark ? '#333' : '#ddd',
        activeChat: isDark ? '#2c3e50' : '#eef2f5',
        inputBg: isDark ? '#2c3e50' : '#fff'
    };

    // --- CONDITIONAL RENDERING ---
    // On mobile, if no user selected (userId == 'inbox'), show list. If selected, show chat.
    // On desktop, show both side-by-side.
    const showSidebar = !isMobile || (isMobile && userId === 'inbox');
    const showChatArea = !isMobile || (isMobile && userId !== 'inbox');

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 80px)', background: colors.bg }}>
            
            {/* SIDEBAR (Inbox List) */}
            {showSidebar && (
                <div style={{
                    width: isMobile ? '100%' : '300px',
                    background: colors.sidebarBg,
                    borderRight: `1px solid ${colors.border}`,
                    display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}` }}>
                        <h2 style={{ margin: 0, color: colors.text, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaComments color="#764ba2" /> Messages
                        </h2>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {inboxList.length === 0 ? (
                            <p style={{ padding: '20px', color: '#888', textAlign: 'center' }}>No chats yet.</p>
                        ) : (
                            inboxList.map(chat => (
                                <div 
                                    key={chat.id} 
                                    onClick={() => navigate(`/chat/${chat.partner_id}`)}
                                    style={{
                                        padding: '15px 20px',
                                        borderBottom: `1px solid ${colors.border}`,
                                        cursor: 'pointer',
                                        background: parseInt(userId) === chat.partner_id ? colors.activeChat : 'transparent',
                                        display: 'flex', alignItems: 'center', gap: '10px'
                                    }}
                                >
                                    <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#ddd', display:'flex', justifyContent:'center', alignItems:'center', fontWeight:'bold', fontSize:'1.2rem', color:'#555'}}>
                                        {chat.partner_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{overflow: 'hidden'}}>
                                        <h4 style={{ margin: 0, color: colors.text }}>{chat.partner_name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {chat.last_message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* CHAT AREA */}
            {showChatArea && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: colors.bg }}>
                    {userId === 'inbox' ? (
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888', flexDirection:'column' }}>
                            <FaPaperPlane size={50} color="#ddd" />
                            <h3>Select a chat to start messaging</h3>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div style={{ padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                {isMobile && (
                                    <FaArrowLeft onClick={() => navigate('/chat/inbox')} style={{ cursor: 'pointer' }} />
                                )}
                                <h3 style={{ margin: 0 }}>Chat</h3>
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '5px 10px', borderRadius: '15px' }}>
                                    <FaCircle size={10} color={readyState === ReadyState.OPEN ? "#2ecc71" : "#e74c3c"} />
                                    {readyState === ReadyState.OPEN ? "Online" : "Connecting..."}
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                                {messageHistory.map((msg, index) => {
                                    const isMe = msg.sender_name === currentUser?.username;
                                    return (
                                        <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{
                                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                                background: isMe ? '#764ba2' : (isDark ? '#333' : 'white'),
                                                color: isMe ? 'white' : (isDark ? 'white' : '#333'),
                                                border: isMe ? 'none' : `1px solid ${colors.border}`,
                                                padding: '10px 15px',
                                                borderRadius: isMe ? '15px 15px 0 15px' : '15px 15px 15px 0',
                                                maxWidth: '70%',
                                                marginBottom: '10px',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                            }}>
                                                {!isMe && <small style={{ display: 'block', fontSize: '0.7rem', color: '#888', marginBottom: '2px' }}>{msg.sender_name}</small>}
                                                {msg.content}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} style={{ padding: '15px', background: colors.sidebarBg, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    placeholder="Type a message..." 
                                    style={{ flex: 1, padding: '12px', borderRadius: '25px', border: `1px solid ${colors.border}`, outline: 'none', background: colors.inputBg, color: colors.text }} 
                                />
                                <button type="submit" style={{ padding: '10px 15px', borderRadius: '50%', border: 'none', background: '#764ba2', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <FaPaperPlane />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Chat;