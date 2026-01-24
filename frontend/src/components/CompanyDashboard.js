import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState({ username: 'Company' });
  const [stats, setStats] = useState({ pending: 0, ongoing: 0, completed: 0 });
  
  const BACKEND_URL = 'http://127.0.0.1:8000';

  const fetchData = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        
        const userRes = await axios.get(`${BACKEND_URL}/api/users/me/`, config);
        setUser(userRes.data);

        const reqRes = await axios.get(`${BACKEND_URL}/api/relocation/move-requests/`, config);
        setRequests(reqRes.data);

        // Calculate Stats
        const p = reqRes.data.filter(r => r.status === 'PENDING').length;
        const o = reqRes.data.filter(r => r.status === 'ACCEPTED').length;
        const c = reqRes.data.filter(r => ['COMPLETED', 'CANCELLED'].includes(r.status)).length;
        setStats({ pending: p, ongoing: o, completed: c });

    } catch (error) {
        if(error.response && error.response.status === 401) navigate('/login');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatus = async (id, status) => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${BACKEND_URL}/api/relocation/move-requests/${id}/update_status/`, { status }, { headers: { 'Authorization': `Bearer ${token}` } });
        toast.success(`Job Updated!`);
        fetchData();
    } catch (err) { toast.error("Error updating status"); }
  };

  // 👇 FILTERS: Dashboard par sirf apna kaam dikhega
  const myOngoing = requests.filter(r => r.status === 'ACCEPTED');
  const myHistory = requests.filter(r => ['COMPLETED', 'CANCELLED'].includes(r.status));

  return (
    <div style={pageStyle}>
      
      {/* HEADER */}
      <div style={headerStyle}>
        <div>
            <h1 style={{margin:0}}>👋 Hello, {user.username}</h1>
            <p style={{color:'#aaa', margin:0}}>Here is your work summary.</p>
        </div>
        <Link to="/company-requests" style={linkBtn}>🔔 Find New Jobs ({stats.pending})</Link>
      </div>

      {/* STATS */}
      <div style={statsGrid}>
        <div style={statBox}><h3>{stats.ongoing}</h3><p>Ongoing Moves</p></div>
        <div style={statBox}><h3>{stats.completed}</h3><p>Completed Jobs</p></div>
      </div>

      {/* --- MY ONGOING JOBS --- */}
      <h3 style={{color: '#2ecc71', borderBottom:'2px solid #2ecc71', display:'inline-block', marginTop:'30px'}}>🚚 My Ongoing Jobs</h3>
      {myOngoing.length === 0 ? <p style={{color:'#666'}}>No active jobs. Go to Requests to find work.</p> : (
        <div style={gridStyle}>
            {myOngoing.map(req => (
                <div key={req.id} style={{...cardStyle, borderLeft: '5px solid #2ecc71'}}>
                        <h4>📍 {req.source} ➝ {req.destination}</h4>
                        <p>👤 {req.customer_name} | 📞 {req.customer_phone || 'Hidden'}</p>
                        <p style={{fontSize:'0.9rem'}}>📅 {req.move_date}</p>
                        <button onClick={()=>handleStatus(req.id, 'COMPLETED')} style={completeBtn}>🏁 Mark Completed</button>
                </div>
            ))}
        </div>
      )}

      {/* --- WORK HISTORY --- */}
      <h3 style={{color: '#3498db', borderBottom:'2px solid #3498db', display:'inline-block', marginTop:'40px'}}>📜 Work History</h3>
      {myHistory.length === 0 ? <p style={{color:'#666'}}>No history yet.</p> : (
        <div style={gridStyle}>
            {myHistory.map(req => (
                <div key={req.id} style={{...cardStyle, borderLeft: '5px solid #3498db', opacity: 0.6}}>
                        <h4>📍 {req.source} ➝ {req.destination}</h4>
                        <span style={{background: req.status==='COMPLETED'?'blue':'red', padding:'2px 6px', borderRadius:'4px', fontSize:'0.8rem', color:'white'}}>
                        {req.status}
                        </span>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

// Styles
const pageStyle = { padding: '40px', background: '#121212', minHeight: '100vh', color: 'white' };
const headerStyle = { display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' };
const linkBtn = { textDecoration:'none', background:'#f1c40f', color:'black', padding:'10px 20px', borderRadius:'5px', fontWeight:'bold' };
const statsGrid = { display: 'flex', gap: '20px' };
const statBox = { background: '#1e1e1e', padding: '20px', borderRadius: '10px', minWidth: '150px', textAlign: 'center', border: '1px solid #333' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '15px' };
const cardStyle = { background: '#1e1e1e', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' };
const completeBtn = { width:'100%', padding:'10px', background:'blue', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold', marginTop:'10px' };

export default CompanyDashboard;