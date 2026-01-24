import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookMovers = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    move_date: '',
    move_size: '1BHK',
    items_list: ''
  });

  // 👇 Testing ke liye Localhost use karein (Render par ye feature abhi nahi hai)
  const BACKEND_URL = 'http://127.0.0.1:8000'; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
        toast.error("Please Login to book movers! 🚚");
        navigate('/login');
        return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/relocation/move-requests/`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Request Sent! Movers will contact you shortly. ✅");
      navigate('/'); // Home par bhej do
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request. Try again.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={{color: 'var(--text-primary)', textAlign:'center'}}>🚚 Book Packers & Movers</h2>
        <p style={{textAlign:'center', color:'var(--text-secondary)', marginBottom:'20px'}}>Get verified movers for a hassle-free shift.</p>
        
        <form onSubmit={handleSubmit}>
          
          <div style={inputGroup}>
            <label>Moving From (Source)</label>
            <input name="source" type="text" placeholder="e.g. Malviya Nagar, Jaipur" onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Moving To (Destination)</label>
            <input name="destination" type="text" placeholder="e.g. Whitefield, Bangalore" onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={rowStyle}>
            <div style={{flex:1}}>
                <label>Move Date</label>
                <input name="move_date" type="date" onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{flex:1}}>
                <label>House Size</label>
                <select name="move_size" onChange={handleChange} style={inputStyle}>
                    <option>1BHK</option>
                    <option>2BHK</option>
                    <option>3BHK</option>
                    <option>Villa/Bungalow</option>
                    <option>Office</option>
                </select>
            </div>
          </div>

          <div style={inputGroup}>
            <label>List Major Items (Optional)</label>
            <textarea name="items_list" rows="3" placeholder="e.g. 1 Bed, 1 Fridge, 2 ACs..." onChange={handleChange} style={inputStyle}></textarea>
          </div>

          <button type="submit" style={btnStyle}>🚀 Send Request</button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '40px', display: 'flex', justifyContent: 'center', background: 'var(--bg-color)', minHeight:'90vh' };
const formCardStyle = { width: '100%', maxWidth: '500px', background: 'var(--card-bg)', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' };
const inputGroup = { marginBottom: '15px', display:'flex', flexDirection:'column', gap:'5px', color:'var(--text-primary)', fontWeight:'600' };
const rowStyle = { display:'flex', gap:'15px', marginBottom:'15px' };
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' };
const btnStyle = { width: '100%', padding: '12px', background: 'linear-gradient(135deg, #FF9966, #FF5E62)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight:'bold', marginTop:'10px' };

export default BookMovers;