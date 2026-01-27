import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState({ username: 'Company' });
  const [stats, setStats] = useState({ pending: 0, ongoing: 0, completed: 0 });

  // ✅ Theme Logic
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark' || (
      mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  // --- DYNAMIC COLORS ---
  const colors = {
      bg: isDark ? '#121212' : '#f4f6f8',
      cardBg: isDark ? '#1e1e1e' : '#ffffff',
      text: isDark ? '#ffffff' : '#333333',
      subText: isDark ? '#aaaaaa' : '#666666',
      border: isDark ? '#333' : '#e0e0e0',
      shadow: isDark ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)'
  };

  // 👇 Smart URL Setup
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  const fetchData = useCallback(async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        
        const userRes = await axios.get(`${BACKEND_URL}/api/users/me/`, config);
        setUser(userRes.data);

        // 👇 Company ke liye API endpoint
        const reqRes = await axios.get(`${BACKEND_URL}/api/relocation/company-requests/`, config);
        setRequests(reqRes.data);

        // Stats Calculate karna
        const p = reqRes.data.filter(r => r.status === 'PENDING').length;
        const o = reqRes.data.filter(r => r.status === 'ACCEPTED').length;
        const c = reqRes.data.filter(r => ['COMPLETED', 'CANCELLED'].includes(r.status)).length;
        setStats({ pending: p, ongoing: o, completed: c });

    } catch (error) {
        if(error.response && error.response.status === 401) navigate('/login');
    }
  }, [navigate, BACKEND_URL]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  const handleStatus = async (id, status) => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${BACKEND_URL}/api/relocation/move-requests/${id}/update_status/`, { status }, { headers: { 'Authorization': `Bearer ${token}` } });
        toast.success(`Job Updated!`);
        fetchData();
    } catch (err) { toast.error("Error updating status"); }
  };

  const myOngoing = requests.filter(r => r.status === 'ACCEPTED');
  const myHistory = requests.filter(r => ['COMPLETED', 'CANCELLED'].includes(r.status));

  // --- STYLES (Moved inside) ---
  const styles = {
      page: { padding: '40px', background: colors.bg, minHeight: '100vh', color: colors.text, transition: '0.3s' },
      header: { display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '20px', marginBottom: '20px' },
      linkBtn: { textDecoration:'none', background:'#f1c40f', color:'black', padding:'10px 20px', borderRadius:'5px', fontWeight:'bold', boxShadow: '0 2px 5px rgba(241, 196, 15, 0.4)' },
      statsGrid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
      statBox: { background: colors.cardBg, padding: '20px', borderRadius: '10px', minWidth: '150px', textAlign: 'center', border: `1px solid ${colors.border}`, boxShadow: colors.shadow },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '15px' },
      card: { background: colors.cardBg, padding: '20px', borderRadius: '8px', boxShadow: colors.shadow, border: `1px solid ${colors.border}` },
      completeBtn: { width:'100%', padding:'10px', background:'#2ecc71', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold', marginTop:'10px' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
            <h1 style={{margin:0}}>👋 Hello, {user.username}</h1>
            <p style={{color: colors.subText, margin:0}}>Here is your work summary.</p>
        </div>
        <Link to="/company-requests" style={styles.linkBtn}>🔔 Find New Jobs ({stats.pending})</Link>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
            <h3 style={{margin:0, fontSize:'2rem'}}>{stats.ongoing}</h3>
            <p style={{color: colors.subText, margin:0}}>Ongoing Moves</p>
        </div>
        <div style={styles.statBox}>
            <h3 style={{margin:0, fontSize:'2rem'}}>{stats.completed}</h3>
            <p style={{color: colors.subText, margin:0}}>Completed Jobs</p>
        </div>
      </div>

      <h3 style={{color: '#2ecc71', borderBottom:'2px solid #2ecc71', display:'inline-block', marginTop:'30px'}}>🚚 My Ongoing Jobs</h3>
      {myOngoing.length === 0 ? <p style={{color: colors.subText}}>No active jobs. Go to Requests to find work.</p> : (
        <div style={styles.grid}>
            {myOngoing.map(req => (
                <div key={req.id} style={{...styles.card, borderLeft: '5px solid #2ecc71'}}>
                        <h4>📍 {req.source} ➝ {req.destination}</h4>
                        <p style={{color: colors.text}}>👤 {req.customer_name} | 📞 {req.customer_phone || 'Hidden'}</p>
                        <p style={{fontSize:'0.9rem', color: colors.subText}}>📅 {req.move_date}</p>
                        <p style={{fontSize:'0.9rem', color: colors.subText}}>📦 {req.items_list}</p>
                        <button onClick={()=>handleStatus(req.id, 'COMPLETED')} style={styles.completeBtn}>🏁 Mark Completed</button>
                </div>
            ))}
        </div>
      )}

      <h3 style={{color: '#3498db', borderBottom:'2px solid #3498db', display:'inline-block', marginTop:'40px'}}>📜 Work History</h3>
      {myHistory.length === 0 ? <p style={{color: colors.subText}}>No history yet.</p> : (
        <div style={styles.grid}>
            {myHistory.map(req => (
                <div key={req.id} style={{...styles.card, borderLeft: '5px solid #3498db', opacity: 0.8}}>
                        <h4>📍 {req.source} ➝ {req.destination}</h4>
                        <p style={{fontSize:'0.9rem', color: colors.subText}}>📅 {req.move_date}</p>
                        <span style={{background: req.status==='COMPLETED'?'#3498db':'#e74c3c', padding:'2px 8px', borderRadius:'4px', fontSize:'0.8rem', color:'white', fontWeight:'bold'}}>
                        {req.status}
                        </span>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;