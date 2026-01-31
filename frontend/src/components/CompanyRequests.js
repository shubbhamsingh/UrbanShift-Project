import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBoxOpen, FaTruck } from 'react-icons/fa';

// ✅ Theme Context Import
import { ThemeContext } from '../context/ThemeContext';

const CompanyRequests = () => {
  const navigate = useNavigate();
  const [newRequests, setNewRequests] = useState([]);

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
      shadow: isDark ? '0 4px 10px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)',
      itemBoxBg: isDark ? '#2a2a2a' : '#f0f2f5'
  };

  // 👇 Smart URL Setup
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  useEffect(() => {
    const fetchRequests = async () => {
      try {
          const token = localStorage.getItem('token');
          if (!token) { navigate('/login'); return; }

          const res = await axios.get(`${BACKEND_URL}/api/relocation/company-requests/`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
          });
          
          // Sirf 'PENDING' status wali jobs filter karein
          const pendingJobs = res.data.filter(r => r.status === 'PENDING');
          setNewRequests(pendingJobs);

      } catch (error) { 
          console.error("Error fetching requests:", error);
          if (error.response && error.response.status === 401) {
            toast.error("Session expired. Please login again.");
            navigate('/login');
          }
      }
    };

    fetchRequests();
  }, [navigate, BACKEND_URL]);

  const acceptJob = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${BACKEND_URL}/api/relocation/move-requests/${id}/update_status/`, 
            { status: 'ACCEPTED' }, 
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        toast.success("Job Accepted! Check Dashboard.");
        navigate('/company-dashboard'); // Updated redirect to match your routing
    } catch (err) { 
        console.error(err);
        toast.error("Failed to accept."); 
    }
  };

  // --- STYLES (Moved inside) ---
  const styles = {
      page: { padding: '40px', background: colors.bg, minHeight: '100vh', color: colors.text, transition: '0.3s' },
      header: { marginBottom:'30px' },
      backLink: { color: colors.subText, textDecoration:'none', display: 'inline-block', marginBottom: '10px' },
      title: { color: '#f1c40f', borderBottom:'2px solid #f1c40f', display:'inline-block', marginTop:'10px' },
      emptyBox: { textAlign:'center', padding:'50px', border:`1px dashed ${colors.border}`, borderRadius:'10px', color: colors.subText },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
      card: { 
          background: colors.cardBg, 
          padding: '20px', 
          borderRadius: '15px', 
          borderLeft: '5px solid #f1c40f', 
          boxShadow: colors.shadow,
          border: `1px solid ${colors.border}`
      },
      itemBox: { background: colors.itemBoxBg, padding:'10px', borderRadius:'8px', fontSize:'0.9rem', marginBottom:'20px', color: colors.subText, display: 'flex', gap: '8px' },
      acceptBtn: { width:'100%', padding:'12px', background:'linear-gradient(135deg, #2ecc71, #27ae60)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'1rem', boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/company-dashboard" style={styles.backLink}>← Back to Dashboard</Link>
        <div>
            <h2 style={styles.title}>🔔 New Available Jobs</h2>
            <p style={{color: colors.subText}}>Accept these jobs to start working.</p>
        </div>
      </div>

      {newRequests.length === 0 ? (
          <div style={styles.emptyBox}>
              <h3>No new jobs available right now. 📭</h3>
              <p>Please check back later.</p>
          </div>
      ) : (
          <div style={styles.grid}>
              {newRequests.map(req => (
                  <div key={req.id} style={styles.card}>
                      
                      {/* Header: Source -> Dest */}
                      <h3 style={{margin:'0 0 15px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: colors.text}}>
                        <FaMapMarkerAlt color="#f1c40f"/> {req.source} <span style={{color: colors.subText}}>➝</span> {req.destination}
                      </h3>
                      
                      {/* Details Grid */}
                      <div style={{display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '0.9rem', color: colors.subText}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                              <FaCalendarAlt /> {req.move_date}
                          </div>
                          <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                              <FaTruck /> {req.move_size}
                          </div>
                      </div>

                      {/* Customer Name */}
                      <p style={{color: colors.subText, fontSize: '0.9rem', marginBottom: '10px'}}>
                          👤 Customer: <strong style={{color: colors.text}}>{req.customer_name}</strong>
                      </p>

                      {/* Items List */}
                      <div style={styles.itemBox}>
                        <FaBoxOpen style={{marginTop: '3px', flexShrink: 0}} />
                        <span>{req.items_list || "No items listed"}</span>
                      </div>

                      {/* Accept Button */}
                      <button onClick={()=>acceptJob(req.id)} style={styles.acceptBtn}>
                        ✅ Accept Job
                      </button>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default CompanyRequests;