import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBoxOpen, FaTruck } from 'react-icons/fa';

const CompanyRequests = () => {
  const navigate = useNavigate();
  const [newRequests, setNewRequests] = useState([]);

  // 👇 1. Smart URL Setup
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const BACKEND_URL = isLocal 
    ? "http://127.0.0.1:8000" 
    : "https://urbanshift-project.onrender.com";

  useEffect(() => {
    const fetchRequests = async () => {
      try {
          const token = localStorage.getItem('token');
          if (!token) { navigate('/login'); return; }

          // 👇 Sahi Endpoint use kar rahe hain
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
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px'}}>
              {newRequests.map(req => (
                  <div key={req.id} style={{background: '#1e1e1e', padding: '20px', borderRadius: '15px', borderLeft: '5px solid #f1c40f', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'}}>
                      
                      {/* 👇 Header: Source -> Dest */}
                      <h3 style={{margin:'0 0 15px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <FaMapMarkerAlt color="#f1c40f"/> {req.source} <span style={{color: '#666'}}>➝</span> {req.destination}
                      </h3>
                      
                      {/* Details Grid */}
                      <div style={{display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '0.9rem', color: '#ccc'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                              <FaCalendarAlt /> {req.move_date}
                          </div>
                          <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                              <FaTruck /> {req.move_size}
                          </div>
                      </div>

                      {/* Customer Name */}
                      <p style={{color: '#aaa', fontSize: '0.9rem', marginBottom: '10px'}}>
                          👤 Customer: <strong style={{color: 'white'}}>{req.customer_name}</strong>
                      </p>

                      {/* Items List */}
                      <div style={{background:'#2a2a2a', padding:'10px', borderRadius:'8px', fontSize:'0.9rem', marginBottom:'20px', color: '#ddd', display: 'flex', gap: '8px'}}>
                        <FaBoxOpen style={{marginTop: '3px', flexShrink: 0}} />
                        <span>{req.items_list || "No items listed"}</span>
                      </div>

                      {/* Accept Button */}
                      <button onClick={()=>acceptJob(req.id)} style={{width:'100%', padding:'12px', background:'linear-gradient(135deg, #2ecc71, #27ae60)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'1rem', boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)'}}>
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