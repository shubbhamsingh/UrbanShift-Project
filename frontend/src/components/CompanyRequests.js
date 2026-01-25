import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const CompanyRequests = () => {
  const navigate = useNavigate();
  const [newRequests, setNewRequests] = useState([]);

  // 👇 1. Smart URL Setup (Local aur Live dono ke liye)
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  useEffect(() => {
    const fetchRequests = async () => {
      try {
          const token = localStorage.getItem('token');
          if (!token) { navigate('/login'); return; }

          // 👇 Endpoint wahi rakha hai jo Django ViewSet use karta hai
          const res = await axios.get(`${BACKEND_URL}/api/relocation/move-requests/`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
          });
          
          // Sirf PENDING wale dikhao
          setNewRequests(res.data.filter(r => r.status === 'PENDING'));
      } catch (error) { 
          console.error("Error fetching requests:", error);
          // Agar 401 (Unauthorized) aaye, to hi logout karein
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
        navigate('/company-dashboard'); 
    } catch (err) { 
        console.error(err);
        toast.error("Failed to accept."); 
    }
  };

  return (
    <div style={{padding: '40px', background: '#121212', minHeight: '100vh', color: 'white'}}>
      <div style={{marginBottom:'30px'}}>
        <Link to="/company-dashboard" style={{color:'#aaa', textDecoration:'none'}}>← Back to Dashboard</Link>
        <h2 style={{color: '#f1c40f', borderBottom:'2px solid #f1c40f', display:'inline-block', marginTop:'10px'}}>🔔 New Available Jobs</h2>
        <p style={{color:'#888'}}>Accept these jobs to start working.</p>
      </div>

      {newRequests.length === 0 ? (
          <div style={{textAlign:'center', padding:'50px', border:'1px dashed #333', borderRadius:'10px'}}>
              <h3>No new jobs available right now. 📭</h3>
              <p style={{color:'#666'}}>Please check back later.</p>
          </div>
      ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
              {newRequests.map(req => (
                  <div key={req.id} style={{background: '#1e1e1e', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #f1c40f'}}>
                      {/* 👇 2. Field Names Update kiye (Database ke hisab se) */}
                      <h3 style={{margin:'0 0 10px 0'}}>📍 {req.source_city} ➝ {req.destination_city}</h3>
                      <p>📅 Date: {req.moving_date}</p>
                      <p>🏠 Size: {req.house_size}</p>
                      <div style={{background:'#333', padding:'10px', borderRadius:'5px', fontSize:'0.9rem', margin:'10px 0'}}>
                        📦 Items: {req.items_description}
                      </div>
                      <button onClick={()=>acceptJob(req.id)} style={{width:'100%', padding:'12px', background:'green', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold', fontSize:'1rem'}}>
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